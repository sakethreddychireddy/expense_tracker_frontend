import React, { useState } from "react";
import { Register as registerUser } from "./api/expenseApi";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setErrorMessage("");

    try {
      const response = await registerUser({ email, password });

      if (response) {
        setSuccessMessage(
          "🎉 Registration successful! Redirecting to login..."
        );
        setEmail("");
        setPassword("");

        // Redirect after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error: any) {
      if (
        error?.response?.status === 409 ||
        error?.message === "Already registered"
      ) {
        setErrorMessage("Already registered. Please use a different email.");
      } else {
        setErrorMessage("Registration failed. Please try again later.");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Create an Account</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Enter your email"
              required
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="Enter your password"
              required
              autoComplete="new-password"
            />
          </div>

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}

          <button className="register-btn" type="submit">
            Register
          </button>

          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
