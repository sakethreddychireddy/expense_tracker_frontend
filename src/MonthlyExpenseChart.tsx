import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getMonthlyExpenses } from "./api/expenseApi";

interface MonthlyExpense {
  month: string;
  totalAmount: number;
}
const MonthlyExpenseChart: React.FC = () => {
  const [monthlyExpenses, setMonthlyExpenses] = useState<MonthlyExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMonthlyExpenses = async () => {
    try {
      const data = await getMonthlyExpenses();
      setMonthlyExpenses(data);
    } catch (error) {
      console.error("Error fetching monthly expenses", error);
      setMonthlyExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyExpenses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (monthlyExpenses.length === 0) return <p>No expenses recorded yet.</p>;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50">
      <button
        type="button"
        onClick={() => navigate("/dashboard")}
        className="expense-list-back-btn"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 10,
          backgroundColor: "#6366f1",
          color: "white",
          border: "none",
          padding: "10px 15px",
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

      {/* Chart Container */}
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Monthly Expenses
        </h2>

        <ResponsiveContainer
          width="75%"
          height={350}
          style={{ margin: "0 auto" }}
        >
          <BarChart data={monthlyExpenses}>
            <defs>
              {/* Gradient for modern look */}
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fill: "#374151" }} />
            <YAxis tick={{ fill: "#374151" }} />
            <Tooltip
              contentStyle={{ backgroundColor: "#fff", borderRadius: "8px" }}
              formatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(value)
              }
            />
            <Legend />

            <Bar
              dataKey="totalAmount"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]}
              barSize={50}
              animationDuration={1500} // Smooth animation
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyExpenseChart;
