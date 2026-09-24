const Document = require("../models/Document");
const { recognizeHandwriting } = require("../services/ocrService");

// Upload a new handwritten document
const uploadDocument = async (req, res) => {
  try {
    // Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload.",
      });
    }

    // Use provided title or original filename
    const title =
      req.body.title?.trim() ||
      req.file.originalname.replace(/\.[^/.]+$/, "");

    // Create document record in MongoDB
    const document = await Document.create({
      user: req.user._id,
      title: title,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: "uploaded",
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully.",
      document: {
        id: document._id,
        title: document.title,
        originalFileName: document.originalFileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        status: document.status,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload document.",
    });
  }
};
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });

  } catch (error) {
    console.error("Get documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve documents.",
    });
  }
};
const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });

  } catch (error) {
    console.error("Get document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve document.",
    });
  }
};
// Digitize an uploaded handwritten document
const digitizeDocument = async (req, res) => {
  try {
    // Find document and make sure it belongs to logged-in user
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
      });
    }

    // Tesseract.js will initially handle images only
    const supportedImageTypes = [
      "image/jpeg",
      "image/png",
    ];

    if (!supportedImageTypes.includes(document.fileType)) {
      return res.status(400).json({
        success: false,
        message:
          "OCR currently supports JPG and PNG images. PDF support will be added next.",
      });
    }

    // Change status while OCR is running
    document.status = "processing";
    await document.save();

    try {
      // Run OCR
      const recognizedText = await recognizeHandwriting(
        document.filePath
      );

      // Save OCR result
      document.recognizedText = recognizedText.trim();
      document.status = "completed";

      await document.save();

      return res.status(200).json({
        success: true,
        message: "Handwriting digitized successfully.",
        document: {
          id: document._id,
          title: document.title,
          recognizedText: document.recognizedText,
          status: document.status,
        },
      });

    } catch (ocrError) {
      document.status = "failed";
      await document.save();

      console.error("OCR processing error:", ocrError);

      return res.status(500).json({
        success: false,
        message: "Handwriting recognition failed.",
      });
    }

  } catch (error) {
    console.error("Digitize document error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to digitize document.",
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  digitizeDocument,
};