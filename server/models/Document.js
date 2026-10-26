const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    originalFileName: {
      type: String,
      required: true,
    },

    storedFileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    recognizedText: {
      type: String,
      default: "",
    },

    textManuallyEdited: {
      type: Boolean,
      default: false,
    },

    recognitionEngine: {
      type: String,
      default: null,
    },

    recognitionConfidence: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    recognitionPages: [
      {
        pageNumber: Number,
        text: String,
        confidence: {
          type: Number,
          min: 0,
          max: 100,
          default: null,
        },
        engine: String,
      },
    ],

    status: {
      type: String,
      enum: ["uploaded", "processing", "completed", "failed"],
      default: "uploaded",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document", documentSchema);