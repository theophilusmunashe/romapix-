export interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
  month?: string; // Format: "YYYY-MM" for monthly tracking
}

export interface Client {
  id: string;
  name: string;
  standNumber: string;
  phone: string;
  email: string;
  subscriptionDate: string;
  totalAmount: number; // Total owed (always $9280 initially)
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: "Anesu" | "Rumbidzai" | null;
}

export type AdminUser = "Anesu" | "Rumbidzai";

export const ADMIN_CREDENTIALS: Record<AdminUser, string> = {
  Anesu: "anesu123",
  Rumbidzai: "rumbi123",
};

export const TOTAL_SUBSCRIPTION_AMOUNT = 9280;

// Helper to calculate totals
export function calculateClientTotals(client: Client) {
  const totalPaid = client.payments.reduce((sum, p) => sum + p.amount, 0);
  const amountOwing = client.totalAmount - totalPaid;
  const isPaid = amountOwing <= 0;
  return { totalPaid, amountOwing: Math.max(0, amountOwing), isPaid };
}

// Helper to get monthly payment status
export function getMonthlyPaymentStatus(client: Client, targetMonth: string) {
  const monthlyPayment = client.payments.find(p => p.month === targetMonth);
  return {
    isPaid: !!monthlyPayment,
    amount: monthlyPayment?.amount || 0,
    payment: monthlyPayment || null
  };
}

// Helper to get all months with payment status
export function getMonthlyPaymentHistory(client: Client) {
  // Start from December 2025 as requested
  const startDate = new Date("2025-12-01");
  const currentDate = new Date();
  const months = [];
  
  let current = new Date(startDate);
  while (current <= currentDate) {
    const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`;
    const status = getMonthlyPaymentStatus(client, monthKey);
    months.push({
      month: monthKey,
      monthName: current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      ...status
    });
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
}

// Helper to check if client is up to date (paid all months from Dec 2025 to current)
export function isClientUpToDate(client: Client) {
  const monthlyHistory = getMonthlyPaymentHistory(client);
  return monthlyHistory.length > 0 && monthlyHistory.every(month => month.isPaid);
}
