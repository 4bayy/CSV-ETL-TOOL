require("dotenv").config();
const path = require("path");

module.exports = {
  port: Number(process.env.PORT || 4000),
  uploadDir: path.join(process.cwd(), process.env.UPLOAD_DIR || "uploads"),
  maxUploadBytes: Number(process.env.MAX_UPLOAD_MB || 50) * 1024 * 1024,
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
