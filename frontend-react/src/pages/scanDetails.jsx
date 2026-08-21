import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./scanDetails.css";

function ScanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const loadScan = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${BACKEND_URL}/api/history/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load scan");
        }

        const data = await response.json();

        if (data.success) {
          setScan(data.scan);
        } else {
          throw new Error(data.error || "Scan not found");
        }

      } catch (err) {
        console.error("Scan details error:", err);
        setError("Could not load scan details.");
      } finally {
        setLoading(false);
      }
    };

    loadScan();
  }, [id]);

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

  const getSeverityClass = (severity) => {
    if (!severity) return "";

    return severity.toLowerCase();
  };

  if (loading) {
    return (
      <div className="scan-details-page">
        <div className="scan-details-loading">
          <div className="loading-icon">◷</div>
          <h2>Loading scan...</h2>
          <p>Fetching security analysis.</p>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="scan-details-page">
        <div className="scan-details-error">
          <div className="error-icon">⚠</div>

          <h2>Scan not found</h2>

          <p>
            {error || "This security scan could not be found."}
          </p>

          <button onClick={() => navigate("/history")}>
            ← Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-details-page">

      {/* HEADER */}

      <header className="scan-details-header">

        <button
          className="back-button"
          onClick={() => navigate("/history")}
        >
          ← Back to History
        </button>

        <div className="header-title">
          <h1>Scan Details</h1>
          <p>Security analysis report</p>
        </div>

      </header>


      {/* MAIN */}

      <main className="scan-details-main">

        {/* TARGET */}

        <section className="details-card">

          <div className="card-label">
            TARGET WEBSITE
          </div>

          <div className="target-url">
            🌐 {scan.target}
          </div>

          <div className="scan-date">
            Scanned on {formatDate(scan.createdAt)}
          </div>

        </section>


        {/* SCORE */}

        <section className="score-card">

          <div className="score-section">

            <div className="card-label">
              SECURITY SCORE
            </div>

            <div className="security-score">
              {scan.securityScore ?? "--"}
              <span>/100</span>
            </div>

          </div>


          <div className="risk-section">

            <div className="card-label">
              RISK LEVEL
            </div>

            <div
              className={`risk-badge ${
                scan.riskLevel
                  ? scan.riskLevel.toLowerCase()
                  : ""
              }`}
            >
              {scan.riskLevel || "UNKNOWN"}
            </div>

          </div>

        </section>


        {/* FINDINGS */}

        <section className="findings-section">

          <div className="findings-header">

            <div>
              <h2>Security Findings</h2>

              <p>
                Issues detected during this security scan.
              </p>
            </div>

            <div className="finding-count">
              {scan.findings?.length || 0} Issues
            </div>

          </div>


          {scan.findings && scan.findings.length > 0 ? (

            <div className="findings-list">

              {scan.findings.map((finding, index) => (

                <div
                  className="finding-card"
                  key={index}
                >

                  <div className="finding-top">

                    <div className="finding-icon">
                      ⚠
                    </div>

                    <div className="finding-title-section">

                      <h3>
                        {finding.title}
                      </h3>

                      <span className="finding-category">
                        {finding.category}
                      </span>

                    </div>

                    <span
                      className={`severity-badge ${getSeverityClass(
                        finding.severity
                      )}`}
                    >
                      {finding.severity}
                    </span>

                  </div>


                  {finding.description && (

                    <div className="finding-description">

                      <strong>Description</strong>

                      <p>
                        {finding.description}
                      </p>

                    </div>

                  )}


                  {finding.recommendation && (

                    <div className="finding-recommendation">

                      <strong>Recommendation</strong>

                      <p>
                        {finding.recommendation}
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          ) : (

            <div className="no-findings">
              <div>✓</div>

              <h3>No security issues found</h3>

              <p>
                No security findings were recorded for this scan.
              </p>
            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default ScanDetails;
