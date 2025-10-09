import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRecurringExpenseById,
  updateRecurringExpense,
} from "./api/expenseApi";
import { RecurringExpenseDto } from "./types/expense";

const UpdateRecurringExpense = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [expense, setExpense] = useState<RecurringExpenseDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      if (id) {
        const data = await getRecurringExpenseById(Number(id));
        setExpense(data);
      }
      setLoading(false);
    };
    fetchExpense();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setExpense((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              name === "amount"
                ? Number(value)
                : name === "date"
                ? new Date(value).toISOString()
                : value,
          }
        : prev
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expense) return;
    try {
      await updateRecurringExpense(expense.id!, expense);
      navigate("/GetAllRecurringExpenses");
    } catch (error) {
      alert("Failed to update expense ❌");
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '40px',
        gap: '15px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <p style={{
          color: '#666',
          fontSize: '16px',
          fontWeight: 500
        }}>
          Loading expense...
        </p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Expense not found.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: "20px auto", textAlign: "center" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          width: 400,
          margin: "30px auto",
          padding: 25,
          border: "1px solid #ddd",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          backgroundColor: "#fafafa",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 10, color: "#333" }}>
          Edit Recurring Expense
        </h2>

        <input
          type="text"
          name="title"
          value={expense.title}
          onChange={handleChange}
          placeholder="Enter Title"
          required
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        />

        <input
          type="number"
          name="amount"
          value={expense.amount}
          onChange={handleChange}
          placeholder="Enter Amount ($)"
          required
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        />

        <input
          type="text"
          name="category"
          value={expense.category}
          onChange={handleChange}
          placeholder="Enter Category"
          required
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        />

        <div className="form-group">
          <label htmlFor="frequency">Frequency</label>
          <select
            id="frequency"
            name="frequency"
            value={expense.frequency}
            onChange={handleChange}
            required
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>

        <input
          type="date"
          name="date"
          placeholder="Start Date"
          value={expense.startDate.split("T")[0]}
          onChange={handleChange}
          required
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        />

        <input
          type="date"
          name="date"
          value={expense.endDate?.split("T")[0] || ""}
          onChange={handleChange}
          placeholder="End Date (optional)"
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        />

        <button
          type="submit"
          style={{
            padding: 12,
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#218838")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#28a745")
          }
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={() => navigate("/GetAllRecurringExpenses")}
          style={{
            padding: 12,
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 16,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s ease",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#0069d9")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor = "#007bff")
          }
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default UpdateRecurringExpense;
