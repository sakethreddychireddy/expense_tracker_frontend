import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Dashboard.css";
import { FiSettings, FiLogOut } from "react-icons/fi"; // menu icons

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="modern-container">
      <div
        className="profile"
        ref={menuRef}
        style={{ position: "absolute", top: 20, right: 20 }}
      >
        <FaUserCircle
          className="profile-icon"
          onClick={() => setShowMenu(!showMenu)}
          size={36}
        />
        {showMenu && (
          <div className="dropdown">
            <button
              onClick={() => {
                setShowMenu(false);
                navigate("/settings");
              }}
            >
              <FiSettings /> Settings
            </button>
            <button
              onClick={() => {
                alert("Logging out...");
                navigate("/login");
              }}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </div>
      {/* Header */}
      {/* <header className="dashboard__header"> */}
      <h2 className="dashboard__title">Expense Tracker Dashboard</h2>

      {/* Main Actions */}
      <main className="dashboard__main">
        <div className="dashboard__actions">
          <button
            type="button"
            className="dashboard__button"
            onClick={() => navigate("/AddExpense")}
          >
            ➕ Add Expense
          </button>
          <button
            type="button"
            className="dashboard__button"
            onClick={() => navigate("/GetAllExpenses")}
          >
            📋 View Expenses
          </button>
          <button
            type="button"
            className="dashboard__button"
            onClick={() => navigate("/getMonthlyExpenses")}
          >
            📊 Monthly Chart
          </button>
          <button
            type="button"
            className="dashboard__button"
            onClick={() => navigate("/AddRecurringExpense")}
          >
            🔁 Add Recurring Expense
          </button>
          <button
            type="button"
            className="dashboard__button"
            onClick={() => navigate("/GetAllRecurringExpenses")}
          >
            📅 View Recurring Expenses
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
