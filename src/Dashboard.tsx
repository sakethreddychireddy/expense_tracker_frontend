import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";

import { CategorySpending, MonthlyExpense } from "./types/expense";
import {
  GetSpendingByCategory,
  getMonthlyExpenses,
  Logout,
} from "./api/expenseApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

import "./Dashboard.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(
    []
  );
  // const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  // const fetchMonthlyExpenses = async () => {
  //   try {
  //     const data = await getMonthlyExpenses();
  //     setMonthlyExpenses(data);
  //   } catch (error) {
  //     console.error("Error fetching monthly expenses", error);
  //     setMonthlyExpenses([]);
  //   }
  // };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    GetSpendingByCategory()
      .then((data) => setCategorySpending(data))
      .catch((err) => console.error("Error fetching category spending:", err));

    // fetchMonthlyExpenses();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalSpending = categorySpending.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3 className="sidebar-logo">💸 EXPENSE</h3>

        <button onClick={() => navigate("/AddExpense")}>➕ Add Expense</button>
        <button onClick={() => navigate("/GetAllExpenses")}>
          📋 View Expenses
        </button>
        <button onClick={() => navigate("/getMonthlyExpenses")}>
          📊 Monthly Expenses
        </button>
        <button onClick={() => navigate("/AddRecurringExpense")}>
          🔁 Recurring Expense
        </button>
        <button onClick={() => navigate("/GetAllRecurringExpenses")}>
          📅 View Recurring
        </button>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Profile */}
        <div className="profile-menu" ref={menuRef}>
          <FaUserCircle
            className="profile-icon"
            size={40}
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/settings")}>
                <FiSettings /> Settings
              </button>
              <button
                style={{ color: "red" }}
                onClick={async () => {
                  await Logout();
                  navigate("/login");
                }}
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>

        <h2
          className="dashboard-title"
          style={{ textAlign: "center", color: "blue" }}
        >
          Expense Tracker Dashboard
        </h2>

        {/* Category Spending */}
        <div className="category-section">
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            💰 Spending by Category
          </h3>
          <p
            className="total-text"
            style={{
              color: "#e5290cff", // green color
              fontWeight: "bold",
              fontSize: "25px",
              textAlign: "center",
            }}
          >
            Total: ${totalSpending.toFixed(2)}
          </p>

          <div className="category-card-grid">
            {categorySpending.map((cat, i) => (
              <div key={i} className="category-card">
                <h4>{cat.categoryName}</h4>
                <p>${cat.totalAmount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        {/* <div className="chart-section">
          <h3>📅 Expenses By Month</h3>

          <ResponsiveContainer width="95%" height={300}>
            <BarChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAmount" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div> */}
        <div className="category-spending">
          <h3 style={{ textAlign: "center", marginBottom: "20px" }}>
            📊 Spending by Category
          </h3>
          {/* Additional content can go here */}
          <ResponsiveContainer width="95%" height={450}>
            <BarChart data={categorySpending}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoryName" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* <Bar dataKey="totalAmount" barSize={50} /> */}
              <Bar dataKey="totalAmount">
                {categorySpending.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      [
                        "#8884d8",
                        "#82ca9d",
                        "#ffc658",
                        "#ff8042",
                        "#8dd1e1",
                        "#a4de6c",
                        "#d0ed57",
                      ][index % 7]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
