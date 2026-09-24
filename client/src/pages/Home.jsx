import { Link } from "react-router-dom";
import { FileText, ScanLine, ShieldCheck } from "lucide-react";

function Home() {
  return (
    <div>
      <nav>
        <h2>Ink2Digital</h2>

        <div>
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/register">Create Account</Link>
        </div>
      </nav>

      <main>
        <h1>Turn Handwriting Into Digital Documents</h1>

        <p>
          Upload, scan or capture handwritten notes, convert them into editable
          digital text and export professional PDF documents.
        </p>

        <Link to="/register">Get Started</Link>

        <section>
          <div>
            <ScanLine size={32} />
            <h3>Digitize Handwriting</h3>
            <p>Convert handwritten English documents into editable text.</p>
          </div>

          <div>
            <FileText size={32} />
            <h3>Create Documents</h3>
            <p>Edit, organize and export your digitized content.</p>
          </div>

          <div>
            <ShieldCheck size={32} />
            <h3>Your Documents</h3>
            <p>Keep your digitized documents securely in your account.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;