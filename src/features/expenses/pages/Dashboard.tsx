import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { CategorySpending } from "../types/expense";
import { GetSpendingByCategory, Logout } from "../../../api/expenseApi";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Sector,
} from "recharts";
import "./Dashboard.css";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#bc5090",
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const [showMenu, setShowMenu] = useState(false);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>(
    [],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Keep a sorted copy (descending by totalAmount) so the pie renders sorted
  const sortedData = useMemo(() => {
    return [...categorySpending].sort((a, b) => b.totalAmount - a.totalAmount);
  }, [categorySpending]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }

    GetSpendingByCategory()
      .then((data) => setCategorySpending(data))
      .catch((err) => console.error("Error fetching category spending:", err));
  }, [navigate]);

  // Close dropdown menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalSpending = categorySpending.reduce(
    (sum, item) => sum + item.totalAmount,
    0,
  );

  // ✅ Label renderer for PieChart (use Recharts label props -> payload)
  const renderLabel = (props: any) => {
    const entry = (props.payload || {}) as CategorySpending;
    const percentage = totalSpending
      ? ((entry.totalAmount / totalSpending) * 100).toFixed(1)
      : "0.0";
    return `${entry.categoryName} (${percentage}%)`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];
    return (
      <div className="dashboard-tooltip">
        <div className="tooltip-label">
          {item.name || item.payload?.categoryName}
        </div>
        <div className="tooltip-value">${Number(item.value).toFixed(2)}</div>
      </div>
    );
  };

  // Active shape renderer: expand the selected slice slightly
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
    } = props;

    const expanded = (outerRadius || 0) + 12;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={expanded}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={expanded}
          outerRadius={expanded + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.12}
        />
        <text x={cx} y={cy} dy={8} textAnchor="middle" className="active-label">
          {payload?.categoryName || payload?.name}
        </text>
        <text
          x={cx}
          y={cy}
          dy={26}
          textAnchor="middle"
          className="active-value"
        >
          ${Number(value).toFixed(2)}
        </text>
      </g>
    );
  };

  // Recharts typings don't expose activeIndex on Pie in this version; use a typed alias
  const AnyPie: any = Pie;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3 className="sidebar-logo">💸 EXPENSE</h3>

        <button onClick={() => navigate("/AddExpense")}>➕ Add Expense</button>
        <button onClick={() => navigate("/GetAllExpenses")}>
          📋 View Expenses
        </button>
        <button onClick={() => navigate("/getMonthlyExpenses")}>
          📊 Monthly Expenses
        </button>
        <button onClick={() => navigate("/AddRecurringExpense")}>
          🔁 Recurring Expense
        </button>
        <button onClick={() => navigate("/GetAllRecurringExpenses")}>
          📅 View Recurring
        </button>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Profile Menu */}
        <div className="profile-menu" ref={menuRef}>
          <FaUserCircle
            className="profile-icon"
            size={40}
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={() => navigate("/settings")}>
                <FiSettings /> Settings
              </button>
              <button
                className="logout-button"
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

        {/* Title */}
        <h2 className="dashboard-title">Expense Tracker Dashboard</h2>

        {/* Total Spending Summary */}
        <div className="total-spending">
          <h3 className="total-text">💰 Total Spending</h3>
          <p className="total-amount">${totalSpending.toFixed(2)}</p>
        </div>

        {/* Category Summary Cards */}
        {/* <div className="category-card-grid">
          {sortedData.map((cat, i) => (
            <div
              key={i}
              className="category-card"
              onClick={() => setActiveIndex(i === activeIndex ? null : i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  setActiveIndex(i === activeIndex ? null : i);
              }}
            >
              <h4>{cat.categoryName}</h4>
              <p className="category-amount">${cat.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div> */}

        {/* Pie Chart Section */}
        <div className="chart-section">
          <h3 className="chart-title">Summary Of Spendings By Category</h3>

          {sortedData.length > 0 ? (
            <ResponsiveContainer width="95%" height={400}>
              <PieChart>
                <AnyPie
                  data={sortedData as any}
                  dataKey="totalAmount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  labelLine={false}
                  label={renderLabel}
                  onClick={(data: any, index: number) =>
                    setActiveIndex(index === activeIndex ? null : index)
                  }
                  activeIndex={activeIndex === null ? -1 : activeIndex}
                  activeShape={renderActiveShape}
                >
                  {sortedData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      className={
                        activeIndex === null
                          ? "pie-slice"
                          : activeIndex === index
                            ? "pie-slice pie-slice--active"
                            : "pie-slice pie-slice--dimmed"
                      }
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </AnyPie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No data available to display the chart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
