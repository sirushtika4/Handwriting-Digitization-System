from io import BytesIO

from PIL import Image, ImageFilter, ImageOps


def preprocess_page(image_bytes: bytes) -> Image.Image:
    """Normalize a photographed page without aggressively erasing handwriting."""
    with Image.open(BytesIO(image_bytes)) as source:
        image = ImageOps.exif_transpose(source).convert("L")

    image = ImageOps.autocontrast(image, cutoff=1)

    longest_edge = max(image.size)
    if longest_edge < 1600:
        scale = 1600 / longest_edge
        image = image.resize(
            (round(image.width * scale), round(image.height * scale)),
            Image.Resampling.LANCZOS,
        )
    elif longest_edge > 2400:
        scale = 2400 / longest_edge
        image = image.resize(
            (round(image.width * scale), round(image.height * scale)),
            Image.Resampling.LANCZOS,
        )

    # A light unsharp mask improves line boundaries while preserving thin strokes.
    return image.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=3))
