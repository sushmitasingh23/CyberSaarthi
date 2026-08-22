import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./dashboard.css";

const API_BASE = "https://cybersaarthi-9rer.onrender.com";

/* =====================================================
   REMEDIATION KNOWLEDGE BASE
===================================================== */

const REMEDIATION_RULES = [
  {
    match: ["content-security-policy", "csp"],
    meaning:
      "The website does not send a Content-Security-Policy (CSP) header. CSP helps control which scripts, styles, images, frames, and other resources the browser is allowed to load.",
    steps: [
      "Open the web server or application configuration responsible for the target website.",
      "Add a Content-Security-Policy response header for the website.",
      "Start with a restrictive policy and allow only the trusted sources required by the application.",
      "Test the website and check the browser console for resources blocked by the new policy.",
      "Adjust the policy only where legitimate application resources require it, then deploy the configuration.",
      "Run CyberSaarthi again to confirm that the CSP header is now detected."
    ]
  },

  {
    match: ["strict-transport-security", "hsts"],
    meaning:
      "The website does not provide an HTTP Strict-Transport-Security (HSTS) policy. HSTS tells browsers to use HTTPS instead of allowing insecure HTTP connections.",
    steps: [
      "Confirm that the website is already available correctly over HTTPS.",
      "Open the web server or reverse-proxy configuration.",
      "Add the Strict-Transport-Security response header with an appropriate max-age value.",
      "After testing, consider enabling includeSubDomains only when all relevant subdomains support HTTPS.",
      "Verify that the header is returned on HTTPS responses.",
      "Run the security scan again to confirm the configuration."
    ]
  },

  {
    match: ["x-frame-options", "clickjacking"],
    meaning:
      "The website does not clearly prevent other websites from embedding its pages in frames. This can increase the risk of clickjacking attacks.",
    steps: [
      "Open the website's server or application security-header configuration.",
      "Configure an appropriate X-Frame-Options policy or an equivalent frame-ancestors CSP directive.",
      "Choose the policy according to whether the application legitimately needs to be embedded by another website.",
      "Test important pages to make sure legitimate framing still works where required.",
      "Deploy the updated security-header configuration.",
      "Run the scan again and verify that the protection is detected."
    ]
  },

  {
    match: ["x-content-type-options", "mime sniffing", "content-type"],
    meaning:
      "The website does not provide the X-Content-Type-Options protection that helps prevent browsers from MIME-sniffing certain responses.",
    steps: [
      "Open the web server or application security-header configuration.",
      "Add the X-Content-Type-Options response header.",
      "Use the value nosniff for normal browser responses.",
      "Check that files are served with their correct Content-Type values.",
      "Test important pages and static resources after applying the change.",
      "Run CyberSaarthi again to verify the header."
    ]
  },

  {
    match: ["server header", "server information", "server version"],
    meaning:
      "The web server appears to expose information about the server software or version through its response headers.",
    steps: [
      "Inspect the HTTP response headers returned by the affected website.",
      "Identify which server or framework configuration exposes the software information.",
      "Disable unnecessary server-version disclosure where your server supports this option.",
      "Check application and reverse-proxy configurations because more than one component may add the header.",
      "Test the website to make sure normal responses still work.",
      "Run another scan to verify that unnecessary version information is no longer exposed."
    ]
  },

  {
    match: ["timeout", "timed out", "request timeout"],
    meaning:
      "The target did not respond within the scanner's configured timeout period. This can be caused by server availability, slow application responses, DNS problems, network filtering, rate limiting, or an overloaded service.",
    steps: [
      "Verify that the target website is reachable from an authorized network.",
      "Check that the domain resolves correctly through DNS.",
      "Check the web server, reverse proxy, and application logs for slow or failed requests.",
      "Check firewall, WAF, proxy, or rate-limiting rules that could be blocking or delaying requests.",
      "If the application is overloaded, investigate response latency and server resource usage.",
      "After correcting the problem, run the scan again and confirm that the target responds within the expected time."
    ]
  },

  {
    match: ["ssl", "tls", "certificate", "https"],
    meaning:
      "The scanner detected a possible issue related to HTTPS, TLS configuration, or the website's certificate.",
    steps: [
      "Open the website using HTTPS and inspect the certificate information.",
      "Confirm that the certificate is valid, trusted, and matches the target hostname.",
      "Check the certificate's expiration date and certificate chain.",
      "Review the server's enabled TLS versions and cipher configuration.",
      "Disable obsolete or insecure TLS configurations where appropriate.",
      "Run the security scan again to verify the HTTPS configuration."
    ]
  },

  {
    match: ["cookie", "secure flag", "httponly", "samesite"],
    meaning:
      "One or more cookies may not have appropriate security attributes. Cookie flags help reduce the risk of session theft and cross-site attacks.",
    steps: [
      "Identify the cookies reported by the scanner.",
      "Mark sensitive session cookies as Secure so they are transmitted only over HTTPS.",
      "Use HttpOnly for cookies that should not be accessible to client-side JavaScript.",
      "Configure an appropriate SameSite policy for the application's authentication and cross-site requirements.",
      "Test login, logout, and other session-dependent features.",
      "Run the scan again to verify the cookie security attributes."
    ]
  },

  {
    match: ["cors", "cross-origin"],
    meaning:
      "The website's Cross-Origin Resource Sharing configuration may allow origins more broadly than necessary.",
    steps: [
      "Identify the API endpoint and the origins currently allowed by the application.",
      "Remove wildcard or unnecessary origins where they are not required.",
      "Allow only trusted origins that actually need cross-origin access.",
      "Check whether credentials such as cookies or authorization headers are involved.",
      "Test the application's legitimate cross-origin requests.",
      "Run the scan again to verify the CORS configuration."
    ]
  }
];

/* =====================================================
   HELPERS
===================================================== */

function normalizeFinding(finding) {
  if (!finding) {
    return {
      title: "Security Issue",
      severity: "MEDIUM",
      description: "",
      recommendation: ""
    };
  }

  return {
    title:
      finding.title ||
      finding.name ||
      finding.issue ||
      finding.vulnerability ||
      finding.type ||
      "Security Issue",

    severity: String(
      finding.severity ||
        finding.risk ||
        finding.level ||
        "MEDIUM"
    ).toUpperCase(),

    description:
      finding.description ||
      finding.details ||
      finding.message ||
      finding.explanation ||
      "",

    recommendation:
      finding.recommendation ||
      finding.remediation ||
      finding.fix ||
      ""
  };
}

function getRemediation(finding) {
  const normalized = normalizeFinding(finding);

  const searchText =
    `${normalized.title} ${normalized.description}`.toLowerCase();

  const rule = REMEDIATION_RULES.find((item) =>
    item.match.some((keyword) =>
      searchText.includes(keyword.toLowerCase())
    )
  );

  if (rule) {
    return {
      meaning: rule.meaning,
      steps: rule.steps
    };
  }

  if (normalized.recommendation) {
    const steps = String(normalized.recommendation)
      .split(/\n+/)
      .map((item) =>
        item
          .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "")
          .trim()
      )
      .filter(Boolean);

    if (steps.length > 0) {
      return {
        meaning:
          normalized.description ||
          "The scanner detected a security issue that requires review.",
        steps
      };
    }
  }

  return {
    meaning:
      normalized.description ||
      "The scanner detected a security issue that requires review. The exact cause should be confirmed before making configuration changes.",

    steps: [
      "Review the detected issue and identify the affected website component.",
      "Check the relevant server, application, or security configuration.",
      "Confirm the issue using the website's response, logs, or configuration.",
      "Apply the appropriate security configuration change based on the confirmed cause.",
      "Test the website carefully after making the change.",
      "Run CyberSaarthi again to verify that the issue has been resolved."
    ]
  };
}

function getRiskClass(score) {
  const value = Number(score);

  if (value >= 80) return "good";
  if (value >= 50) return "medium";

  return "danger";
}

function formatDate(date) {
  if (!date) return "Unknown date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Unknown date";
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/* =====================================================
   URL VALIDATION
===================================================== */

function isValidWebsiteUrl(value) {
  const text = value.trim();

  if (!text) return false;

  try {
    const url = new URL(text);

    return (
      (url.protocol === "http:" ||
        url.protocol === "https:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalScans: 0,
    averageScore: 0,
    highRiskScans: 0,
    criticalRiskScans: 0
  });

  const [recentScans, setRecentScans] = useState([]);

  const [messages, setMessages] = useState([]);

  const [target, setTarget] = useState("");

  const [loading, setLoading] = useState(false);


  const [loadingDashboard, setLoadingDashboard] =
    useState(true);
  const [aiResponses, setAiResponses] = useState({});
  const [aiLoading, setAiLoading] = useState(false); 

  const chatRef = useRef(null);

  /* =====================================================
     LOAD DASHBOARD
  ===================================================== */

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoadingDashboard(true);

      const [statsResponse, recentResponse] =
        await Promise.all([
          fetch(`${API_BASE}/api/dashboard/stats`),
          fetch(`${API_BASE}/api/dashboard/recent-scans`)
        ]);

      const statsData = await statsResponse.json();
      const recentData = await recentResponse.json();

      if (statsData.success) {
        setStats(
          statsData.statistics || {
            totalScans: 0,
            averageScore: 0,
            highRiskScans: 0,
            criticalRiskScans: 0
          }
        );
      }

      if (recentData.success) {
        setRecentScans(recentData.scans || []);
      }
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoadingDashboard(false);
    }
  }

  /* =====================================================
     AUTO SCROLL CHAT
  ===================================================== */

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop =
        chatRef.current.scrollHeight;
    }
  }, [messages, loading, aiLoading]);

  /* =====================================================
     LOCAL OLLAMA AI CHAT
  ===================================================== */

  async function handleAIChat(message) {
    const cleanMessage = message.trim();

    if (!cleanMessage || aiLoading) return;

    setAiLoading(true);

    try {
      const lastScanMessage =
        [...messages]
          .reverse()
          .find(
            (item) =>
              item.type === "scan-result"
          );

      const scanResult =
        lastScanMessage?.result || null;

      const response = await fetch(
        `${API_BASE}/api/ai/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: cleanMessage,
            scanResult: scanResult
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.details ||
            "AI service failed"
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          type: "text",
          content:
            data.reply ||
            "I couldn't generate a response."
        }
      ]);
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 2,
          role: "assistant",
          type: "error",
          content:
            "CyberSaarthi AI could not connect to the local AI service. Make sure Ollama is running."
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  /* =====================================================
     SCAN
  ===================================================== */

  async function handleScan(event) {
    event?.preventDefault();

    const cleanTarget = target.trim();

    if (!cleanTarget || loading || aiLoading) return;

    /* USER MESSAGE */

    setMessages((previous) => [
      ...previous,
      {
        id: Date.now(),
        role: "user",
        content: cleanTarget
      }
    ]);

    setTarget("");

    /* =================================================
       NORMAL CHAT → OLLAMA
    ================================================= */

    if (!isValidWebsiteUrl(cleanTarget)) {
      await handleAIChat(cleanTarget);
      return;
    }

    /* =================================================
       REAL WEBSITE URL → SCANNER
    ================================================= */

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/api/scan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            target: cleanTarget
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Scan failed"
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          role: "assistant",
          type: "scan-result",
          result: data
        }
      ]);

      await loadDashboard();
    } catch (error) {
      console.error("Scan error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 2,
          role: "assistant",
          type: "error",
          content:
            error.message ||
            "Unable to complete the scan."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  /* =====================================================
     RECENT SCAN CLICK
  ===================================================== */

  async function openRecentScan(scan) {
    if (!scan?._id) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/history/${scan._id}`
      );

      const data = await response.json();

      if (!data.success) return;

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now(),
          role: "assistant",
          type: "scan-result",
          result: data.scan
        }
      ]);
    } catch (error) {
      console.error(
        "Could not open scan:",
        error
      );
    }
  }

  /* =====================================================
     NEW SCAN
  ===================================================== */

  function startNewScan() {
    setMessages([]);
    setTarget("");

    setTimeout(() => {
      document
        .querySelector(".chat-input")
        ?.focus();
    }, 100);
  }

  /* =====================================================
     FINDING COUNTS
  ===================================================== */

  function getFindingCounts(findings = []) {
    const counts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    findings.forEach((finding) => {
      const severity = String(
        finding.severity ||
          finding.risk ||
          finding.level ||
          "LOW"
      ).toLowerCase();

      if (severity === "critical") {
        counts.critical++;
      } else if (severity === "high") {
        counts.high++;
      } else if (severity === "medium") {
        counts.medium++;
      } else {
        counts.low++;
      }
    });

    return counts;
  }

  const showWelcome = messages.length === 0;

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <div className="dashboard-page">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-shield">
            🛡
          </div>

          <div>
            <strong>
              CyberSaarthi
            </strong>

            <span>
              AI SECURITY
            </span>
          </div>

        </div>

        <button
          className="new-chat-btn"
          onClick={startNewScan}
        >
          <span>+</span>
          New Scan
        </button>

        <nav className="sidebar-nav">

          <button
            className="nav-item active"
            onClick={() => {
              window.location.href =
                "/dashboard";
            }}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => {
              window.location.href =
                "/security-issues";
            }}
          >
            <span>⚠</span>
            Security Issues
          </button>

          <button
            className="nav-item"
            onClick={() => {
              window.location.href =
                "/history";
            }}
          >
            <span>◷</span>
            Scan History
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item"
            onClick={() => {
              window.location.href =
                "/settings";
            }}
          >
            <span>⚙</span>
            Settings & Privacy
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div>

            <div className="header-label">
              SECURITY COMMAND CENTER
            </div>

            <h1>
              Dashboard
            </h1>

            <p>
              Monitor and analyze website
              security with CyberSaarthi AI.
            </p>

          </div>

          <div className="header-status">
            <span className="status-dot" />
            SYSTEM ONLINE
          </div>

        </header>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-top">
              <span>Total Scans</span>

              <div className="stat-icon">
                ◌
              </div>
            </div>

            <strong>
              {loadingDashboard
                ? "—"
                : stats.totalScans}
            </strong>

            <small>
              Websites analyzed
            </small>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-top">
              <span>
                Average Score
              </span>

              <div className="stat-icon">
                ◉
              </div>
            </div>

            <strong>
              {loadingDashboard
                ? "—"
                : stats.averageScore}

              <span className="score-small">
                /100
              </span>
            </strong>

            <small>
              Overall security health
            </small>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-top">
              <span>
                High Risk
              </span>

              <div className="stat-icon warning">
                ▲
              </div>
            </div>

            <strong>
              {loadingDashboard
                ? "—"
                : stats.highRiskScans}
            </strong>

            <small>
              High-risk scans detected
            </small>

          </div>

          <div className="dashboard-stat-card">

            <div className="stat-top">
              <span>
                Critical Risk
              </span>

              <div className="stat-icon danger">
                !
              </div>
            </div>

            <strong>
              {loadingDashboard
                ? "—"
                : stats.criticalRiskScans}
            </strong>

            <small>
              Requires immediate attention
            </small>

          </div>

        </section>

        {/* =================================================
            CHAT + RECENT SCANS
        ================================================= */}

        <section className="dashboard-content-grid">

          {/* =================================================
              CHATBOT
          ================================================= */}

          <section className="security-chat-panel">

            {/* CHAT HEADER */}

            <div className="panel-header chat-header">

              <div className="panel-title">

                <div className="ai-icon">
                  🛡
                </div>

                <div>

                  <h2>
                    CyberSaarthi AI
                  </h2>

                  <span>
                    Security Assistant
                  </span>

                </div>

              </div>

              <div className="online-badge">
                <span />
                ONLINE
              </div>

            </div>

            {/* CHAT BODY */}

            <div
              className="chat-content"
              ref={chatRef}
            >

              {showWelcome ? (

                <div className="chat-welcome">

                  <div className="welcome-big-icon">
                    🛡
                  </div>

                  <h2>
                    What would you like to scan?
                  </h2>

                  <p>
                    Enter an authorized website
                    URL below and CyberSaarthi AI
                    will analyze its security
                    configuration and explain
                    detected issues.
                  </p>

                  <div className="example-url">
                    Try: https://example.com
                  </div>

                </div>

              ) : (

                <div className="conversation">

                  {messages.map((message) => {

                    /* USER */

                    if (
                      message.role === "user"
                    ) {
                      return (
                        <div
                          className="chat-message user-chat-message"
                          key={message.id}
                        >

                          <div className="message-column">

                            <div className="message-meta">
                              YOU
                            </div>

                            <div className="user-bubble">
                              {message.content}
                            </div>

                          </div>

                          <div className="message-avatar user-avatar">
                            U
                          </div>

                        </div>
                      );
                    }

                    /* NORMAL AI RESPONSE */

                    if (
                      message.type === "text"
                    ) {
                      return (
                        <div
                          className="chat-message ai-chat-message"
                          key={message.id}
                        >

                          <div className="message-avatar ai-avatar">
                            🛡
                          </div>

                          <div className="message-column">

                            <div className="message-meta">
                              CYBERSAARTHI AI
                            </div>

                            <div className="ai-text">
                              <ReactMarkdown>
                                {message.content}
                              </ReactMarkdown>
                            </div>

                          </div>

                        </div>
                      );
                    }

                    /* ERROR */

                    if (
                      message.type === "error"
                    ) {
                      return (
                        <div
                          className="chat-message ai-chat-message"
                          key={message.id}
                        >

                          <div className="message-avatar ai-avatar">
                            🛡
                          </div>

                          <div className="message-column">

                            <div className="message-meta">
                              CYBERSAARTHI AI
                            </div>

                            <div className="ai-text error-text">
                              {message.content}
                            </div>

                          </div>

                        </div>
                      );
                    }

                    /* SCAN RESULT */

                    if (
                      message.type === "scan-result"
                    ) {

                      const result =
                        message.result || {};

                      const findings =
                        Array.isArray(
                          result.findings
                        )
                          ? result.findings
                          : [];

                      const counts =
                        getFindingCounts(
                          findings
                        );

                      const score =
                        Number(
                          result.securityScore ??
                            result.score ??
                            0
                        );

                      const risk =
                        String(
                          result.riskLevel ||
                            result.risk ||
                            "UNKNOWN"
                        ).toUpperCase();

                      return (
                        <div
                          className="chat-message ai-chat-message scan-ai-message"
                          key={message.id}
                        >

                          <div className="message-avatar ai-avatar">
                            🛡
                          </div>

                          <div className="message-column ai-result-column">

                            <div className="message-meta">
                              CYBERSAARTHI AI
                            </div>

                            <div className="ai-result">

                              <h2>
                                Security analysis completed
                              </h2>

                              <p className="ai-intro">
                                I analyzed the
                                requested target and
                                identified the following
                                security findings.
                              </p>

                              {/* TARGET */}

                              <div className="target-box">

                                <span>
                                  TARGET
                                </span>

                                <strong>
                                  {result.target ||
                                    "Unknown target"}
                                </strong>

                              </div>

                              {/* SCORE */}

                              <div className="score-result-box">

                                <div>

                                  <span>
                                    SECURITY SCORE
                                  </span>

                                  <strong
                                    className={getRiskClass(
                                      score
                                    )}
                                  >
                                    {score}

                                    <small>
                                      /100
                                    </small>

                                  </strong>

                                </div>

                                <div className="risk-result">

                                  <span>
                                    RISK LEVEL
                                  </span>

                                  <strong
                                    className={`risk-${risk.toLowerCase()}`}
                                  >
                                    {risk}
                                  </strong>

                                </div>

                              </div>

                              {/* SUMMARY */}

                              <div className="vulnerability-summary">

                                <h3>
                                  Vulnerability Summary
                                </h3>

                                <div className="severity-grid">

                                  <div className="severity-card critical">
                                    <strong>
                                      {counts.critical}
                                    </strong>

                                    <span>
                                      Critical
                                    </span>
                                  </div>

                                  <div className="severity-card high">
                                    <strong>
                                      {counts.high}
                                    </strong>

                                    <span>
                                      High
                                    </span>
                                  </div>

                                  <div className="severity-card medium">
                                    <strong>
                                      {counts.medium}
                                    </strong>

                                    <span>
                                      Medium
                                    </span>
                                  </div>

                                  <div className="severity-card low">
                                    <strong>
                                      {counts.low}
                                    </strong>

                                    <span>
                                      Low
                                    </span>
                                  </div>

                                </div>

                              </div>

                              {/* FINDINGS */}

                              <h3 className="problems-title">
                                Security Problems Found
                              </h3>

                              {findings.length === 0 ? (

                                <div className="finding no-issues">

                                  <div className="finding-header">

                                    <div className="finding-severity">
                                      SAFE
                                    </div>

                                    <h4>
                                      No security issues reported
                                    </h4>

                                  </div>

                                  <p>
                                    The scanner did not
                                    return any findings
                                    for this target.
                                  </p>

                                </div>

                              ) : (

                                findings.map(
                                  (finding, index) => {

                                    const normalized =
                                      normalizeFinding(
                                        finding
                                      );

                                    const remediation =
                                      getRemediation(
                                        finding
                                      );

                                    const severity =
                                      normalized.severity;

                                    return (
                                      <article
                                        className="finding"
                                        key={
                                          finding._id ||
                                          finding.id ||
                                          `${normalized.title}-${index}`
                                        }
                                      >

                                        <div className="finding-header">

                                          <div
                                            className={`finding-severity finding-${severity.toLowerCase()}`}
                                          >
                                            {severity}
                                          </div>

                                          <h4>
                                            {
                                              normalized.title
                                            }
                                          </h4>

                                        </div>

                                        {/* MEANING */}

                                        <div className="finding-section">

                                          <h4 className="section-heading">
                                            What does this mean?
                                          </h4>

                                          <p>
                                            {
                                              remediation.meaning
                                            }
                                          </p>

                                        </div>

                                        {/* FIX */}

                                        <div className="finding-section remediation-section">

                                          <h4 className="section-heading">
                                            How to fix it
                                          </h4>

                                          <p className="fix-intro">
                                            Follow these
                                            steps to resolve
                                            this security
                                            issue:
                                          </p>

                                          <div className="remediation-steps">

                                            {remediation.steps.map(
                                              (
                                                step,
                                                stepIndex
                                              ) => (

                                                <div
                                                  className="remediation-step"
                                                  key={
                                                    stepIndex
                                                  }
                                                >

                                                  <div className="step-number">
                                                    {stepIndex + 1}
                                                  </div>

                                                  <div className="step-content">
                                                    {step}
                                                  </div>

                                                </div>

                                              )
                                            )}

                                          </div>

                                        </div>

                                        {/* BACKEND RECOMMENDATION */}

                                        {normalized.recommendation &&
                                          !remediation.steps.includes(
                                            normalized.recommendation
                                          ) && (

                                            <div className="backend-recommendation">

                                              <strong>
                                                Scanner recommendation
                                              </strong>

                                              <p>
                                                {
                                                  normalized.recommendation
                                                }
                                              </p>

                                            </div>

                                          )}

                                      </article>
                                    );
                                  }
                                )

                              )}

                              {/* AI NOTE */}

                              <div className="ai-tip">

                                <strong>
                                  CYBERSAARTHI AI
                                </strong>

                                <p>
                                  Remediation guidance is
                                  based on the detected
                                  finding type. Always
                                  verify changes in your
                                  own authorized
                                  environment before
                                  deployment.
                                </p>

                              </div>

                            </div>

                          </div>

                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* AI THINKING */}

                  {aiLoading && (

                    <div className="chat-message ai-chat-message">

                      <div className="message-avatar ai-avatar">
                        🛡
                      </div>

                      <div className="message-column">

                        <div className="message-meta">
                          CYBERSAARTHI AI
                        </div>

                        <div className="typing-indicator">

                          <span />
                          <span />
                          <span />

                          <em>
                            CyberSaarthi AI is thinking...
                          </em>

                        </div>

                      </div>

                    </div>

                  )}

                  {/* SCANNING */}

                  {loading && (

                    <div className="chat-message ai-chat-message">

                      <div className="message-avatar ai-avatar">
                        🛡
                      </div>

                      <div className="message-column">

                        <div className="message-meta">
                          CYBERSAARTHI AI
                        </div>

                        <div className="typing-indicator">

                          <span />
                          <span />
                          <span />

                          <em>
                            Analyzing target...
                          </em>

                        </div>

                      </div>

                    </div>

                  )}

                </div>

              )}

            </div>

            {/* =================================================
                INPUT
            ================================================= */}

            <form
              className="chat-input-area"
              onSubmit={handleScan}
            >

              <input
                className="chat-input"
                type="text"
                value={target}
                onChange={(event) =>
                  setTarget(event.target.value)
                }
                placeholder="Ask CyberSaarthi AI or enter a website URL..."
                disabled={loading || aiLoading}
              />

              <button
                type="submit"
                disabled={
                  loading ||
                  aiLoading ||
                  !target.trim()
                }
                aria-label="Send"
              >
                {loading || aiLoading ? "..." : "↑"}
              </button>

            </form>

          </section>

          {/* =================================================
              RECENT SCANS
          ================================================= */}

          <aside className="recent-scans-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Recent Scans
                </h2>

                <span>
                  Latest security assessments
                </span>

              </div>

              <button
                className="view-all-btn"
                onClick={() => {
                  window.location.href =
                    "/history";
                }}
              >
                View All →
              </button>

            </div>

            <div className="recent-scans-list">

              {loadingDashboard ? (

                <div className="empty-recent">
                  Loading scans...
                </div>

              ) : recentScans.length === 0 ? (

                <div className="empty-recent">
                  No scans yet
                </div>

              ) : (

                recentScans.map((scan) => {

                  const score =
                    Number(
                      scan.securityScore ??
                        scan.score ??
                        0
                    );

                  return (
                    <button
                      className="recent-scan-item"
                      key={scan._id}
                      onClick={() =>
                        openRecentScan(scan)
                      }
                    >

                      <div className="recent-scan-icon">
                        🛡
                      </div>

                      <div className="recent-scan-info">

                        <strong>
                          {scan.target ||
                            "Unknown target"}
                        </strong>

                        <span>
                          {formatDate(
                            scan.createdAt
                          )}
                        </span>

                      </div>

                      <div className="recent-scan-score">

                        <strong
                          className={getRiskClass(
                            score
                          )}
                        >
                          {score}
                        </strong>

                        <span>
                          /100
                        </span>

                      </div>

                    </button>
                  );
                })

              )}

            </div>

          </aside>

        </section>

      </main>

    </div>
  );
}