import axios from "axios";
import {
  CreateExpenseDTO,
  RecurringExpenseDto,
  UpdateExpenseDto,
} from "../types/expense";

const API_BASE_URL = (process.env?.API_BASE_URL || "http://localhost:5048/api/") + "ExpenseTracker";
const API_URL = (process.env?.API_BASE_URL || "http://localhost:5048/api/") + "RecurringExpense";

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Handle responses and throw error if not successful
const handleResponse = (
  response: any,
  successStatus: number[] = [200, 201, 204]
) => {
  if (!successStatus.includes(response.status)) {
    throw new Error(response.data?.message || "Request failed");
  }
  return response.data;
};

// ---------------- Expense APIs ----------------

export const getAllExpenses = async () => {
  const response = await axios.get(`${API_BASE_URL}/GetAllExpenses`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createExpense = async (expense: CreateExpenseDTO) => {
  const response = await axios.post(`${API_BASE_URL}/CreateExpense`, expense, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response, [200, 201]);
};

export const getExpenseById = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/GetExpense/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const updateExpense = async (id: number, expense: UpdateExpenseDto) => {
  const response = await axios.put(
    `${API_BASE_URL}/UpdateExpense/${id}`,
    expense,
    { headers: getAuthHeaders() }
  );
  return handleResponse(response);
};

export const deleteExpense = async (id: number) => {
  const response = await axios.delete(`${API_BASE_URL}/DeleteExpense/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response, [200, 204]);
};

export const getTotalExpenses = async () => {
  const response = await axios.get(`${API_BASE_URL}/GetTotalExpenses`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
export const getMonthlyExpenses = async () => {
  const response = await axios.get(`${API_BASE_URL}/GetMonthlyExpenses`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
export const getRecurringExpenses = async () => {
  const response = await axios.get(`${API_URL}/GetUserRecurringExpenses`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
export const AddRecurringExpense = async (expense: RecurringExpenseDto) => {
  const response = await axios.post(`${API_URL}/AddRecurringExpense`, expense, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response, [200, 201]);
};
export const updateRecurringExpense = async (
  id: number,
  expense: RecurringExpenseDto
) => {
  const response = await axios.put(
    `${API_URL}/UpdateRecurringExpense/${id}`,
    expense,
    {
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(response);
};
export const getRecurringExpenseById = async (id: number) => {
  const response = await axios.get(`${API_URL}/GetRecurringExpenseById/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
export const deleteRecurringExpense = async (id: number) => {
  const response = await axios.delete(
    `${API_URL}/DeleteRecurringExpense/${id}`,
    {
      headers: getAuthHeaders(),
    }
  );
  return handleResponse(response, [200, 204]);
};

// ---------------- Auth APIs ----------------

export const Register = async (userData: {
  email: string;
  password: string;
  role?: string; // optional, add if backend requires
}) => {
  const response = await axios.post(`${API_BASE_URL}/Register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(response, [200, 201]);
};
console.log("Auth headers:", getAuthHeaders());
export const Login = async (credentials: {
  email: string;
  password: string;
}) => {
  console.log("Stored token:", localStorage.getItem("authToken"));

  const response = await axios.post(`${API_BASE_URL}/Login`, credentials, {
    headers: { "Content-Type": "application/json" },
  });

  console.log("Login response:", response.data);

  // Make sure this matches the property your backend returns
  const token = response.data?.token; // change to jwtToken/accessToken if needed
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    console.error("No token found in login response:", response.data);
  }

  return handleResponse(response, [200, 201]);
};
