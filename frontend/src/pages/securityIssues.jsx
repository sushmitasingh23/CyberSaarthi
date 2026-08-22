import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./securityIssues.css";

function SecurityIssues() {
  const navigate = useNavigate();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const BACKEND_URL = "https://cybersaarthi-9rer.onrender.com";

  // =========================
  // LOAD SCAN HISTORY
  // =========================

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/history`
        );

        const data = await response.json();

        if (data.success) {
          setScans(data.scans || []);
        }
      } catch (error) {
        console.error("Security issues error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  // =========================
  // GET ALL FINDINGS
  // =========================

  const allFindings = scans.flatMap((scan) =>
    (scan.findings || []).map((finding) => ({
      ...finding,
      scanId: scan._id,
      target: scan.target,
      createdAt: scan.createdAt,
    }))
  );

  // =========================
  // FILTER FINDINGS
  // =========================

  const filteredFindings =
    filter === "ALL"
      ? allFindings
      : allFindings.filter(
          (finding) => finding.severity === filter
        );

  // =========================
  // COUNTS
  // =========================

  const criticalCount = allFindings.filter(
    (finding) => finding.severity === "CRITICAL"
  ).length;

  const highCount = allFindings.filter(
    (finding) => finding.severity === "HIGH"
  ).length;

  const mediumCount = allFindings.filter(
    (finding) => finding.severity === "MEDIUM"
  ).length;

  const lowCount = allFindings.filter(
    (finding) => finding.severity === "LOW"
  ).length;

  // =========================
  // SEVERITY CLASS
  // =========================

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "critical";

      case "HIGH":
        return "high";

      case "MEDIUM":
        return "medium";

      case "LOW":
        return "low";

      default:
        return "";
    }
  };

  // =========================
  // OPEN FULL REPORT
  // =========================

  const openReport = (scanId) => {
    navigate(`/scan-details/${scanId}`);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="security-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          🛡️ CyberSaarthi
        </div>

        <button
          className="new-chat-btn"
          onClick={() => navigate("/dashboard")}
        >
          + New Scan
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
            className="nav-item active"
            onClick={() =>
              navigate("/security-issues")
            }
          >
            <span>⚠</span>
            Security Issues
          </button>

          <button
            className="nav-item"
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

      {/* ================= MAIN CONTENT ================= */}

      <main className="security-main">

        {/* HEADER */}

        <header className="security-header">

          <div>
            <p className="page-label">
              SECURITY CENTER
            </p>

            <h1>
              Security Issues
            </h1>

            <p>
              Review vulnerabilities detected across
              your website scans.
            </p>
          </div>

          <button
            className="scan-button"
            onClick={() => navigate("/dashboard")}
          >
            + Run New Scan
          </button>

        </header>

        {/* ================= SUMMARY ================= */}

        <section className="issue-summary">

          <button
            className={`issue-summary-card ${
              filter === "CRITICAL" ? "selected" : ""
            }`}
            onClick={() => setFilter("CRITICAL")}
          >
            <div className="issue-icon critical-icon">
              🔴
            </div>

            <div>
              <strong>{criticalCount}</strong>
              <span>Critical</span>
            </div>
          </button>

          <button
            className={`issue-summary-card ${
              filter === "HIGH" ? "selected" : ""
            }`}
            onClick={() => setFilter("HIGH")}
          >
            <div className="issue-icon high-icon">
              🟠
            </div>

            <div>
              <strong>{highCount}</strong>
              <span>High Risk</span>
            </div>
          </button>

          <button
            className={`issue-summary-card ${
              filter === "MEDIUM" ? "selected" : ""
            }`}
            onClick={() => setFilter("MEDIUM")}
          >
            <div className="issue-icon medium-icon">
              🟡
            </div>

            <div>
              <strong>{mediumCount}</strong>
              <span>Medium Risk</span>
            </div>
          </button>

          <button
            className={`issue-summary-card ${
              filter === "LOW" ? "selected" : ""
            }`}
            onClick={() => setFilter("LOW")}
          >
            <div className="issue-icon low-icon">
              🔵
            </div>

            <div>
              <strong>{lowCount}</strong>
              <span>Low Risk</span>
            </div>
          </button>

        </section>

        {/* ================= FILTER BAR ================= */}

        <section className="issues-section">

          <div className="issues-title-row">

            <div>
              <h2>
                Detected Vulnerabilities
              </h2>

              <span>
                {filteredFindings.length} issue
                {filteredFindings.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </span>
            </div>

            <div className="filter-buttons">

              <button
                className={
                  filter === "ALL"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter("ALL")}
              >
                All
              </button>

              <button
                className={
                  filter === "CRITICAL"
                    ? "filter active"
                    : "filter"
                }
                onClick={() =>
                  setFilter("CRITICAL")
                }
              >
                Critical
              </button>

              <button
                className={
                  filter === "HIGH"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter("HIGH")}
              >
                High
              </button>

              <button
                className={
                  filter === "MEDIUM"
                    ? "filter active"
                    : "filter"
                }
                onClick={() =>
                  setFilter("MEDIUM")
                }
              >
                Medium
              </button>

              <button
                className={
                  filter === "LOW"
                    ? "filter active"
                    : "filter"
                }
                onClick={() => setFilter("LOW")}
              >
                Low
              </button>

            </div>

          </div>

          {/* ================= LOADING ================= */}

          {loading && (
            <div className="empty-issues">
              <div className="loading-icon">
                ⟳
              </div>

              <h3>
                Loading security issues...
              </h3>

              <p>
                Fetching vulnerabilities from your
                scan history.
              </p>
            </div>
          )}

          {/* ================= NO ISSUES ================= */}

          {!loading &&
            filteredFindings.length === 0 && (

              <div className="empty-issues">

                <div className="empty-icon">
                  ✓
                </div>

                <h3>
                  No security issues found
                </h3>

                <p>
                  {filter === "ALL"
                    ? "Your scans have not reported any vulnerabilities yet."
                    : `There are no ${filter.toLowerCase()} severity issues.`}
                </p>

              </div>
            )}

          {/* ================= ISSUE LIST ================= */}

          {!loading &&
            filteredFindings.length > 0 && (

              <div className="issues-list">

                {filteredFindings.map(
                  (finding, index) => {

                    const severityClass =
                      getSeverityClass(
                        finding.severity
                      );

                    return (
                      <article
                        className={`issue-card ${severityClass}`}
                        key={
                          finding._id ||
                          `${finding.scanId}-${index}`
                        }
                      >

                        <div className="issue-card-top">

                          <div
                            className={`severity-badge ${severityClass}`}
                          >
                            {finding.severity}
                          </div>

                          <button
                            className="report-link"
                            onClick={() =>
                              openReport(
                                finding.scanId
                              )
                            }
                          >
                            View Report →
                          </button>

                        </div>

                        <div className="issue-content">

                          <h3>
                            {finding.title ||
                              "Security Vulnerability"}
                          </h3>

                          <p className="issue-target">
                            🌐 {finding.target}
                          </p>

                          <p className="issue-description">
                            {finding.description ||
                              "This vulnerability requires review and appropriate security protection."}
                          </p>

                          <div className="issue-meta">

                            <div>
                              <span>
                                Category
                              </span>

                              <strong>
                                {finding.category ||
                                  "Security"}
                              </strong>
                            </div>

                            <div>
                              <span>
                                Recommendation
                              </span>

                              <strong>
                                {finding.recommendation ||
                                  "Review the security configuration."}
                              </strong>
                            </div>

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default SecurityIssues;