from typing import List

import cv2
import numpy as np
from PIL import Image


def _line_ranges(binary: np.ndarray) -> List[tuple[int, int]]:
    height, width = binary.shape
    ink_by_row = (binary > 0).sum(axis=1)
    active = ink_by_row >= max(2, round(width * 0.004))
    max_gap = max(8, height // 150)

    ranges: List[tuple[int, int]] = []
    start = None
    gap = 0
    for index, has_ink in enumerate(active):
        if has_ink:
            if start is None:
                start = index
            gap = 0
            continue

        if start is None:
            continue
        gap += 1
        if gap > max_gap:
            end = index - gap + 1
            if end - start >= 8:
                ranges.append((start, end))
            start = None
            gap = 0

    if start is not None:
        end = len(active)
        if end - start >= 8:
            ranges.append((start, end))

    return ranges


def segment_lines(page: Image.Image) -> List[Image.Image]:
    """Return top-to-bottom line crops, leaving layout upgrades behind this boundary."""
    grayscale = np.array(page.convert("L"))
    binary = cv2.adaptiveThreshold(
        grayscale,
        255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY_INV,
        31,
        15,
    )

    # Remove long ruled-paper strokes from the segmentation mask only. Crops use
    # the original grayscale page so handwriting pixels are not discarded.
    horizontal_kernel = cv2.getStructuringElement(
        cv2.MORPH_RECT,
        (max(30, grayscale.shape[1] // 8), 1),
    )
    ruled_lines = cv2.morphologyEx(binary, cv2.MORPH_OPEN, horizontal_kernel)
    segmentation_mask = cv2.subtract(binary, ruled_lines)
    ranges = _line_ranges(segmentation_mask)

    if not ranges:
        return [page]

    padding = max(12, grayscale.shape[0] // 100)
    crops = []
    for start, end in ranges:
        top = max(0, start - padding)
        bottom = min(grayscale.shape[0], end + padding)
        crops.append(page.crop((0, top, grayscale.shape[1], bottom)))
    return crops
