import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import Scan from "./pages/scan";
import ScanResult from "./pages/scanResult";
import History from "./pages/history";
import Profile from "./pages/profile";
import ScanDetails from "./pages/scanDetails";
import SecurityIssues from "./pages/securityIssues";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        {/* YOUR ORIGINAL DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/scan"
          element={<Scan />}
        />

        <Route
          path="/scan-result"
          element={<ScanResult />}
        />

        <Route
          path="/scan-details/:id"
          element={<ScanDetails />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/security-issues"
          element={<SecurityIssues />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;