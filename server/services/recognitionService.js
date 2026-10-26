const fs = require("fs/promises");
const { recognize } = require("tesseract.js");

const HTR_REQUEST_TIMEOUT_MS = 30_000;

const normalizeConfidence = (confidence) => (
  Number.isFinite(confidence) ? confidence : null
);

const recognizeWithTesseract = async (input) => {
  const result = await recognize(input, "eng", {
    logger: (info) => {
      if (info.status === "recognizing text") {
        console.log(`OCR progress: ${Math.round(info.progress * 100)}%`);
      }
    },
  });

  return {
    text: result.data.text || "",
    confidence: normalizeConfidence(result.data.confidence),
    engine: "tesseract",
  };
};

const recognizeWithHTR = async (input) => {
  const serviceUrl = process.env.HTR_SERVICE_URL;
  if (!serviceUrl) {
    throw new Error("HTR service is not configured.");
  }

  const imageBuffer = Buffer.isBuffer(input) ? input : await fs.readFile(input);
  const formData = new FormData();
  formData.append("file", new Blob([imageBuffer], { type: "image/png" }), "document.png");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HTR_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${serviceUrl.replace(/\/$/, "")}/recognize`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTR service request failed with status ${response.status}.`);
    }

    const result = await response.json();
    if (
      result.success !== true ||
      typeof result.text !== "string" ||
      !Array.isArray(result.lines) ||
      result.lines.some((line) => typeof line?.text !== "string")
    ) {
      throw new Error("HTR service returned an invalid response.");
    }

    return {
      text: result.text,
      confidence: normalizeConfidence(result.confidence),
      engine: result.engine || "trocr",
      lines: result.lines,
    };
  } finally {
    clearTimeout(timeout);
  }
};

const recognizeImage = async (input) => {
  if (process.env.OCR_ENGINE !== "tesseract" && process.env.HTR_SERVICE_URL) {
    try {
      return await recognizeWithHTR(input);
    } catch (error) {
      console.error("HTR service unavailable - using Tesseract fallback.", error.message);
      const fallback = await recognizeWithTesseract(input);
      return { ...fallback, engine: "tesseract-fallback" };
    }
  }

  return recognizeWithTesseract(input);
};

module.exports = {
  recognizeImage,
  recognizeWithTesseract,
  recognizeWithHTR,
};
