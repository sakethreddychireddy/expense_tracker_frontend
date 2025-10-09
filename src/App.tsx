import "./App.css";
import AddExpense from "./components/AddExpense";
import ExpenseList from "./components/ExpenseList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import UpdateExpense from "./UpdateExpense";
import Home from "./Home";
import Register from "./Register";
import Login from "./Login";
import Dashboard from "./Dashboard";
import MonthlyExpenseChart from "./MonthlyExpenseChart";
import AddRecurringExpense from "./AddRecurringExpense";
import ViewRecurringExpense from "./ViewRecurrencingExpense";
import UpdateRecurringExpense from "./UpdateRecurringExpense";

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
