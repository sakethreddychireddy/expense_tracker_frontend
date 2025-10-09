export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: string;
}

export interface CreateExpenseDTO {
  title: string;
  amount: number;
  date: string;
  category: string;
  UserId: number;
}
export interface UpdateExpenseDto {
  title: string;
  amount: number;
  date: string;
  category: string;
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
