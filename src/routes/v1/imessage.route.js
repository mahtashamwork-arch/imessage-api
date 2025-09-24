const express = require('express');
const { imessageController } = require('../../controllers');

const router = express.Router();

router.post("/send", imessageController.sendMessage);
router.get("/conversations", imessageController.listConversations);
router.get("/conversations/:chatId/messages", imessageController.getMessagesByChat);
router.get("/messages/:messageId/attachments", imessageController.getAttachmentsByMessage);
router.get("/receive", imessageController.receiveMessages);

module.exports = router;