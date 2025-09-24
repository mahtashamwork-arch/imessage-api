const { exec } = require("child_process");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const dbPath = path.join(process.env.HOME || process.env.USERPROFILE, "Library", "Messages", "chat.db");

// -----------------------------------------------------
// 1. SEND MESSAGE
// -----------------------------------------------------
const sendMessage = catchAsync(async (req, res) => {
  const { icloudId, message } = req.body;

  const safeMessage = message.replace(/"/g, '\\"');
  const safeIcloudId = icloudId.replace(/"/g, '\\"');

  const appleScript = `
    tell application "Messages"
      set targetService to 1st service whose service type = iMessage
      set targetBuddy to buddy "${safeIcloudId}" of targetService
      send "${safeMessage}" to targetBuddy
    end tell
  `;

  exec(`osascript -e '${appleScript}'`, (error) => {
    if (error) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: error.message });
    }
    res.status(httpStatus.OK).json({ message: "Message sent successfully" });
  });
});

// -----------------------------------------------------
// 2. LIST CONVERSATIONS
// -----------------------------------------------------
const listConversations = catchAsync(async (req, res) => {
  const db = new sqlite3.Database(dbPath);
  const query = `
    SELECT c.rowid AS chat_id, c.guid, c.display_name
    FROM chat c
    ORDER BY c.rowid DESC
    LIMIT 20
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    res.status(httpStatus.OK).json({ conversations: rows });
  });
  db.close();
});

// -----------------------------------------------------
// 3. GET MESSAGES IN A CONVERSATION
// -----------------------------------------------------
const getMessagesByChat = catchAsync(async (req, res) => {
  const { chatId } = req.params;
  const db = new sqlite3.Database(dbPath);

  const query = `
    SELECT m.rowid AS message_id,
           m.text,
           datetime(m.date / 1000000000 + strftime('%s','2001-01-01'), 'unixepoch') AS date,
           h.id AS sender_handle,
           m.is_from_me,
           m.associated_message_guid
    FROM message m
    JOIN chat_message_join cmj ON m.rowid = cmj.message_id
    JOIN chat c ON c.rowid = cmj.chat_id
    LEFT JOIN handle h ON m.handle_id = h.rowid
    WHERE c.rowid = ?
    ORDER BY m.date DESC
    LIMIT 50
  `;

  db.all(query, [chatId], (err, rows) => {
    if (err) return res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    res.status(httpStatus.OK).json({ messages: rows });
  });
  db.close();
});

// -----------------------------------------------------
// 4. FETCH ATTACHMENTS
// -----------------------------------------------------
const getAttachmentsByMessage = catchAsync(async (req, res) => {
  const { messageId } = req.params;
  const db = new sqlite3.Database(dbPath);

  const query = `
    SELECT a.rowid AS attachment_id,
           a.filename,
           a.mime_type,
           a.transfer_name
    FROM attachment a
    JOIN message_attachment_join maj ON a.rowid = maj.attachment_id
    WHERE maj.message_id = ?
  `;

  db.all(query, [messageId], (err, rows) => {
    if (err) return res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
    res.status(httpStatus.OK).json({ attachments: rows });
  });
  db.close();
});

// -----------------------------------------------------
// 5. RECEIVE & SYNC NEW MESSAGES
// -----------------------------------------------------
async function fetchAndSaveMessages() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    const query = `
      SELECT m.rowid AS message_id,
             m.text,
             datetime(m.date / 1000000000 + strftime('%s','2001-01-01'), 'unixepoch') AS received_date,
             h.id AS sender_handle,
             m.is_from_me
      FROM message m
      LEFT JOIN handle h ON m.handle_id = h.rowid
      ORDER BY m.date DESC
      LIMIT 20
    `;

    db.all(query, async (err, rows) => {
      if (err) return reject(err);

      const saved = [];
      for (const row of rows) {
        if (row.is_from_me === 1) continue; // ✅ only received messages

        // Deduplicate by message_id
        const { data: existing } = await supabase
          .from("imessages")
          .select("message_id")
          .eq("message_id", row.message_id)
          .maybeSingle();

        if (!existing) {
          const { error: dbError } = await supabase.from("imessages").insert({
            message_id: row.message_id.toString(),
            message_text: row.text,
            sender_handle: row.sender_handle,
            received_date: row.received_date,
            created_at: new Date()
          });

          if (!dbError) saved.push(row);
        }
      }
      db.close();
      resolve(saved);
    });
  });
}

const receiveMessages = catchAsync(async (req, res) => {
  try {
    const savedMessages = await fetchAndSaveMessages();
    res.status(httpStatus.OK).json({
      message: "Messages synced successfully",
      count: savedMessages.length,
      messages: savedMessages,
    });
  } catch (err) {
    res.status(httpStatus.BAD_REQUEST).json({ error: err.message });
  }
});

// Background sync every 5 seconds
setInterval(async () => {
  try {
    const msgs = await fetchAndSaveMessages();
    if (msgs.length > 0) {
      console.log(`[iMessage Sync] Saved ${msgs.length} new messages.`);
    }
  } catch (err) {
    console.error("[iMessage Sync Error]", err.message);
  }
}, 5000);

// -----------------------------------------------------
module.exports = {
  sendMessage,
  listConversations,
  getMessagesByChat,
  getAttachmentsByMessage,
  receiveMessages,
};
