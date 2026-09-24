const { recognize } = require("tesseract.js");

const recognizeHandwriting = async (filePath) => {
  try {
    console.log("OCR started:", filePath);

    const result = await recognize(filePath, "eng", {
      logger: (info) => {
        if (info.status === "recognizing text") {
          console.log(
            `OCR progress: ${Math.round(info.progress * 100)}%`
          );
        }
      },
    });

    const text = result.data.text;

    console.log("OCR completed successfully");

    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error("Unable to recognize text from document.");
  }
};

module.exports = {
  recognizeHandwriting,
};
