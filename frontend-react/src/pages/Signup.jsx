import { Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
  return (
    <div className="signup-page">
      <div className="signup-card">

        <div className="signup-logo">
          🛡️ CyberSaarthi
        </div>

        <h1>Create Account</h1>

        <p className="signup-subtitle">
          Start securing your digital assets
        </p>

        <form>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="signup-button">
            Create Account
          </button>
        </form>

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;