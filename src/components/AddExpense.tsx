import { useState, useEffect } from "react";
import { createExpense } from "../api/expenseApi";
import { GetCategories } from "../api/expenseApi";
import { CreateExpenseDTO } from "../types/expense";

const AddExpense = () => {
  const [formData, setFormData] = useState<CreateExpenseDTO>({
    title: "",
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    UserId: Number(localStorage.getItem("UserId") || 0),
    categoryId: 0,
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ✅ Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await GetCategories();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      alert("✅ Expense added successfully!");
      setFormData({
        title: "",
        amount: Number(formData.amount),
        date: new Date().toISOString().slice(0, 10),
        categoryId: Number(formData.categoryId),
        UserId: Number(localStorage.getItem("UserId") || 0),
      });
    } catch (error) {
      console.error("Error creating expense", error);
      alert("❌ Failed to create expense");
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
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          // <select
          //   id="category"
          //   name="categoryId"
          //   value={formData.categoryId}
          //   onChange={handleChange}
          //   required
          // >
          //   <option value="">-- Select Category --</option>
          //   {categories.map((category) => (
          //     <option key={category.id} value={category.id}>
          //       {category.name}
          //     </option>
          //   ))}
          // </select>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            style={{
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ccc",
              outline: "none",
              fontSize: 14,
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <button type="submit" className="submit-button">
        Add Expense
      </button>

      <button
        type="button"
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
