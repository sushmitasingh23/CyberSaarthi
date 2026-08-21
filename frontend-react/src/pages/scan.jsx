import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./scan.css";

function Scan() {
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);

  const navigate = useNavigate();

  const handleScan = (e) => {
    e.preventDefault();

    if (!target.trim()) {
      return;
    }

    setScanning(true);

    // Frontend demo only
    setTimeout(() => {
      navigate("/scan-result", {
        state: {
          target: target,
        },
      });
    }, 2500);
  };

  return (
    <div className="scan-page">

      <nav className="scan-navbar">

        <div className="scan-brand">
          <div className="brand-shield">🛡</div>
          <span>CyberSaarthi</span>
        </div>

        <div className="scan-nav-right">
          <span className="online-dot"></span>
          Scanner Online
        </div>

      </nav>


      <main className="scan-main">

        <div className="scan-intro">

          <span className="scan-tag">
            WEBSITE SECURITY ANALYSIS
          </span>

          <h1>
            Know Your Website's
            <span> Security Weaknesses.</span>
          </h1>

          <p>
            Enter your website URL and let CyberSaarthi analyze
            its security configuration, vulnerabilities and risks.
          </p>

        </div>


        <div className="scanner-box">

          <div className="scanner-box-header">

            <div className="scanner-icon">
              🔍
            </div>

            <div>
              <h2>Website Security Scanner</h2>

              <p>
                Enter the URL of the website you want to analyze.
              </p>
            </div>

          </div>


          <form onSubmit={handleScan}>

            <label htmlFor="target">
              Website URL
            </label>

            <div className="website-input">

              <span className="url-prefix">https://</span>

              <input
                id="target"
                type="text"
                placeholder="example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                disabled={scanning}
              />

            </div>


            <button
              type="submit"
              className="start-scan-btn"
              disabled={scanning}
            >

              {scanning ? (
                <>
                  <span className="scan-spinner"></span>
                  Analyzing Website...
                </>
              ) : (
                <>
                  Scan Website
                  <span>→</span>
                </>
              )}

            </button>

          </form>


          {scanning && (

            <div className="scan-status">

              <div className="status-line">
                <span>Running security analysis</span>
                <span>Scanning...</span>
              </div>

              <div className="progress-track">
                <div className="progress-bar-fill"></div>
              </div>

              <div className="analysis-list">
                <span>✓ Website detected</span>
                <span>✓ SSL configuration</span>
                <span>◌ Security vulnerabilities</span>
              </div>

            </div>

          )}


          {!scanning && (

            <div className="scanner-checks">

              <div>
                <b>✓</b>
                SSL / TLS
              </div>

              <div>
                <b>✓</b>
                Security Headers
              </div>

              <div>
                <b>✓</b>
                Vulnerabilities
              </div>

              <div>
                <b>✓</b>
                Risk Analysis
              </div>

            </div>

          )}

        </div>


        <div className="scan-note">

          <span>🔒 Your scan data is securely processed</span>

          <span>•</span>

          <span>Detailed security recommendations</span>

        </div>

      </main>

    </div>
  );
}

export default Scan;
