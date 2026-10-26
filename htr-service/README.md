# Ink2Digital HTR service

This service owns only handwritten text inference. The Node backend continues to own authentication, uploads, MongoDB, document management, preprocessing orchestration, and PDF rendering.

## Windows setup

From the repository root:

```powershell
cd htr-service
python -m venv venv
venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8000
```

The first startup downloads `microsoft/trocr-base-handwritten` from Hugging Face and may take several minutes. Model files are cached locally after the first successful download. The service uses CUDA automatically when PyTorch detects it; otherwise it uses the CPU.

Check readiness at `http://127.0.0.1:8000/health`. `model_loaded` must be `true` before Node can use TrOCR.

## Request example

```powershell
curl.exe -X POST http://127.0.0.1:8000/recognize -F "file=@C:\path\to\handwritten-page.jpg"
```

The response contains the recognized text and ordered line results. Confidence is `null` because this model does not provide a calibrated confidence score for these outputs.

## Notes and limitations

The initial segmenter targets ordinary single-column handwritten paragraphs. It uses grayscale normalization, adaptive thresholding, ruled-line suppression for the segmentation mask, horizontal projection, padding, and top-to-bottom ordering. The original pixels are used for each crop so thin handwriting is not removed.

Tables, multiple columns, diagrams, severe skew, and heavily overlapping writing are not reconstructed perfectly. The segmentation module is intentionally isolated so a later layout/region detector can replace it without changing the API.
