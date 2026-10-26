const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const sharp = require("sharp");

const createTemporaryDirectory = () => fs.mkdtemp(path.join(os.tmpdir(), "ink2digital-"));

const preprocessImage = async (input) => {
  const temporaryDirectory = await createTemporaryDirectory();
  const outputPath = path.join(temporaryDirectory, "preprocessed.png");

  try {
    await sharp(input)
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: false,
      })
      .grayscale()
      .normalize()
      .sharpen({ sigma: 1 })
      .png()
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    await fs.rm(temporaryDirectory, { recursive: true, force: true }).catch(() => {});
    throw error;
  }
};

const cleanupPreprocessedImage = async (filePath) => {
  if (!filePath) return;
  await fs.rm(path.dirname(filePath), { recursive: true, force: true }).catch(() => {});
};

module.exports = {
  preprocessImage,
  cleanupPreprocessedImage,
};
