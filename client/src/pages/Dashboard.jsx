import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText } from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    api.get("/documents", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((response) => setDocuments(response.data.documents || []))
      .catch(() => setDocuments([]));
  }, []);

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        <h1>
          Welcome, {user?.name || "User"} 👋
        </h1>

        <p>
          Digitize, edit and manage your handwritten documents.
        </p>

        <section className="dashboard-stats">
          <div><strong>{documents.length}</strong><span>Total Documents</span></div>
          <div><strong>{documents.filter((document) => document.status === "completed").length}</strong><span>Digitized Documents</span></div>
          <div><strong>{documents.filter((document) => document.status === "uploaded" || document.status === "processing").length}</strong><span>Pending Documents</span></div>
          <div><strong>{documents.filter((document) => document.status === "failed").length}</strong><span>Failed Documents</span></div>
        </section>

        <section className="dashboard-actions">
          <div className="dashboard-card">
            <Upload size={32} />

            <h3>Upload Handwriting</h3>

            <p>
              Upload an image or PDF containing handwritten text.
            </p>

            <button onClick={() => navigate("/upload")}>Upload Handwriting</button>

          </div>

          <div className="dashboard-card">
            <FileText size={32} />

            <h3>My Documents</h3>

            <p>
              View and manage your digitized documents.
            </p>

            <button onClick={() => navigate("/documents")}>
              View Documents
            </button>
          </div>
        </section>

        <section className="recent-documents">
          <div className="section-heading"><h2>Recent Documents</h2><button onClick={() => navigate("/documents")}>View all</button></div>
          {documents.slice(0, 5).map((document) => (
            <button className="recent-document" key={document._id} onClick={() => navigate(`/documents/${document._id}`)}>
              <span><FileText size={17} />{document.title}</span><small>{document.status}</small>
            </button>
          ))}
          {!documents.length && <p className="muted-text">Your recent uploads will appear here.</p>}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;