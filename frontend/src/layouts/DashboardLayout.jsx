import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children }) {
  const { user } = useAuth();
  const role = user?.role || "crew";

  const sidebarStyle = {
    width: "260px",
    backgroundColor: "#0f172a",
    color: "#94a3b8",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    padding: "24px 16px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "30px"
  };

  const mainContentStyle = {
    marginLeft: "260px",
    padding: "40px",
    minHeight: "100vh"
  };

  const linkStyle = {
    color: "#94a3b8",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    display: "block"
  };

  return (
    <div>
      <div style={sidebarStyle}>
        <div>
          <h2 style={{ color: "white" }}>ACMS Portal</h2>

          <span style={{
            color: "#38bdf8",
            textTransform: "uppercase"
          }}>
            Role: {role}
          </span>
        </div>

        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>

            <li>
              <Link to="/dashboard" style={linkStyle}>
                🏠 Dashboard
              </Link>
            </li>

            {role === "admin" && (
              <>
                <li>
                  <Link to="/aircraft" style={linkStyle}>
                    ✈️ Aircraft
                  </Link>
                </li>

                <li>
                  <Link to="/flights" style={linkStyle}>
                    📅 Flights
                  </Link>
                </li>

                <li>
                  <Link to="/crew" style={linkStyle}>
                    👥 Crew
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/reports" style={linkStyle}>
                📝 Reports
              </Link>
            </li>

            <li>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                🚪 Logout
              </button>
            </li>

          </ul>
        </nav>
      </div>

      <div style={mainContentStyle}>
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;