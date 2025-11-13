import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Expense } from "../types/expense";
import {
  getAllExpenses,
  deleteExpense,
  getTotalExpenses,
  Logout,
} from "../../../api/expenseApi";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import "./ExpenseList.css";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<number>(0);
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [timePeriod, setTimePeriod] = useState<string>("all");
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await getAllExpenses();
      setExpenses(data);
      setFilteredExpenses(data);
    } catch (error) {
      console.error("Error fetching expenses", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotal = async () => {
    try {
      const data = await getTotalExpenses();
      setTotal(data.totalAmount ?? 0);
    } catch (error) {
      console.error("Error fetching total", error);
      setTotal(0);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const res = await deleteExpense(id);
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
        setFilteredExpenses((prev) => prev.filter((exp) => exp.id !== id));
        if (res.updatedTotal !== undefined) {
          setTotal(res.updatedTotal);
        } else {
          await fetchTotal();
        }
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();
    const filtered = expenses.filter(
      (exp) =>
        exp.title.toLowerCase().includes(lowerCaseQuery) ||
        exp.categoryName?.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredExpenses(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredExpenses].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredExpenses(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    const now = new Date();
    let filtered = expenses;

    if (period === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = expenses.filter((exp) => new Date(exp.date) >= oneWeekAgo);
    } else if (period === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = expenses.filter((exp) => new Date(exp.date) >= oneMonthAgo);
    } else if (period === "quarterly") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      filtered = expenses.filter((exp) => new Date(exp.date) >= threeMonthsAgo);
    } else if (period === "midyear") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      filtered = expenses.filter((exp) => new Date(exp.date) >= sixMonthsAgo);
    } else if (period === "yearly") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      filtered = expenses.filter((exp) => new Date(exp.date) >= oneYearAgo);
    }

    setFilteredExpenses(filtered);
  };

  useEffect(() => {
    fetchExpenses();
    fetchTotal();
  }, []);

  return (
    <div className="modern-container">
      {/* Profile Icon & Dropdown */}
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

      <div className="card">
        {/* Header */}
        <h3 className="header" style={{ textAlign: "center" }}>
          📋 Expense List
        </h3>
        <p
          className="total-expense"
          style={{ textAlign: "center", fontSize: "20px" }}
        >
          Total Expenses: <b color="red">${total.toFixed(2)}</b>
        </p>
        <button
          onClick={() => navigate("/Dashboard")}
          style={{
            position: "absolute",
            top: 90,
            right: 20,
            padding: "10px 15px",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Back
        </button>

        {/* Search, Sort, and Time Period Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search by title or category"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-bar"
            style={{
              marginRight: "10px",
              width: "60%",
              padding: "8px",
              fontSize: "14px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            }}
          />
          <button onClick={handleSort} className="sort-button">
            Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
          </button>
          <select
            value={timePeriod}
            onChange={(e) => handleTimePeriodChange(e.target.value)}
            className="time-period-dropdown"
          >
            <option value="all">All Time</option>
            <option value="weekly">Last Week</option>
            <option value="monthly">Last Month</option>
            <option value="quarterly">Last Quarter</option>
            <option value="midyear">Last 6 Months</option>
            <option value="yearly">Last Year</option>
          </select>
        </div>

        {/* Table or Empty State */}
        {loading ? (
          <p className="loading">Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <div className="empty">
            <p>🚀 No expenses found. Try adjusting your search!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount ($)</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.title}</td>
                    <td className="amount">
                      ${Number(exp.amount ?? 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${exp.categoryName
                          ?.toLowerCase()
                          .replace(/\s+/g, "")}`}
                      >
                        {exp.categoryName}
                      </span>
                    </td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="edit"
                        onClick={() => navigate(`/UpdateExpense/${exp.id}`)}
                      >
                        ✏ Edit
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDelete(exp.id!)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
