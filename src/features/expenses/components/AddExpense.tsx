import { useState, useEffect } from "react";
import { createExpense, GetCategories } from "../../../api/expenseApi";
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await GetCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Validate the form before submitting
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

    if (!formData.date) {
      errors.date = "Date is required.";
    } else if (new Date(formData.date) > new Date()) {
      errors.date = "Date cannot be in the future.";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Please select a category.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

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

    if (!validateForm()) return; // stop submission if validation fails

    try {
      await createExpense(formData);
      alert("✅ Expense added successfully!");
      setFormData({
        title: "",
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        categoryId: 0,
        UserId: Number(localStorage.getItem("UserId") || 0),
      });
      setValidationErrors({});
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
          type="number"
          name="amount"
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
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        {validationErrors.date && (
          <p style={{ color: "red", fontSize: "13px" }}>
            {validationErrors.date}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
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
            {validationErrors.categoryId && (
              <p style={{ color: "red", fontSize: "13px" }}>
                {validationErrors.categoryId}
              </p>
            )}
          </>
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
