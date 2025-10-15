import React, { useState, useEffect } from "react";
import { Login as loginUser } from "./api/expenseApi";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const response = await loginUser({ email, password });
      if (response && response.token) {
        localStorage.setItem("authToken", response.token);
        setSuccessMessage("Login successful!");
        setIsLoggedIn(true);
        navigate("/dashboard");
      }
    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setSuccessMessage("");
    setErrorMessage("");
    setEmail("");
    setPassword("");
    navigate("/login");
  };

  return (
    <div className="login-container modern-login">
      {isLoggedIn && (
        <button className="logout-btn-top" onClick={handleLogout}>
          Logout
        </button>
      )}

      <div className="login-card">
        <h2 className="login-title">
          {isLoggedIn ? "Welcome Back!" : "Sign In"}
        </h2>

        {isLoggedIn ? (
          <p className="success-message">You are already logged in.</p>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                <span className="icon">&#9993;</span> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">
                <span className="icon">&#128274;</span> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
            <button className="login-btn" type="submit">
              Login
            </button>
            {/* <div className="register-link">
              Don't have an account? &nbsp;
              <a href="/Register">Register</a>
            </div> */}
            <div className="register-link">
              Don't have an account? <Link to="/Register">Register</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
