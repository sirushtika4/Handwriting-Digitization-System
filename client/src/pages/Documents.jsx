import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Upload,
} from "lucide-react";

import api from "../services/api";

function Documents() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await api.get("/documents", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setDocuments(response.data.documents);

      } catch (err) {
        console.error(err);

        setError("Unable to load your documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="documents-page">

      <div className="documents-container">

        <button
          className="back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        <div className="documents-top">

          <div>
            <h1>My Documents</h1>

            <p>
              Manage your uploaded and digitized documents.
            </p>
          </div>

          <button
            className="new-upload-button"
            onClick={() => navigate("/upload")}
          >
            <Upload size={18} />
            Upload Document
          </button>

        </div>

        {loading && <p>Loading documents...</p>}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && documents.length === 0 && (
          <div className="empty-documents">
            <FileText size={50} />

            <h2>No documents yet</h2>

            <p>
              Upload your first handwritten document.
            </p>

            <button onClick={() => navigate("/upload")}>
              Upload Document
            </button>
          </div>
        )}

        <div className="document-grid">

          {documents.map((document) => (
            <div
  className="document-card"
  key={document._id}
  onClick={() =>
    navigate(`/documents/${document._id}`)
  }
  style={{ cursor: "pointer" }}
>

              <FileText size={32} />

              <h3>{document.title}</h3>

              <p>
                {document.originalFileName}
              </p>

              <div className="document-info">

                <span>
                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                </span>

                <span className="document-status">
                  {document.status}
                </span>

              </div>

              <small>
                {new Date(
                  document.createdAt
                ).toLocaleDateString()}
              </small>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Documents;