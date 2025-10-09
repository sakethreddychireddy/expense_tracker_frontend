import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddRecurringExpense as apiAddRecurring } from "./api/expenseApi";
import { CreateRecurringExpenseDTO } from "./types/expense";

const AddRecurringExpense: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateRecurringExpenseDTO>({
    title: "",
    amount: 0,
    category: "",
    frequency: "Monthly",
    startDate: new Date().toISOString().slice(0, 10),
    endDate: undefined,
    UserId: Number(localStorage.getItem("UserId") || 0),
    Id: 0,
    isActive: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (!form.title || !form.amount || !form.category || !form.frequency) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await apiAddRecurring(form as any);
      alert("Recurring expense added successfully");
      navigate("/GetAllRecurringExpenses");
    } catch (err) {
      console.error(err);
      alert("Failed to add recurring expense");
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>Add Recurring Expense</h3>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Subscription"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Utilities"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="frequency">Frequency</label>
        <select
          id="frequency"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          required
        >
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">End Date (optional)</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={form.endDate || ""}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-button">
          Add Recurring Expense
        </button>
        <button
          type="submit"
          className="submit-button"
          style={{
            marginLeft: "1px",
            backgroundColor: "#6366f1",
            marginTop: "10px",
          }}
          onClick={() => window.history.back()}
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default AddRecurringExpense;
