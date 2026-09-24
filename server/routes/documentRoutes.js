const express = require("express");

const router = express.Router();

const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  digitizeDocument,
} = require("../controllers/documentController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Upload a document
router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadDocument
);
router.post(
  "/:id/digitize",
  protect,
  digitizeDocument
);

// Get all documents belonging to logged-in user
router.get(
  "/",
  protect,
  getDocumentById
);

module.exports = router;