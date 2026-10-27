import { Link } from "react-router-dom";
import { ScanLine, UploadCloud, WandSparkles, PencilLine, FileDown, ArrowDown, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><WandSparkles size={14} /> AI-powered handwriting digitization</span>
            <h1>Turn Handwriting<br /><span>Into Digital</span> Documents</h1>
            <p>Upload handwritten notes, convert them into editable digital text, and export professional PDF documents.</p>
            <div className="hero-actions"><Link className="button button-primary" to="/register">Get Started <ArrowDown size={17} /></Link><Link className="button button-secondary" to="/login">Login</Link></div>
          </div>
          <div className="preview-shell"><div className="preview-card"><div className="preview-top"><strong>Ink2Digital workspace</strong><span>Live preview</span></div><div className="preview-flow"><div className="preview-step"><UploadCloud size={20} /><div>Original Handwriting<small>lecture-notes.png</small></div></div><div className="preview-step"><WandSparkles size={20} /><div>Digitizing...<small>Recognizing handwritten text</small></div></div><div className="preview-step"><CheckCircle2 size={20} /><div>Editable Digital Text<small>Ready to review and correct</small></div></div><div className="preview-step"><FileDown size={20} /><div>PDF Ready<small>Export a polished document</small></div></div></div></div></div>
        </section>

        <section className="feature-section" id="features"><div className="section-intro"><h2>Everything you need to digitize handwriting</h2><p>A focused workspace for turning handwritten pages into useful, editable documents.</p></div><div className="feature-grid">
          <Feature icon={<UploadCloud size={20} />} title="Upload Handwriting" text="Upload JPG, PNG or PDF documents securely." />
          <Feature icon={<ScanLine size={20} />} title="Smart Digitization" text="Convert handwritten English text into editable digital content." />
          <Feature icon={<PencilLine size={20} />} title="Edit & Organize" text="Correct, edit and organize recognized text with ease." />
          <Feature icon={<FileDown size={20} />} title="Export PDF" text="Generate clean, professional PDF documents." />
        </div></section>

        <section className="steps-section"><div className="section-intro"><h2>From page to PDF in four steps</h2></div><div className="step-grid"><Step number="01" title="Upload" text="Choose a handwritten page." /><Step number="02" title="Digitize" text="Let OCR recognize the content." /><Step number="03" title="Edit" text="Review and correct the text." /><Step number="04" title="Export" text="Download your polished PDF." /></div></section>
      </main>
      <footer className="site-footer"><div><strong>Ink2Digital</strong><p>Handwriting Digitization & PDF Conversion System</p></div><div className="footer-links"><Link to="/">Home</Link><Link to="/login">Login</Link><Link to="/register">Create Account</Link></div><p>University project &copy; 2026</p></footer>
    </div>
  );
}

function Feature({ icon, title, text }) { return <article className="feature-card"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></article>; }
function Step({ number, title, text }) { return <article className="step"><span className="step-number">{number}</span><h3>{title}</h3><p>{text}</p></article>; }

export default Home;
