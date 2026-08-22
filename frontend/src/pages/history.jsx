import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./history.css";

function History() {
  const navigate = useNavigate();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL = "https://cybersaarthi-9rer.onrender.com";

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BACKEND_URL}/api/history`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Could not load scan history"
        );
      }

      setScans(data.scans || []);
    } catch (error) {
      console.error("History error:", error);
      setError("Could not load scan history.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (riskLevel) => {
    if (!riskLevel) return "";

    return riskLevel
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const getFindingCount = (scan, severity) => {
    return (
      scan.findings?.filter(
        (finding) => finding.severity === severity
      ).length || 0
    );
  };

  return (
    <div className="history-page">

      {/* HEADER */}

      <div className="history-header">

        <div>
          <p className="history-label">
            CYBERSAARTHI
          </p>

          <h1>Scan History</h1>

          <p>
            View your previous website security scans.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>


      {/* CONTENT */}

      <div className="history-container">

        {loading && (
          <div className="history-empty">
            <h2>Loading scan history...</h2>
            <p>
              Fetching your previous scans.
            </p>
          </div>
        )}


        {!loading && error && (
          <div className="history-empty">

            <h2>Something went wrong</h2>

            <p>{error}</p>

            <button
              className="primary-btn"
              onClick={loadHistory}
            >
              Try Again
            </button>

          </div>
        )}


        {!loading &&
          !error &&
          scans.length === 0 && (

            <div className="history-empty">

              <h2>No scans yet</h2>

              <p>
                Run your first security scan from
                the dashboard.
              </p>

              <button
                className="primary-btn"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Run a New Scan
              </button>

            </div>

          )}


        {!loading &&
          !error &&
          scans.length > 0 && (

            <div className="history-list">

              {scans.map((scan) => (

                <div
                  className="history-card"
                  key={scan._id}
                >

                  {/* TOP */}

                  <div className="history-card-top">

                    <div>

                      <span className="scan-label">
                        WEBSITE
                      </span>

                      <h2>
                        {scan.target}
                      </h2>

                      <p className="scan-date">
                        {scan.createdAt
                          ? new Date(
                              scan.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                    </div>


                    <div className="score-box">

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


                  {/* RISK */}

                  <div className="history-risk">

                    <span>
                      Risk Level
                    </span>

                    <strong
                      className={`risk-${getRiskClass(
                        scan.riskLevel
                      )}`}
                    >
                      {scan.riskLevel || "Unknown"}
                    </strong>

                  </div>


                  {/* FINDINGS */}

                  <div className="history-findings">

                    <div>
                      🔴
                      <strong>
                        {getFindingCount(
                          scan,
                          "CRITICAL"
                        )}
                      </strong>
                      <span>Critical</span>
                    </div>

                    <div>
                      🟠
                      <strong>
                        {getFindingCount(
                          scan,
                          "HIGH"
                        )}
                      </strong>
                      <span>High</span>
                    </div>

                    <div>
                      🟡
                      <strong>
                        {getFindingCount(
                          scan,
                          "MEDIUM"
                        )}
                      </strong>
                      <span>Medium</span>
                    </div>

                    <div>
                      🔵
                      <strong>
                        {getFindingCount(
                          scan,
                          "LOW"
                        )}
                      </strong>
                      <span>Low</span>
                    </div>

                  </div>


                  {/* ACTION */}

                  <div className="history-action">

                    <button
                      className="secondary-btn"
                      onClick={() =>
                        navigate(
                          `/scan-details/${scan._id}`
                        )
                      }
                    >
                      View Full Report →
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

      </div>

    </div>
  );
}

export default History;