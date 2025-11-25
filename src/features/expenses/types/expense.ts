export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryId: number;
}

export interface CreateExpenseDTO {
  title: string;
  amount: number;
  date: string;
  categoryId: number;
  UserId: number;
}
export interface UpdateExpenseDto {
  title: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryId: number;
  // UserId: number;
}
export interface RecurringExpenseDto {
  id: number;
  UserId: number;
  title: string;
  amount: number;
  category: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}
export interface CreateRecurringExpenseDTO {
  title: string;
  amount: number;
  category: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  UserId: number;
  Id: number;
  isActive?: boolean;
}
export interface UpdateRecurringExpenseDto {
  Id: number;
  title: string;
  amount: number;
  category: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  UserId: number;
  isActive: boolean;
}
export interface CategorySpending {
  categoryName: string;
  totalAmount: number;
}
export interface Category {
  id: number;
  name: string;
}
export interface MonthlyExpense {
  month: string;
  totalAmount: number;
}
