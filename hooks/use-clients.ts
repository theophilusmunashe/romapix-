"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Client, Payment } from "@/lib/types";
import { calculateClientTotals, getMonthlyPaymentStatus } from "@/lib/types";
import {
  getClients,
  addClient as storageAddClient,
  updateClient as storageUpdateClient,
  deleteClient as storageDeleteClient,
  getClientById,
  addPayment as storageAddPayment,
  deletePayment as storageDeletePayment,
} from "@/lib/storage";

export function useClients() {
  const [clients, setClientsState] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshClients = useCallback(() => {
    const data = getClients();
    setClientsState(data);
  }, []);

  useEffect(() => {
    refreshClients();
    setIsLoading(false);
  }, [refreshClients]);

  const addClient = useCallback(
    (client: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
      const newClient = storageAddClient(client);
      refreshClients();
      return newClient;
    },
    [refreshClients]
  );

  const updateClient = useCallback(
    (id: string, updates: Partial<Omit<Client, "id" | "createdAt">>) => {
      const updated = storageUpdateClient(id, updates);
      refreshClients();
      return updated;
    },
    [refreshClients]
  );

  const deleteClient = useCallback(
    (id: string) => {
      const success = storageDeleteClient(id);
      refreshClients();
      return success;
    },
    [refreshClients]
  );

  const getClient = useCallback((id: string) => {
    return getClientById(id);
  }, []);

  const addPayment = useCallback(
    (clientId: string, payment: Omit<Payment, "id">) => {
      const updated = storageAddPayment(clientId, payment);
      refreshClients();
      return updated;
    },
    [refreshClients]
  );

  const deletePayment = useCallback(
    (clientId: string, paymentId: string) => {
      const updated = storageDeletePayment(clientId, paymentId);
      refreshClients();
      return updated;
    },
    [refreshClients]
  );

  // Calculate statistics based on payments
  const stats = useMemo(() => {
    let totalPaid = 0;
    let totalOwing = 0;
    let paidClientsCount = 0;
    let unpaidClientsCount = 0;
    const currentMonth = new Date().toISOString().slice(0, 7);

    clients.forEach((client) => {
      const { totalPaid: clientPaid, amountOwing } = calculateClientTotals(client);
      const currentMonthStatus = getMonthlyPaymentStatus(client, currentMonth);
      const isCurrentMonthPaid = currentMonthStatus.isPaid;
      
      totalPaid += clientPaid;
      totalOwing += amountOwing;
      if (isCurrentMonthPaid) {
        paidClientsCount++;
      } else {
        unpaidClientsCount++;
      }
    });

    return {
      total: clients.length,
      paid: paidClientsCount,
      unpaid: unpaidClientsCount,
      totalPaid,
      totalOwing,
    };
  }, [clients]);

  return {
    clients,
    isLoading,
    stats,
    addClient,
    updateClient,
    deleteClient,
    getClient,
    addPayment,
    deletePayment,
    refreshClients,
  };
}
