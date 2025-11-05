import axios from "axios";
import {
  CreateExpenseDTO,
  RecurringExpenseDto,
  UpdateExpenseDto,
} from "../features/expenses/types/expense";

const API_BASE_URL =
  (process.env?.API_BASE_URL || "http://localhost:5048/api/") +
  "ExpenseTracker";
const API_URL =
  (process.env?.API_BASE_URL || "http://localhost:5048/api/") +
  "RecurringExpense";
const API_BASE =
  (process.env?.API_BASE_URL || "http://localhost:5048/api/") + "Category";
const API_AUTH =
  (process.env?.API_BASE_URL || "http://localhost:5048/api/") + "Auth";

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
export const GetSpendingByCategory = async () => {
  const response = await axios.get(`${API_BASE_URL}/GetSpendingByCategory`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};
export const GetCategories = async () => {
  const response = await axios.get(`${API_BASE}/GetCategories`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// ---------------- Auth APIs ----------------

export const Register = async (userData: {
  email: string;
  password: string;
  role?: string; // optional, add if backend requires
}) => {
  const response = await axios.post(`${API_AUTH}/Register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(response, [200, 201]);
};
console.log("Auth headers:", getAuthHeaders());

export const Login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    console.log("Attempting login for:", credentials.email);

    const response = await axios.post(`${API_AUTH}/Login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    //console.log("Login response:", response.data);

    // Backend should return { token, refreshToken, userId }
    const token = response.data?.token || response.data?.Token;
    const refreshToken =
      response.data?.refreshToken || response.data?.RefreshToken;
    const userId = response.data?.userId || response.data?.UserId;

    if (token && refreshToken && userId) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", userId.toString());
      console.log("✅ Login successful — tokens stored in localStorage");
    } else {
      console.error("❌ Missing token(s) in login response:", response.data);
    }

    return handleResponse(response, [200, 201]);
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const Logout = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userId = localStorage.getItem("userId");
    if (!token || !refreshToken || !userId) {
      console.warn("No access token found — user may already be logged out.");
      // Clear any leftover storage just in case
      localStorage.clear();
      return;
    }

    // If backend requires a refresh token, you can send empty string for now
    //const payload = { refreshToken: "" };

    const response = await axios.post(
      `${API_AUTH}/Logout`,
      { userId: parseInt(userId), refreshToken },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Logout successful:", response.data);

    // Clear local storage after logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken"); // optional if exists
    localStorage.removeItem("userId"); // optional if exists

    return handleResponse(response, [200, 204]);
  } catch (error) {
    console.error("Logout failed:", error);
    // Still clear local storage to prevent stuck session
    localStorage.clear();
    throw error;
  }
};
