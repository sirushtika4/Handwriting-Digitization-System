import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Upload,
  Search,
  Trash2,
} from "lucide-react";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Documents() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

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

  const filteredDocuments = documents
    .filter((document) => status === "all" || document.status === status)
    .filter((document) => `${document.title} ${document.originalFileName}`.toLowerCase().includes(search.toLowerCase()))
    .sort((first, second) => sort === "newest"
      ? new Date(second.createdAt) - new Date(first.createdAt)
      : new Date(first.createdAt) - new Date(second.createdAt));

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document permanently?")) return;
    try {
      await api.delete(`/documents/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setDocuments((current) => current.filter((document) => document._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete document.");
    }
  };

  return (
    <div className="documents-page">
      <Navbar />

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

        <div className="document-filters">
          <label><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search documents" /></label>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All statuses</option><option value="uploaded">Uploaded</option><option value="processing">Processing</option><option value="completed">Completed</option><option value="failed">Failed</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select>
        </div>

        {!loading && filteredDocuments.length === 0 && (
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

          {filteredDocuments.map((document) => (
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

              <button className="icon-delete" aria-label={`Delete ${document.title}`} onClick={(event) => { event.stopPropagation(); handleDelete(document._id); }}><Trash2 size={16} /></button>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Documents;