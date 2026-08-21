import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import Scan from "./pages/scan";
import ScanResult from "./pages/scanResult";
import History from "./pages/history";
import Profile from "./pages/profile";
import ScanDetails from "./pages/scanDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={
            <div
              style={{
                minHeight: "100vh",
                background: "#0b0f14",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <h1>🛡️ CyberSaarthi</h1>

              <p>Cybersecurity Assessment Platform</p>

              <div style={{ marginTop: "20px" }}>
                <a
                  href="/login"
                  style={{
                    color: "#2678ff",
                    marginRight: "20px",
                  }}
                >
                  Login
                </a>

                <a
                  href="/signup"
                  style={{
                    color: "#2678ff",
                  }}
                >
                  Create Account
                </a>
              </div>
            </div>
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* SCAN */}
        <Route
          path="/scan"
          element={<Scan />}
        />

        {/* SCAN RESULT */}
        <Route
          path="/scan-result"
          element={<ScanResult />}
        />

        {/* SCAN DETAILS */}
        <Route
          path="/scan-details/:id"
          element={<ScanDetails />}
        />

        {/* HISTORY */}
        <Route
          path="/history"
          element={<History />}
        />

        {/* PROFILE / SETTINGS */}
        <Route
          path="/profile"
          element={<Profile />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
