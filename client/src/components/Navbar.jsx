import { FileText, LayoutDashboard, LogIn, LogOut, Menu, UploadCloud } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="site-nav">
      <Link className="brand" to={isLoggedIn ? "/dashboard" : "/"}>
        <span className="brand-mark"><FileText size={18} /></span>
        Ink2Digital
      </Link>

      <div className="nav-links">
        {isLoggedIn ? (
          <>
            <NavLink to="/dashboard"><LayoutDashboard size={15} /> Dashboard</NavLink>
            <NavLink to="/upload"><UploadCloud size={15} /> Upload</NavLink>
            <NavLink to="/documents"><FileText size={15} /> My Documents</NavLink>
          </>
        ) : (
          <>
            <a href="#features">Features</a>
            <NavLink to="/login">Login</NavLink>
          </>
        )}
      </div>

      <div className="nav-actions">
        {isLoggedIn ? (
          <><span className="nav-user">{user?.name || "Account"}</span><button className="nav-button nav-button-ghost" onClick={handleLogout}><LogOut size={16} /> Logout</button></>
        ) : (
          <>
            <Link className="nav-button nav-button-ghost" to="/login"><LogIn size={16} /> Sign in</Link>
            <Link className="nav-button nav-button-primary" to="/register">Create Account</Link>
          </>
        )}
      </div>
      <Menu className="mobile-menu-icon" size={20} />
    </nav>
  );
}

export default Navbar;
