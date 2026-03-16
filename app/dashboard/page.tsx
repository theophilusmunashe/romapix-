"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { ClientTable } from "@/components/client-table";
import { ClientForm } from "@/components/client-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { ReportDownload } from "@/components/report-download";
import { useAuth } from "@/hooks/use-auth";
import { useClients } from "@/hooks/use-clients";
import type { Client } from "@/lib/types";
import { Plus, Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { clients, stats, isLoading: clientsLoading, addClient, updateClient, deleteClient } = useClients();
  const router = useRouter();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteClientData, setDeleteClientData] = useState<Client | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleAddClient = (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    addClient(data);
    setIsFormOpen(false);
  };

  const handleEditClient = (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    if (editingClient) {
      updateClient(editingClient.id, data);
      setEditingClient(null);
    }
  };

  const handleDeleteClient = () => {
    if (deleteClientData) {
      deleteClient(deleteClientData.id);
      setDeleteClientData(null);
    }
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
  };

  const handleOpenDelete = (client: Client) => {
    setDeleteClientData(client);
  };

  if (authLoading || clientsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">Manage your construction project clients</p>
        </div>

        <div className="space-y-8">
          <StatsCards stats={stats} />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold">Client List</h3>
            <div className="flex gap-2">
              <ReportDownload clients={clients} />
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Client
              </Button>
            </div>
          </div>

          <ClientTable
            clients={clients}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        </div>
      </main>

      <ClientForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleAddClient}
      />

      <ClientForm
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
        onSubmit={handleEditClient}
        initialData={editingClient || undefined}
        isEdit
      />

      <DeleteConfirmDialog
        open={!!deleteClientData}
        onOpenChange={(open) => !open && setDeleteClientData(null)}
        onConfirm={handleDeleteClient}
        clientName={deleteClientData?.name || ""}
      />
    </div>
  );
}
