const express = require("express");

const router = express.Router();

const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  digitizeDocument,
  updateDocumentText,
  generateDocumentPdf,
  deleteDocument,
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

router.put("/:id/text", protect, updateDocumentText);
router.get("/:id/pdf", protect, generateDocumentPdf);
router.delete("/:id", protect, deleteDocument);

// Get all documents belonging to logged-in user
router.get(
  "/",
  protect,
  getDocuments
);

router.get("/:id", protect, getDocumentById);

module.exports = router;