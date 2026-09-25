const fs = require("fs/promises");
const { recognize } = require("tesseract.js");

const recognizeImage = async (image) => {
  const result = await recognize(image, "eng", {
    logger: (info) => {
      if (info.status === "recognizing text") {
        console.log(`OCR progress: ${Math.round(info.progress * 100)}%`);
      }
    },
  });

  return result.data.text;
};

const recognizeHandwriting = async (filePath) => {
  try {
    console.log("OCR started:", filePath);

    const text = await recognizeImage(filePath);
    return text.trim();
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Unable to recognize text from document.");
  }
};

const recognizePdf = async (filePath) => {
  let pdfDocument;
  let loadingTask;

  try {
    const { createCanvas, DOMMatrix, ImageData, Path2D } = require("@napi-rs/canvas");
    global.DOMMatrix = DOMMatrix;
    global.ImageData = ImageData;
    global.Path2D = Path2D;

    let pdfData;
    try {
      pdfData = new Uint8Array(await fs.readFile(filePath));
    } catch (error) {
      console.error("[PDF OCR] Unable to read PDF:", error);
      throw new Error("Unable to read PDF file.");
    }

    let pdfjs;
    try {
      pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    } catch (error) {
      console.error("[PDF OCR] Unable to initialize PDF renderer:", error);
      throw new Error("Unable to initialize PDF renderer.");
    }

    try {
      loadingTask = pdfjs.getDocument({ data: pdfData, useSystemFonts: true });
      pdfDocument = await loadingTask.promise;
    } catch (error) {
      console.error("[PDF OCR] Invalid or corrupted PDF:", error);
      throw new Error("PDF is invalid or corrupted.");
    }

    if (!pdfDocument.numPages) {
      throw new Error("PDF contains no pages.");
    }

    const pages = [];
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
      console.log(`[PDF OCR] Rendering page ${pageNumber}/${pdfDocument.numPages}`);
      const page = await pdfDocument.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));

      try {
        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        }).promise;
      } catch (error) {
        console.error(`[PDF OCR] Unable to render page ${pageNumber}:`, error);
        throw new Error(`Unable to render PDF page ${pageNumber}.`);
      }

      try {
        const pageText = (await recognizeImage(canvas.toBuffer("image/png"))).trim();
        pages.push(`--- Page ${pageNumber} ---\n${pageText}`);
        console.log(`[PDF OCR] Page ${pageNumber} OCR completed`);
      } catch (error) {
        console.error(`[PDF OCR] OCR failed for page ${pageNumber}:`, error);
        throw new Error(`OCR failed for PDF page ${pageNumber}.`);
      } finally {
        page.cleanup();
      }
    }

    const combinedText = pages.join("\n\n").trim();
    if (!combinedText.replace(/--- Page \d+ ---/g, "").trim()) {
      throw new Error("No recognizable text was detected.");
    }

    return combinedText;
  } finally {
    if (pdfDocument) {
      await pdfDocument.cleanup().catch((error) => console.error("[PDF OCR] Cleanup error:", error));
    }
    if (loadingTask) {
      await loadingTask.destroy().catch((error) => console.error("[PDF OCR] Renderer cleanup error:", error));
    }
  }
};

module.exports = {
  recognizeHandwriting,
  recognizePdf,
};
