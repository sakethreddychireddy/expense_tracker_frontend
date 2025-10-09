import { useState } from "react";
import { createExpense } from "../api/expenseApi";
import { CreateExpenseDTO } from "../types/expense";

const AddExpense = () => {
  const [formData, setFormData] = useState<CreateExpenseDTO>({
    title: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    category: "",
    UserId: Number(localStorage.getItem("UserId") || 0),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createExpense(formData);
      alert("Expense added Successfully");
      setFormData({
        title: "",
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        category: "",
        UserId: Number(localStorage.getItem("UserId") || 0),
      });
    } catch (error) {
      console.error("Error creating expense", error);
      alert("Failed to create expense");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h3>Add Expense</h3>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          placeholder="e.g. Grocery"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          placeholder="minimum $1"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <input
          id="category"
          type="text"
          name="category"
          value={formData.category}
          placeholder="e.g. Food, Transport"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Add Expense
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
    </form>
  );
};

export default AddExpense;
