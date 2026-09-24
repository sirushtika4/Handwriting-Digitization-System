import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  WandSparkles,
  Calendar,
  HardDrive,
} from "lucide-react";

import api from "../services/api";

function DocumentDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
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

      } catch (err) {

        console.error("Document loading error:", err);

        setError("Unable to load document.");

      } finally {

        setLoading(false);

      }
    };

    fetchDocument();

  }, [id]);

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

          <button
            className="digitize-button"
            onClick={() =>
              navigate(`/documents/${document._id}/digitize`)
            }
          >
            <WandSparkles size={18} />

            Digitize Handwriting
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


        <div className="document-preview">

          <h2>Original Document</h2>

          {isPDF ? (

            <iframe
              src={fileURL}
              title="Document Preview"
              width="100%"
              height="700px"
            />

          ) : (

            <img
              src={fileURL}
              alt={document.title}
              className="document-preview-image"
            />

          )}

        </div>

      </div>

    </div>
  );
}

export default DocumentDetails;