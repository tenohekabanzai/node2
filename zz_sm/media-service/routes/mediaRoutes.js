const express = require("express");
const multer = require("multer");

const { uploadMedia } = require("../controllers/mediaController");
const { authenticateRequest } = require("../middleware/authMiddleware");

const router = express.Router();

// configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

router.post(
  "/upload",
  authenticateRequest,
  (req, res, next) => {
    console.log("Hello from Multer authMiddleware")
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log("Multer Error while uploading", err);
        return res
          .status(400)
          .json({
            success: false,
            message: "Multer Error while uploading",
            error: err.message,
            stack: err.stack,
          });
      } else if (err) {
        console.log("some Error occured while uploading", err);
        return res
          .status(500)
          .json({
            success: false,
            message: "some Error occured while uploading",
            error: err.message,
            stack: err.stack,
          });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File not found for uploading",
        });
      }
      next();
    });
  },
  uploadMedia
);

module.exports = router