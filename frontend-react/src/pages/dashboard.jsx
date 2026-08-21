import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [scanning, setScanning] = useState(false);

  // =========================
  // FIND WEBSITE URL
  // =========================

  const findWebsiteUrl = (text) => {
    const match = text.match(
      /https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i
    );

    if (!match) {
      return null;
    }

    let url = match[0].replace(/[.,!?]+$/, "");

    if (url.startsWith("www.")) {
      url = "https://" + url;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    return url;
  };

  // =========================
  // SAVE SCAN TO HISTORY
  // =========================

  const saveToHistory = (result) => {
    try {
      const existingHistory = JSON.parse(
        localStorage.getItem("cybersaarthi_history") || "[]"
      );

      const newItem = {
        id: Date.now(),
        url: result.target,
        date: new Date().toLocaleString(),
        securityScore: result.securityScore,
        riskLevel: result.riskLevel,
        findings: result.findings || [],
      };

      const updatedHistory = [
        newItem,
        ...existingHistory.filter(
          (item) => item.url !== result.target
        ),
      ];

      localStorage.setItem(
        "cybersaarthi_history",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error("History save error:", error);
    }
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || scanning) {
      return;
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      text: text,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setMessage("");

    // Find URL
    const websiteUrl = findWebsiteUrl(text);

    // No URL
    if (!websiteUrl) {
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai-text",
        text:
          "Please enter a website URL so I can check its security. Example: https://example.com",
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);
 
      return;
    }

    // =========================
    // START SCAN
    // =========================

    setScanning(true);

    const loadingMessage = {
      id: Date.now() + 2,
      type: "loading",
      text: `Analyzing ${websiteUrl}...`,
    };

    setMessages((previous) => [
      ...previous,
      loadingMessage,
    ]);

    try {
      // =========================
      // CALL NODE BACKEND
      // =========================

      const response = await fetch(
        "http://172.19.134.109:5000/api/scan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: websiteUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Security scan failed"
        );
      }

      // =========================
      // SAVE TO HISTORY
      // =========================

      saveToHistory(data);

      // =========================
      // REMOVE LOADING
      // =========================

      setMessages((previous) =>
        previous.filter(
          (item) => item.type !== "loading"
        )
      );

      // =========================
      // ADD REAL SCAN RESULT
      // =========================

      const aiMessage = {
        id: Date.now() + 3,
        type: "scan-result",
        data: data,
      };

      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);
    } catch (error) {
      console.error("Scan error:", error);

      setMessages((previous) =>
        previous.filter(
          (item) => item.type !== "loading"
        )
      );

      const errorMessage = {
        id: Date.now() + 4,
        type: "ai-text",
        text:
          "I could not complete the security scan. Please make sure the CyberSaarthi backend and Python scanner are running, then try again.",
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setScanning(false);
    }
  };

  // =========================
  // NEW CHAT
  // =========================

  const handleNewChat = () => {
    setMessages([]);
    setMessage("");
  };

  // =========================
  // RISK CLASS
  // =========================

  const getRiskClass = (riskLevel) => {
    if (!riskLevel) return "";

    return riskLevel
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          🛡️ CyberSaarthi
        </div>

        <button
          className="new-chat-btn"
          onClick={handleNewChat}
        >
          + New Chat
        </button>

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/security-issues")}
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


      {/* ================= MAIN AREA ================= */}

      <main className="chat-area">

        {/* HEADER */}

        <header className="chat-header">

          <div>
            <h2>CyberSaarthi</h2>
            <span>AI Security Assistant</span>
          </div>

        </header>


        {/* ================= CHAT CONTENT ================= */}

        <div className="chat-content">

          {/* EMPTY CHAT */}

          {messages.length === 0 && (

            <div className="welcome-section">

              <div className="welcome-icon">
                🛡️
              </div>

              <h1>
                CyberSaarthi Security Assistant
              </h1>

              <p>
                Enter your website URL below and ask
                CyberSaarthi to analyze its security.
              </p>

            </div>

          )}


          {/* ================= MESSAGES ================= */}

          {messages.length > 0 && (

            <div className="result-chat">

              {messages.map((item) => (

                <div
                  key={item.id}
                  className={
                    item.type === "user"
                      ? "user-message"
                      : "ai-message"
                  }
                >

                  {/* USER */}

                  {item.type === "user" && (

                    <>
                      <div className="message-avatar">
                        U
                      </div>

                      <div>

                        <span className="message-label">
                          You
                        </span>

                        <p>
                          {item.text}
                        </p>

                      </div>
                    </>
                  )}


                  {/* LOADING */}

                  {item.type === "loading" && (

                    <>
                      <div className="message-avatar ai-avatar">
                        🛡️
                      </div>

                      <div className="ai-response">

                        <span className="message-label">
                          CyberSaarthi AI
                        </span>

                        <p>
                          🔍 {item.text}
                        </p>

                        <p>
                          Checking website security...
                        </p>

                      </div>
                    </>
                  )}


                  {/* NORMAL AI TEXT */}

                  {item.type === "ai-text" && (

                    <>
                      <div className="message-avatar ai-avatar">
                        🛡️
                      </div>

                      <div className="ai-response">

                        <span className="message-label">
                          CyberSaarthi AI
                        </span>

                        <p>
                          {item.text}
                        </p>

                      </div>
                    </>
                  )}


                  {/* ================= REAL SCAN RESULT ================= */}

                  {item.type === "scan-result" && (

                    <>
                      <div className="message-avatar ai-avatar">
                        🛡️
                      </div>

                      <div className="ai-response">

                        <span className="message-label">
                          CyberSaarthi AI
                        </span>

                        <h3>
                          Security analysis completed
                        </h3>

                        <p>
                          I analyzed:
                        </p>

                        <p>
                          <strong>
                            {item.data.target}
                          </strong>
                        </p>


                        {/* SCORE */}

                        <div className="finding">

                          <h4>
                            🛡️ Security Score
                          </h4>

                          <p>
                            <strong>
                              {item.data.securityScore}/100
                            </strong>
                          </p>

                          <p>
                            Risk Level:
                          </p>

                          <p
                            className={`risk-${getRiskClass(
                              item.data.riskLevel
                            )}`}
                          >
                            <strong>
                              {item.data.riskLevel}
                            </strong>
                          </p>

                        </div>


                        {/* FINDINGS */}

                        <h3>
                          Security Problems Found
                        </h3>

                        {item.data.findings &&
                        item.data.findings.length > 0 ? (

                          item.data.findings.map(
                            (finding, index) => (

                              <div
                                className="finding"
                                key={index}
                              >

                                <h4>
                                  {finding.severity ===
                                  "HIGH"
                                    ? "🔴"
                                    : finding.severity ===
                                      "MEDIUM"
                                    ? "🟠"
                                    : "🟡"}{" "}
                                  {finding.title}
                                </h4>

                                <p>
                                  <strong>
                                    Severity:
                                  </strong>{" "}
                                  {finding.severity}
                                </p>

                                <p>
                                  <strong>
                                    Category:
                                  </strong>{" "}
                                  {finding.category}
                                </p>

                                <strong>
                                  What does this mean?
                                </strong>

                                <p>
                                  This is a security area
                                  that should be reviewed
                                  and improved to better
                                  protect your website.
                                </p>

                                <strong>
                                  What should you do?
                                </strong>

                                <p>
                                  Review this issue in your
                                  website configuration and
                                  apply the recommended
                                  security protection.
                                </p>

                              </div>

                            )
                          )

                        ) : (

                          <div className="finding">

                            <h4>
                              ✅ No issues found
                            </h4>

                            <p>
                              The scanner did not return
                              any security findings.
                            </p>

                          </div>

                        )}


                        {/* SIMPLE ADVICE */}

                        <div className="ai-tip">

                          💡{" "}

                          <strong>
                            Simple advice:
                          </strong>

                          <p>
                            Start with the highest-severity
                            problems first. Fixing critical
                            and high-risk issues can
                            significantly improve your
                            website's security.
                          </p>

                        </div>

                      </div>
                    </>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ================= CHAT INPUT ================= */}

        <form
          className="chat-input-area"
          onSubmit={handleSend}
        >

          <input
            type="text"
            placeholder={
              scanning
                ? "Analyzing website..."
                : "Enter your website URL or ask CyberSaarthi..."
            }
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={scanning}
          />

          <button
            type="submit"
            disabled={scanning}
          >
            {scanning ? "..." : "➤"}
          </button>

        </form>

      </main>

    </div>
  );
}

export default Dashboard;