import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddRecurringExpense as apiAddRecurring } from "../../../api/expenseApi";
import { CreateRecurringExpenseDTO } from "../types/expense";

const AddRecurringExpense: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setForm] = useState<CreateRecurringExpenseDTO>({
    title: "",
    amount: 0,
    category: "",
    frequency: "",
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // basic validation
    if (
      !formData.title ||
      !formData.amount ||
      !formData.category ||
      !formData.frequency
    ) {
      alert("Please fill all required fields");
      return;
    }
    const validateForm = () => {
      const errors: Record<string, string> = {};
      if (!formData.title.trim()) {
        errors.title = "Title is required.";
      } else if (!/^[a-zA-Z][a-zA-Z\s0-9]*$/.test(formData.title.trim())) {
        errors.title =
          "Title must start with an alphabet, contain only alphabets and spaces, and have no leading spaces.";
      } else if (formData.title.trim().length < 3) {
        errors.title = "Title must be at least 3 characters.";
      }
      if (formData.amount <= 0) {
        errors.amount = "Amount must be greater than 0.";
      }
      if (!formData.category.trim()) {
        errors.category = "Category is required.";
      }
      if (!formData.frequency.trim()) {
        errors.frequency = "Frequency is required.";
      }
      if (!formData.startDate) {
        errors.startDate = "Start Date is required.";
      }
      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };
    if (!validateForm()) return;

    try {
      await apiAddRecurring(formData as any);
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
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Subscription"
          required
        />
        {validationErrors.title && (
          <p style={{ color: "red", fontSize: "13px" }}>
            {validationErrors.title}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={formData.amount || ""}
          placeholder="minimum $1"
          onChange={handleChange}
          required
        />
        {validationErrors.amount && (
          <p style={{ color: "red", fontSize: "13px" }}>
            {validationErrors.amount}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category || ""}
          onChange={handleChange}
          required
          className="category-select"
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        >
          <option value="">Select Category</option>
          <option value="Utilities">Utilities</option>
          <option value="Subscriptions">Subscriptions</option>
          <option value="Rent">Rent</option>
          <option value="Salaries">Salaries</option>
          <option value="Insurance">Insurance</option>
          <option value="Loans">Loans</option>
          <option value="Other">Other</option>
        </select>
        {validationErrors.category && (
          <p style={{ color: "red", fontSize: "13px" }}>
            {validationErrors.category}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="frequency">Frequency</label>
        <select
          id="frequency"
          name="frequency"
          value={formData.frequency || ""}
          onChange={handleChange}
          required
          className="frequency-select"
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            outline: "none",
            fontSize: 14,
          }}
        >
          <option value="">Select Recurring Type</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
        </select>
        {validationErrors.frequency && (
          <p style={{ color: "red", fontSize: "13px" }}>
            {validationErrors.frequency}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        {validationErrors.startDate && (
          <p style={{ color: "red", fontSize: "13px" }}>
            {validationErrors.startDate}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="endDate">End Date (optional)</label>
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={formData.endDate || ""}
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
