import { useNavigate } from "react-router-dom";
import "./profile.css";

function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove login information if you are storing it
    localStorage.removeItem("cybersaarthi_user");

    // Go back to login page
    navigate("/login");
  };

  return (
    <div className="profile-page">

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
            className="nav-item"
            onClick={() => navigate("/history")}
          >
            <span>◷</span>
            Scan History
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item active"
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
      <main className="profile-main">

        <div className="profile-container">

          <div className="profile-header">

            <div className="profile-avatar">
              👤
            </div>

            <div>
              <h1>Profile & Settings</h1>

              <p>
                Manage your CyberSaarthi account and security preferences.
              </p>
            </div>

          </div>


          {/* ACCOUNT */}
          <section className="settings-card">

            <h2>Account</h2>

            <div className="setting-row">

              <div>
                <strong>Name</strong>
                <p>CyberSaarthi User</p>
              </div>

            </div>

            <div className="setting-row">

              <div>
                <strong>Email</strong>
                <p>test@cybersaarthi.com</p>
              </div>

            </div>

          </section>


          {/* NOTIFICATIONS */}
          <section className="settings-card">

            <h2>Notifications</h2>

            <div className="setting-row">

              <div>
                <strong>Security alerts</strong>

                <p>
                  Receive notifications about important security issues.
                </p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  defaultChecked
                />
                <span className="slider"></span>
              </label>

            </div>

          </section>


          {/* SECURITY */}
          <section className="settings-card">

            <h2>Security Preferences</h2>

            <div className="setting-row">

              <div>
                <strong>Website security monitoring</strong>

                <p>
                  Keep track of security issues detected during scans.
                </p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  defaultChecked
                />
                <span className="slider"></span>
              </label>

            </div>

          </section>


          {/* LOGOUT */}
          <section className="logout-card">

            <div>
              <h2>Logout</h2>

              <p>
                Sign out of your CyberSaarthi account.
              </p>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </section>

        </div>

      </main>

    </div>
  );
}

export default Profile;