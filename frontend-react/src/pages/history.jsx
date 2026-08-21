import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./history.css";

function History() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL = "http://172.19.134.109:5000";

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${BACKEND_URL}/api/history`);

        if (!response.ok) {
          throw new Error("Failed to load scan history");
        }

        const data = await response.json();

        if (data.success) {
          setHistory(data.scans || []);
        } else {
          throw new Error(data.error || "Could not load history");
        }
      } catch (err) {
        console.error("History error:", err);
        setError("Could not load scan history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";

    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRiskClass = (riskLevel) => {
    if (!riskLevel) return "";

    return riskLevel.toLowerCase();
  };

  return (
    <div className="history-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          🛡️ CyberSaarthi
        </div>

        <button
          className="new-chat-btn"
          onClick={() => navigate("/dashboard")}
        >
          + New Chat
        </button>

        <nav className="sidebar-nav">

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/scan")}
          >
            <span>⌕</span>
            Scan Website
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/security-issues")}
          >
            <span>⚠</span>
            Security Issues
          </button>

          <button
            className="nav-item active"
            onClick={() => navigate("/history")}
          >
            <span>◷</span>
            Scan History
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item"
            onClick={() => navigate("/profile")}
          >
            <span>⚙</span>
            Settings & Privacy
          </button>

          <div className="security-note">
            <span>🛡️</span>

            <div>
              <strong>CyberSaarthi AI</strong>
              <small>Security Assistant</small>
            </div>
          </div>

        </div>

      </aside>


      {/* MAIN CONTENT */}
      <main className="history-main">

        <header className="history-header">

          <div>
            <h1>Scan History</h1>

            <p>
              Your previous website security analyses.
            </p>
          </div>

          {history.length > 0 && (
            <button
              className="clear-history-btn"
              onClick={() => {
                alert(
                  "History is stored in the database. Database deletion will be added next."
                );
              }}
            >
              Clear History
            </button>
          )}

        </header>


        {/* LOADING */}
        {loading && (
          <div className="history-empty">

            <div className="history-empty-icon">
              ◷
            </div>

            <h2>Loading scan history...</h2>

            <p>
              Fetching your previous security scans.
            </p>

          </div>
        )}


        {/* ERROR */}
        {!loading && error && (
          <div className="history-empty">

            <div className="history-empty-icon">
              ⚠
            </div>

            <h2>Unable to load history</h2>

            <p>
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>

          </div>
        )}


        {/* EMPTY */}
        {!loading && !error && history.length === 0 && (
          <div className="history-empty">

            <div className="history-empty-icon">
              ◷
            </div>

            <h2>No scan history yet</h2>

            <p>
              Your website security scans will appear here.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
            >
              Start a Security Check
            </button>

          </div>
        )}


        {/* HISTORY */}
        {!loading && !error && history.length > 0 && (

          <div className="history-list">

            {history.map((item) => (

              <div
                className="history-item"
                key={item._id}
                onClick={() => navigate(`/scan-details-${item._id}`)}
              >

                <div className="history-icon">
                  🌐
                </div>

                <div className="history-details">

                  <div className="history-url">
                    {item.target}
                  </div>

                  <div className="history-date">
                    {formatDate(item.createdAt)}
                  </div>

                </div>

                <div
                  className={`history-risk ${getRiskClass(
                    item.riskLevel
                  )}`}
                >
                  {item.riskLevel || "UNKNOWN"}
                </div>

                <div className="history-score">
                  {item.securityScore ?? "--"}/100
                </div>

                <div className="history-arrow">
                  →
                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default History;