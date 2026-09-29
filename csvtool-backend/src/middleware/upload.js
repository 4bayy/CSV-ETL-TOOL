const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { nanoid } = require("nanoid");
const config = require("../config");

if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${nanoid(6)}${ext}`);
  },
});

const ALLOWED_EXT = [".csv", ".tsv", ".txt", ".xlsx", ".xls"];

const upload = multer({
  storage,
  limits: { fileSize: config.maxUploadBytes },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return cb(Object.assign(new Error(`Unsupported file type: ${ext}`), { status: 400 }));
    }
    cb(null, true);
  },
});

module.exports = upload;
