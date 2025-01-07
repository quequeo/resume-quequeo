import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          Resume AI
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-danger nav-link" onClick={logout}>
                  Logout
                </button>
              </li>
            )}
            {/* Dark Mode Toggle */}
            <li className="nav-item">
              <button
                className="btn btn-outline-secondary ms-3"
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <i className="bi bi-brightness-high"></i> // Light Mode Icon
                ) : (
                  <i className="bi bi-moon"></i> // Dark Mode Icon
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
