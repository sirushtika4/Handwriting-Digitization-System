const Document = require("../models/Document");
const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const { recognizeHandwriting, recognizePdf } = require("../services/ocrService");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const findOwnedDocument = async (id, userId) => {
  if (!isValidId(id)) return null;
  return Document.findOne({ _id: id, user: userId });
};

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
    const document = await findOwnedDocument(req.params.id, req.user._id);

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

    return res.status(isValidId(req.params.id) ? 500 : 400).json({
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

    // Change status while OCR is running
    document.status = "processing";
    await document.save();

    try {
      const isPdf = document.fileType === "application/pdf";
      // Run OCR
      const recognition = isPdf
        ? await recognizePdf(document.filePath)
        : await recognizeHandwriting(document.filePath);

      if (!document.textManuallyEdited) {
        document.recognizedText = recognition.text.trim();
      }
      document.recognitionEngine = recognition.engine;
      document.recognitionConfidence = recognition.confidence;
      document.recognitionPages = recognition.pages || [];
      document.status = "completed";

      await document.save();

      return res.status(200).json({
        success: true,
        message: "Handwriting digitized successfully.",
        document: {
          id: document._id,
          title: document.title,
          recognizedText: document.recognizedText,
          textManuallyEdited: document.textManuallyEdited,
          recognitionEngine: document.recognitionEngine,
          recognitionConfidence: document.recognitionConfidence,
          recognitionPages: document.recognitionPages,
          status: document.status,
        },
      });

    } catch (ocrError) {
      document.status = "failed";
      await document.save();

      console.error("OCR processing error:", {
        documentId: document._id.toString(),
        fileType: document.fileType,
        filePath: document.filePath,
        error: ocrError.stack || ocrError.message,
      });

      const message = document.fileType === "application/pdf"
        ? ocrError.message
        : "Handwriting recognition failed.";

      return res.status(500).json({
        success: false,
        message,
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

const updateDocumentText = async (req, res) => {
  try {
    const document = await findOwnedDocument(req.params.id, req.user._id);
    if (!document) return res.status(404).json({ success: false, message: "Document not found." });
    if (typeof req.body.recognizedText !== "string") {
      return res.status(400).json({ success: false, message: "Recognized text must be a string." });
    }

    document.recognizedText = req.body.recognizedText;
  document.textManuallyEdited = true;
    await document.save();
    return res.status(200).json({ success: true, message: "Changes saved successfully.", document });
  } catch (error) {
    console.error("Update document text error:", error);
    return res.status(isValidId(req.params.id) ? 500 : 400).json({ success: false, message: "Unable to save document text." });
  }
};

const generateDocumentPdf = async (req, res) => {
  try {
    const document = await findOwnedDocument(req.params.id, req.user._id);
    if (!document) return res.status(404).json({ success: false, message: "Document not found." });

    const pdf = new PDFDocument({ margin: 60, bufferPages: true });
    const filename = `${document.title.replace(/[^a-z0-9-_]+/gi, "-") || "document"}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    pdf.pipe(res);
    pdf.fontSize(20).text(document.title, { align: "center" });
    pdf.moveDown();
    pdf.fontSize(12).text(document.recognizedText || "No digitized text has been saved yet.", { lineGap: 5 });

    const range = pdf.bufferedPageRange();
    for (let pageIndex = range.start; pageIndex < range.start + range.count; pageIndex += 1) {
      pdf.switchToPage(pageIndex);
      pdf.fontSize(9).text(`Page ${pageIndex + 1}`, 60, pdf.page.height - 45, { align: "center", width: pdf.page.width - 120 });
    }
    return pdf.end();
  } catch (error) {
    console.error("Generate PDF error:", error);
    return res.status(isValidId(req.params.id) ? 500 : 400).json({ success: false, message: "Unable to generate PDF." });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await findOwnedDocument(req.params.id, req.user._id);
    if (!document) return res.status(404).json({ success: false, message: "Document not found." });

    await Document.deleteOne({ _id: document._id });
    await fs.unlink(path.resolve(document.filePath)).catch(() => {});
    return res.status(200).json({ success: true, message: "Document deleted successfully." });
  } catch (error) {
    console.error("Delete document error:", error);
    return res.status(isValidId(req.params.id) ? 500 : 400).json({ success: false, message: "Unable to delete document." });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  digitizeDocument,
  updateDocumentText,
  generateDocumentPdf,
  deleteDocument,
};