import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./scanResult.css";

const BACKEND_URL = "http://localhost:5000";

function ScanResult() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD SCAN FROM BACKEND
  // ==========================================

  useEffect(() => {
    const loadScan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${BACKEND_URL}/api/report/${id}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Could not load scan report"
          );
        }

        setScan(data.scan);
      } catch (err) {
        console.error("Report loading error:", err);

        setError(
          "Could not load this security report."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadScan();
    }
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="result-page">
        <div className="result-container report-loading">
          <div className="loading-icon">🛡️</div>

          <h2>Loading Security Report...</h2>

          <p>
            CyberSaarthi is retrieving the scan
            results.
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !scan) {
    return (
      <div className="result-page">
        <div className="result-container report-loading">
          <div className="loading-icon">⚠️</div>

          <h2>Report Not Found</h2>

          <p>
            {error ||
              "The requested security report could not be found."}
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // FINDINGS
  // ==========================================

  const findings = scan.findings || [];

  const criticalCount = findings.filter(
    (finding) =>
      finding.severity === "CRITICAL"
  ).length;

  const highCount = findings.filter(
    (finding) =>
      finding.severity === "HIGH"
  ).length;

  const mediumCount = findings.filter(
    (finding) =>
      finding.severity === "MEDIUM"
  ).length;

  const lowCount = findings.filter(
    (finding) =>
      finding.severity === "LOW"
  ).length;

  // ==========================================
  // SEVERITY CLASS
  // ==========================================

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
        return "low";
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="result-page">

      <div className="result-container">

        {/* =====================================
            TOP NAVIGATION
        ===================================== */}

        <div className="report-topbar">

          <button
            className="back-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Dashboard
          </button>

          <span className="report-id">
            Report ID: {scan._id}
          </span>

        </div>


        {/* =====================================
            HEADER
        ===================================== */}

        <div className="result-header">

          <div>

            <p className="result-label">
              CYBERSAARTHI SECURITY REPORT
            </p>

            <h1>
              Scan Results
            </h1>

            <p className="scanned-url">
              {scan.target}
            </p>

          </div>


          {/* SECURITY SCORE */}

          <div className="security-score">

            <span>
              Security Score
            </span>

            <strong>
              {scan.securityScore}
            </strong>

            <small>
              /100
            </small>

          </div>

        </div>


        {/* =====================================
            RISK LEVEL
        ===================================== */}

        <div className="risk-banner">

          <span>
            Overall Risk Level
          </span>

          <strong
            className={`risk-${(
              scan.riskLevel || ""
            )
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {scan.riskLevel || "UNKNOWN"}
          </strong>

        </div>


        {/* =====================================
            VULNERABILITY SUMMARY
        ===================================== */}

        <section className="vulnerability-summary">

          <h2>
            Vulnerability Summary
          </h2>

          <div className="summary-grid">

            <div className="summary-card critical-card">

              <span className="summary-number">
                {criticalCount}
              </span>

              <p>
                Critical
              </p>

            </div>


            <div className="summary-card high-card">

              <span className="summary-number">
                {highCount}
              </span>

              <p>
                High Risk
              </p>

            </div>


            <div className="summary-card medium-card">

              <span className="summary-number">
                {mediumCount}
              </span>

              <p>
                Medium Risk
              </p>

            </div>


            <div className="summary-card low-card">

              <span className="summary-number">
                {lowCount}
              </span>

              <p>
                Low Risk
              </p>

            </div>

          </div>

        </section>


        {/* =====================================
            FINDINGS
        ===================================== */}

        <section className="vulnerabilities">

          <div className="section-heading">

            <div>
              <p className="result-label">
                SECURITY ANALYSIS
              </p>

              <h2>
                Detected Vulnerabilities
              </h2>
            </div>

            <span className="finding-count">
              {findings.length}{" "}
              {findings.length === 1
                ? "Issue"
                : "Issues"}
            </span>

          </div>


          {findings.length === 0 ? (

            <div className="no-findings">

              <div>
                ✓
              </div>

              <h3>
                No Security Issues Found
              </h3>

              <p>
                The scanner did not return any
                security vulnerabilities for this
                target.
              </p>

            </div>

          ) : (

            <div className="findings-list">

              {findings.map(
                (finding, index) => {

                  const severityClass =
                    getSeverityClass(
                      finding.severity
                    );

                  return (
                    <article
                      className={`vulnerability-card ${severityClass}`}
                      key={
                        finding._id ||
                        index
                      }
                    >

                      {/* SEVERITY */}

                      <div
                        className={`severity-badge ${severityClass}`}
                      >
                        {finding.severity}
                      </div>


                      {/* CONTENT */}

                      <div className="vulnerability-content">

                        <div className="finding-title-row">

                          <span className="finding-number">
                            #{index + 1}
                          </span>

                          <h3>
                            {finding.title ||
                              "Security Issue"}
                          </h3>

                        </div>


                        {finding.category && (
                          <p className="finding-category">
                            Category:{" "}
                            <strong>
                              {finding.category}
                            </strong>
                          </p>
                        )}


                        <div className="finding-section">

                          <h4>
                            What does this mean?
                          </h4>

                          <p>
                            {finding.description ||
                              "This security issue should be reviewed and addressed."}
                          </p>

                        </div>


                        <div className="finding-section recommendation">

                          <h4>
                            Recommended Action
                          </h4>

                          <p>
                            {finding.recommendation ||
                              "Review your website configuration and apply appropriate security protections."}
                          </p>

                        </div>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>


        {/* =====================================
            REPORT ACTIONS
        ===================================== */}

        <div className="result-actions">

          <button
            className="secondary-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Dashboard
          </button>

          <button
            className="primary-btn"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Run New Scan
          </button>

        </div>

      </div>

    </div>
  );
}

export default ScanResult;