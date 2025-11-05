import "./App.css";
import AddExpense from "./features/expenses/components/AddExpense";
import ExpenseList from "./features/expenses/components/ExpenseList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UpdateExpense from "./features/expenses/components/UpdateExpense";
import Home from "./features/expenses/pages/Home";
import Register from "./features/auth/Components/Register";
import Login from "./features/auth/Components/Login";
import Dashboard from "./features/expenses/pages/Dashboard";
import MonthlyExpenseChart from "./MonthlyExpenseChart";
import AddRecurringExpense from "./features/expenses/components/AddRecurringExpense";
import ViewRecurringExpense from "./features/expenses/components/ViewRecurrencingExpense";
import UpdateRecurringExpense from "./features/expenses/components/UpdateRecurringExpense";

function App() {
  return (
    <Router>
      <Layout>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/AddExpense" element={<AddExpense />} />
            <Route path="/GetAllExpenses" element={<ExpenseList />} />
            <Route path="/UpdateExpense/:id" element={<UpdateExpense />} />
            <Route
              path="/deleteExpense"
              element={<div>Delete Expense Component</div>}
            />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/GetMonthlyExpenses"
              element={<MonthlyExpenseChart />}
            />
            <Route
              path="/AddRecurringExpense"
              element={<AddRecurringExpense />}
            />
            <Route
              path="/GetAllRecurringExpenses"
              element={<ViewRecurringExpense />}
            />
            <Route
              path="/UpdateRecurringExpense/:id"
              element={<UpdateRecurringExpense />}
            />
            <Route
              path="/DeleteRecurringExpense"
              element={<div>Delete Recurring Expense Component</div>}
            />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
