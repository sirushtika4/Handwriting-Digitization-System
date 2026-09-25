import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  WandSparkles,
  Calendar,
  HardDrive,
  Download,
  Save,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import Navbar from "../components/Navbar";

function DocumentDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchDocument = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await api.get(
          `/documents/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDocument(response.data.document);
        setRecognizedText(response.data.document.recognizedText || "");

      } catch (err) {

        console.error("Document loading error:", err);

        setError("Unable to load document.");

      } finally {

        setLoading(false);

      }
    };

    fetchDocument();

  }, [id]);

  const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const handleDigitize = async () => {
    try {
      setProcessing(true);
      setError("");
      setMessage("");
      const response = await api.post(`/documents/${id}/digitize`, {}, authConfig());
      setDocument((current) => ({ ...current, ...response.data.document }));
      setRecognizedText(response.data.document.recognizedText || "");
      setMessage("Handwriting digitized successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Handwriting recognition failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setMessage("");
      const response = await api.put(`/documents/${id}/text`, { recognizedText }, authConfig());
      setDocument((current) => ({ ...current, ...response.data.document }));
      setMessage("Changes saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      setError("");
      const response = await api.get(`/documents/${id}/pdf`, { ...authConfig(), responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `${document.title || "document"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to generate PDF.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this document permanently?")) return;
    try {
      await api.delete(`/documents/${id}`, authConfig());
      navigate("/documents");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete document.");
    }
  };

  if (loading) {
    return (
      <div className="document-details-page">
        <p>Loading document...</p>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="document-details-page">

        <button onClick={() => navigate("/documents")}>
          <ArrowLeft size={18} />
          My Documents
        </button>

        <p>{error || "Document not found."}</p>

      </div>
    );
  }

  const fileURL =
    `http://localhost:5000/uploads/${document.storedFileName}`;

  const isPDF =
    document.fileType === "application/pdf";

  return (

    <div className="document-details-page">
      <Navbar />

      <div className="document-details-container">

        <button
          className="back-button"
          onClick={() => navigate("/documents")}
        >
          <ArrowLeft size={18} />
          My Documents
        </button>


        <div className="document-details-header">

          <div>

            <h1>{document.title}</h1>

            <p>
              Original handwritten document
            </p>

          </div>

          <button className="digitize-button" onClick={handleDigitize} disabled={processing}>
            <WandSparkles size={18} />
            {processing ? "Digitizing..." : "Digitize Handwriting"}
          </button>

        </div>


        <div className="document-metadata">

          <div>
            <FileText size={20} />

            <span>
              {document.originalFileName}
            </span>
          </div>

          <div>
            <HardDrive size={20} />

            <span>
              {(document.fileSize / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>

          <div>
            <Calendar size={20} />

            <span>
              {new Date(
                document.createdAt
              ).toLocaleDateString()}
            </span>
          </div>

          <div>
            Status:
            <strong>
              {" "}
              {document.status}
            </strong>
          </div>

        </div>


        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="document-workspace">
          <section className="document-panel">
            <h2>Original Document</h2>
            {isPDF ? <iframe src={fileURL} title="Document Preview" /> : <img src={fileURL} alt={document.title} />}
          </section>

          <section className="document-panel digitized-panel">
            <div className="panel-heading">
              <h2>Digitized Text</h2>
              <span className={`status-badge status-${document.status}`}>{document.status}</span>
            </div>
            <textarea value={recognizedText} onChange={(event) => setRecognizedText(event.target.value)} placeholder="Digitized text will appear here." />
            <div className="text-counts">
              <span>{recognizedText.trim() ? recognizedText.trim().split(/\s+/).length : 0} words</span>
              <span>{recognizedText.length} characters</span>
            </div>
            <div className="document-actions">
              <button onClick={handleSave} disabled={saving}><Save size={16} />{saving ? "Saving..." : "Save Changes"}</button>
              <button onClick={handleDownload} disabled={!recognizedText.trim()}><Download size={16} />Generate PDF</button>
              <button className="danger-button" onClick={handleDelete}><Trash2 size={16} />Delete Document</button>
            </div>
          </section>
        </div>

      </div>

    </div>
  );
}

export default DocumentDetails;