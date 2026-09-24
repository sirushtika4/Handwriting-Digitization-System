import { useNavigate } from "react-router-dom";
import { LogOut, Upload, FileText } from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Ink2Digital</h2>
        </div>

        <div className="dashboard-user">
          <span>{user?.name || "User"}</span>

          <button onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <h1>
          Welcome, {user?.name || "User"} 👋
        </h1>

        <p>
          Digitize, edit and manage your handwritten documents.
        </p>

        <section className="dashboard-actions">
          <div className="dashboard-card">
            <Upload size={32} />

            <h3>Upload Handwriting</h3>

            <p>
              Upload an image or PDF containing handwritten text.
            </p>

            <button onClick={() => navigate("/documents")}>
  View Documents
</button>

          </div>

          <div className="dashboard-card">
            <FileText size={32} />

            <h3>My Documents</h3>

            <p>
              View and manage your digitized documents.
            </p>

            <button>
              View Documents
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;