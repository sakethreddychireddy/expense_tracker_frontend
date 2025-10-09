import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExpenseById, updateExpense } from "./api/expenseApi";
import { Expense } from "./types/expense";

const UpdateExpense: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpense = async () => {
      if (id) {
        const data = await getExpenseById(Number(id));
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
      await updateExpense(expense.id!, expense);
      navigate("/GetAllExpenses");
    } catch (error) {
      alert("Failed to update expense ❌");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        Loading expense...
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
          Edit Expense
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

        <input
          type="date"
          name="date"
          value={expense.date.split("T")[0]}
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
          onClick={() => navigate("/GetAllExpenses")}
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

export default UpdateExpense;
