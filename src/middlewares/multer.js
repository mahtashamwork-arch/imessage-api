const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirectory = path.join(process.cwd(), 'storage');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const originalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
   
    const originalName = path.parse(file.originalname).name;
    const extension = path.parse(file.originalname).ext;
    let uniqueName = file.originalname;
    let counter = 1;
    while (fs.existsSync(path.join(uploadDirectory, uniqueName))) {
      uniqueName = `${originalName}-${counter}${extension}`;
      counter++;
    }

    cb(null, uniqueName);
  }
});

const upload = multer({ storage: originalStorage });

module.exports = upload;
