import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRecurringExpense, getRecurringExpenses } from "./api/expenseApi";
import { RecurringExpenseDto } from "./types/expense";
import { FaUserCircle } from "react-icons/fa"; // profile icon
import { FiSettings, FiLogOut } from "react-icons/fi"; // menu icons

const ViewRecurringExpense = () => {
  const [expenses, setExpenses] = useState<RecurringExpenseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const data = await getRecurringExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error fetching recurring expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this expense?"))
      return;
    try {
      await deleteRecurringExpense(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your expenses...</p>
        <style>{`
            .loading-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid #f3f3f3;
                border-top: 5px solid #1a237e;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 1rem;
            }
            .loading-text {
                color: #1a237e;
                font-size: 1.2rem;
                font-weight: 500;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
      </div>
    );

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
      <div className="card">
        {/* 🔹 Header */}
        <div className="header">
          <h2>💰 Expense Tracker</h2>
          {/* Back Button */}
          <button
            onClick={() => navigate("/Dashboard")}
            style={{
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
        </div>
        {/* 🔹 Total Expenses */}
        {/* <div className="summary-card">
          <h3>Total Spent</h3>
          <p>${total.toFixed(2)}</p>
        </div> */}

        {/* 🔹 Table or Empty State */}
        {loading ? (
          <p className="loading">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <div className="empty">
            <p>🚀 No expenses yet. Start adding your first one!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount ($)</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th>Start Date</th>
                  {/* <th>End Date</th> */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td>{exp.title}</td>
                    <td className="amount">
                      ${Number(exp.amount ?? 0).toFixed(2)}
                    </td>
                    <td>
                      <span
                        className={`badge badge-${exp.category.toLowerCase()}`}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td>{exp.frequency}</td>
                    <td>{new Date(exp.startDate).toLocaleDateString()}</td>
                    <td className="actions">
                      <button
                        className="edit"
                        onClick={() =>
                          navigate(`/UpdateRecurringExpense/${exp.id}`)
                        }
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

      {/* Styles */}
      <style>{`
            .modern-container {
              display: flex;
              justify-content: center;
              padding: 2rem;
              background: #f4f7fc;
              min-height: 100vh;
            }
              .profile {
              position: relative;
            }
            .profile-icon {
              font-size: 2.5rem;
              color: #1a237e;
              cursor: pointer;
              transition: transform 0.2s, color 0.2s;
            }
            .profile-icon:hover {
              transform: scale(1.1);
              color: #0d47a1;
            }
            .card {
              background: #fff;
              border-radius: 16px;
              box-shadow: 0 8px 20px rgba(0,0,0,0.08);
              padding: 2rem;
              width: 100%;
              max-width: 1100px;
              animation: fadeIn 0.5s ease-in-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1.5rem;
            }
            .header h2 {
              font-size: 2rem;
              font-weight: 700;
              color: #1a237e;
            }
            
            .dropdown {
              position: absolute;
              right: 0;
              top: 3rem;
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 6px 18px rgba(0,0,0,0.1);
              overflow: hidden;
              animation: slideDown 0.2s ease-in-out;
            }
            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .dropdown button {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.8rem 1.2rem;
              border: none;
              background: none;
              font-size: 1rem;
              color: #333;
              cursor: pointer;
              width: 100%;
              transition: background 0.2s;
            }
            .dropdown button:hover {
              background: #f4f7fc;
              color: #0d47a1;
            }
            .summary-card {
              background: linear-gradient(135deg, #42a5f5, #478ed1);
              color: #fff;
              border-radius: 12px;
              padding: 1.5rem;
              text-align: center;
              margin-bottom: 1.5rem;
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .summary-card h3 {
              margin: 0;
              font-size: 1.2rem;
              font-weight: 500;
            }
            .summary-card p {
              font-size: 2rem;
              font-weight: 700;
              margin-top: 0.5rem;
            }
            .table-wrapper {
              overflow-x: auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              background: #fff;
              border-radius: 12px;
              overflow: hidden;
            }
            thead {
              background: #1a237e;
              color: #fff;
            }
            th, td {
              padding: 1rem;
              text-align: center;
              font-size: 1rem;
              border-bottom: 1px solid #eee;
            }
            tbody tr:hover {
              background: #f4f7fc;
            }
            .amount {
              font-weight: 600;
              color: #333;
            }
            .badge {
              display: inline-block;
              padding: 0.3rem 0.8rem;
              border-radius: 12px;
              font-size: 0.85rem;
              font-weight: 600;
              color: #fff;
              text-transform: capitalize;
            }
            .badge-rentals { background: #42a5f5; }
            .badge-shopping { background: #ffa726; }
            .badge-bills { background: #7e57c2; }
            .badge-entertainment { background: #ec407a; }
            .badge-education { background: #26a69a; }
            .actions {
              display: flex;
              gap: 0.6rem;
              justify-content: center;
            }
            .edit, .delete {
              padding: 0.5rem 1rem;
              border: none;
              border-radius: 8px;
              font-size: 0.9rem;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            .edit {
              background: #42a5f5;
              color: #fff;
            }
            .edit:hover {
              background: #1e88e5;
            }
            .delete {
              background: #ef5350;
              color: #fff;
            }
            .delete:hover {
              background: #c62828;
            }
            .loading, .empty {
              text-align: center;
              font-size: 1.2rem;
              color: #666;
              padding: 2rem 0;
            }
          `}</style>
    </div>
  );
};

export default ViewRecurringExpense;
