from typing import List

import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

MODEL_NAME = "microsoft/trocr-base-handwritten"


class TrOCRRecognizer:
    """Owns one processor/model pair for the lifetime of the FastAPI process."""

    def __init__(self, model_name: str = MODEL_NAME) -> None:
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.processor = TrOCRProcessor.from_pretrained(model_name)
        self.model = VisionEncoderDecoderModel.from_pretrained(model_name)
        self.model.to(self.device)
        self.model.eval()

    def recognize_lines(self, lines: List[Image.Image]) -> List[str]:
        recognized = []
        for line in lines:
            inputs = self.processor(images=line, return_tensors="pt")
            pixel_values = inputs.pixel_values.to(self.device)
            with torch.inference_mode():
                generated_ids = self.model.generate(pixel_values, max_new_tokens=128)
            text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
            recognized.append(text.strip())
        return recognized
