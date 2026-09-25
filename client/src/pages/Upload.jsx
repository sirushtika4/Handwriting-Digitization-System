import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, ArrowLeft } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Upload() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a JPG, PNG or PDF file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File must be smaller than 10 MB.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);

    if (!title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (event) => {
  event.preventDefault();

  if (!file) {
    setError("Please select a file to upload.");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("document", file);

    const token = localStorage.getItem("token");

    const response = await api.post(
      "/documents/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      setMessage("Document uploaded successfully!");

      // Do NOT clear the file immediately.
      // Let the user see what was successfully uploaded.

      setTimeout(() => {
        navigate("/documents");
      }, 1500);
    }

  } catch (err) {
    console.error("Upload error:", err);

    setError(
      err.response?.data?.message ||
      "Document upload failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="upload-page">
      <Navbar />

      <div className="upload-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="upload-heading">
          <h1>Upload Handwriting</h1>

          <p>
            Upload a handwritten image or PDF to begin digitization.
          </p>
        </div>

        <form
          className="upload-form"
          onSubmit={handleUpload}
        >

          <label>Document Title</label>

          <input
            type="text"
            placeholder="Example: Lecture Notes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label
            className="upload-dropzone"
            htmlFor="document-file"
          >
            <UploadCloud size={48} />

            <h3>Select handwritten document</h3>

            <p>
              JPG, PNG or PDF — maximum 10 MB
            </p>

            <span>Choose File</span>

            <input
              id="document-file"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {file && (
            <div className="selected-file">
              <FileText size={22} />

              <div>
                <strong>{file.name}</strong>

                <p>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <button
            className="upload-submit"
            type="submit"
            disabled={loading || !file}
          >
            {loading
              ? "Uploading..."
              : "Upload Document"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Upload;