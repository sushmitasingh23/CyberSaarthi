import "./scanResult.css";

function ScanResult() {
  return (
    <div className="result-page">

      <div className="result-container">

        <div className="result-header">
          <div>
            <p className="result-label">SECURITY SCAN</p>
            <h1>Scan Results</h1>
            <p className="scanned-url">
              https://example.com
            </p>
          </div>

          <div className="security-score">
            <span>Security Score</span>
            <strong>78</strong>
            <small>/100</small>
          </div>
        </div>


        <div className="result-summary">

          <div className="summary-card">
            <span className="summary-number critical">1</span>
            <p>Critical</p>
          </div>

          <div className="summary-card">
            <span className="summary-number high">2</span>
            <p>High Risk</p>
          </div>

          <div className="summary-card">
            <span className="summary-number medium">3</span>
            <p>Medium Risk</p>
          </div>

          <div className="summary-card">
            <span className="summary-number low">5</span>
            <p>Low Risk</p>
          </div>

        </div>


        <div className="vulnerabilities">

          <h2>Detected Vulnerabilities</h2>

          <div className="vulnerability-card">

            <div className="severity critical-bg">
              CRITICAL
            </div>

            <div className="vulnerability-content">
              <h3>Missing Security Headers</h3>

              <p>
                Important HTTP security headers are missing from the website.
              </p>

              <span>
                Recommendation: Configure appropriate security headers.
              </span>
            </div>

          </div>


          <div className="vulnerability-card">

            <div className="severity high-bg">
              HIGH
            </div>

            <div className="vulnerability-content">
              <h3>Weak SSL Configuration</h3>

              <p>
                The website may be using an outdated or weak SSL configuration.
              </p>

              <span>
                Recommendation: Use modern TLS configuration.
              </span>
            </div>

          </div>


          <div className="vulnerability-card">

            <div className="severity medium-bg">
              MEDIUM
            </div>

            <div className="vulnerability-content">
              <h3>Information Disclosure</h3>

              <p>
                Server information may be exposed through response headers.
              </p>

              <span>
                Recommendation: Hide unnecessary server information.
              </span>
            </div>

          </div>

        </div>


        <div className="result-actions">

          <button className="primary-btn">
            Run Scan Again
          </button>

          <button className="secondary-btn">
            Download Report
          </button>

        </div>

      </div>

    </div>
  );
}

export default ScanResult;
