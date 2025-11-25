import { useEffect, useState, useRef, useCallback } from "react";
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

  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalCount: 0,
  });

  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch Expenses (Memoized for useEffect)
  const fetchExpenses = useCallback(
    async (pageNumber = 1) => {
      try {
        setLoading(true);
        const data = await getAllExpenses(pageNumber, pagination.pageSize);

        setExpenses(data.items || []);
        setFilteredExpenses(data.items || []);
        setPagination({
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        });
      } catch (error) {
        console.error("Error fetching expenses", error);
      } finally {
        setLoading(false);
      }
    },
    [pagination.pageSize]
  );

  // Fetch total (Memoized)
  const fetchTotal = useCallback(async () => {
    try {
      const data = await getTotalExpenses();
      setTotal(data.totalAmount ?? 0);
    } catch (error) {
      console.error("Error fetching total", error);
      setTotal(0);
    }
  }, []);

  // Delete expense
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

  // Search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lower = query.toLowerCase();
    const filtered = expenses.filter(
      (exp) =>
        exp.title.toLowerCase().includes(lower) ||
        exp.categoryName?.toLowerCase().includes(lower)
    );
    setFilteredExpenses(filtered);
  };

  // Sort
  const handleSort = () => {
    const sorted = [...filteredExpenses].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setFilteredExpenses(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filter by period
  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    const now = new Date();
    let filtered = expenses;

    const periods: Record<string, number> = {
      weekly: 7,
      monthly: 30,
      quarterly: 90,
      midyear: 180,
      yearly: 365,
    };

    if (period !== "all" && periods[period]) {
      const daysAgo = new Date();
      daysAgo.setDate(now.getDate() - periods[period]);
      filtered = expenses.filter((exp) => new Date(exp.date) >= daysAgo);
    }

    setFilteredExpenses(filtered);
  };

  // ✅ FIXED useEffect — dependencies added
  useEffect(() => {
    fetchExpenses(1);
    fetchTotal();
  }, [fetchExpenses, fetchTotal]);

  // Pagination
  const nextPage = () => {
    if (pagination.pageNumber < pagination.totalPages) {
      fetchExpenses(pagination.pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pagination.pageNumber > 1) {
      fetchExpenses(pagination.pageNumber - 1);
    }
  };

  return (
    <div className="modern-container">
      {/* Profile Dropdown */}
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
        <h3
          className="header"
          style={{ textAlign: "center", fontSize: "24px", fontWeight: "bold" }}
        >
          📋 Expense List
        </h3>
        <p
          className="total-expense"
          style={{ textAlign: "center", fontSize: "20px" }}
        >
          Total Expenses: <b>${total.toFixed(2)}</b>
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
            fontWeight: "bold",
          }}
        >
          Back
        </button>

        {/* Search & Sort Controls */}
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search by title or category"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-bar"
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

        {/* Table */}
        {loading ? (
          <p>Loading expenses...</p>
        ) : filteredExpenses.length === 0 ? (
          <p>🚀 No expenses found. Try adjusting your search!</p>
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
                        className={`badge badge-${exp.categoryName.toLowerCase()}`}
                      >
                        {exp.categoryName}
                      </span>
                    </td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>
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

            {/* Pagination */}
            <div className="pagination">
              <button onClick={prevPage} disabled={pagination.pageNumber === 1}>
                ◀ Prev
              </button>
              <span>
                Page {pagination.pageNumber} of {pagination.totalPages}
              </span>
              <button
                onClick={nextPage}
                style={{ color: "blue", marginLeft: "1700px" }}
                disabled={pagination.pageNumber === pagination.totalPages}
              >
                Next ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
