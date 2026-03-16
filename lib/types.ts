export interface Payment {
  id: string;
  description: string;
  amount: number;
  date: string;
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
