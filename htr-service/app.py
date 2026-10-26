import logging
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.concurrency import run_in_threadpool

from services.preprocessing import preprocess_page
from services.recognition import MODEL_NAME, TrOCRRecognizer
from services.segmentation import segment_lines

logger = logging.getLogger("htr-service")
recognizer: Optional[TrOCRRecognizer] = None
model_error: Optional[str] = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global recognizer, model_error
    try:
        logger.info("Loading %s", MODEL_NAME)
        recognizer = TrOCRRecognizer()
        logger.info("TrOCR loaded on %s", recognizer.device)
    except Exception as error:
        model_error = str(error)
        logger.exception("Unable to load TrOCR model")
    yield


app = FastAPI(title="Ink2Digital HTR Service", lifespan=lifespan)


@app.get("/health")
async def health():
    return {
        "status": "ready" if recognizer else "degraded",
        "model": MODEL_NAME,
        "model_loaded": recognizer is not None,
        "device": str(recognizer.device) if recognizer else None,
        "error": model_error,
    }


@app.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    if recognizer is None:
        raise HTTPException(status_code=503, detail="HTR model is not available.")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="An image file is required.")

    try:
        page = preprocess_page(await file.read())
        lines = segment_lines(page)
        line_text = await run_in_threadpool(recognizer.recognize_lines, lines)
    except Exception as error:
        logger.exception("HTR inference failed")
        raise HTTPException(status_code=500, detail="HTR inference failed.") from error

    output_lines = [
        {"text": text, "confidence": None}
        for text in line_text
        if text
    ]
    return {
        "success": True,
        "engine": "trocr",
        "text": "\n".join(line["text"] for line in output_lines),
        "lines": output_lines,
    }
