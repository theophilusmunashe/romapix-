"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader } from "@/components/dashboard-header";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import { ClientForm } from "@/components/client-form";
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useClients } from "@/hooks/use-clients";
import type { Client } from "@/lib/types";
import { calculateClientTotals, TOTAL_SUBSCRIPTION_AMOUNT } from "@/lib/types";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Pencil,
  Trash2,
  Loader2,
  User,
  MapPin,
  Plus,
  Receipt,
} from "lucide-react";

export default function ClientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getClient, updateClient, deleteClient, addPayment, deletePayment, refreshClients } = useClients();

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
      return;
    }

    if (params.id) {
      const clientData = getClient(params.id as string);
      setClient(clientData);
      setIsLoading(false);
    }
  }, [authLoading, isAuthenticated, params.id, getClient, router]);

  const handleUpdate = (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    if (client) {
      updateClient(client.id, data);
      setClient({ ...client, ...data, updatedAt: new Date().toISOString() });
      setIsEditOpen(false);
    }
  };

  const handleDelete = () => {
    if (client) {
      deleteClient(client.id);
      router.push("/dashboard");
    }
  };

  const handleAddPayment = () => {
    if (client && paymentForm.description && paymentForm.amount > 0) {
      const updated = addPayment(client.id, {
        description: paymentForm.description,
        amount: paymentForm.amount,
        date: paymentForm.date,
      });
      if (updated) {
        setClient(updated);
        setPaymentForm({
          description: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
        });
        setIsPaymentOpen(false);
      }
    }
  };

  const handleDeletePayment = (paymentId: string) => {
    if (client) {
      const updated = deletePayment(client.id, paymentId);
      if (updated) {
        setClient(updated);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Client Not Found</h2>
            <p className="mt-2 text-muted-foreground">
              The client you are looking for does not exist.
            </p>
            <Button asChild className="mt-4">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { totalPaid, amountOwing, isPaid } = calculateClientTotals(client);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{client.name}</h1>
              <p className="text-muted-foreground">Stand No. {client.standNumber}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </CardTitle>
                <CardDescription>Contact and stand details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Stand Number</p>
                    <p className="text-sm text-muted-foreground font-mono">{client.standNumber}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <a
                      href={`tel:${client.phone}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {client.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${client.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {client.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Registration Date</p>
                    <p className="text-sm text-muted-foreground">{formatDate(client.subscriptionDate)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Payment History
                  </CardTitle>
                  <CardDescription>All payments made by this client</CardDescription>
                </div>
                <Button onClick={() => setIsPaymentOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Payment
                </Button>
              </CardHeader>
              <CardContent>
                {client.payments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No payments recorded yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {client.payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.description}</TableCell>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeletePayment(payment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Subscription</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(client.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount Paid</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(totalPaid)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium">Amount Owing</span>
                  <span className={`text-xl font-bold ${amountOwing > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(amountOwing)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <PaymentStatusBadge isPaid={isPaid} />
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Payment Progress</span>
                    <span>{Math.round((totalPaid / client.totalAmount) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${Math.min((totalPaid / client.totalAmount) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Record Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(client.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(client.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ClientForm
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSubmit={handleUpdate}
        initialData={client}
        isEdit
      />

      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        clientName={client.name}
      />

      {/* Add Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>
              Record a new payment for {client.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentDescription">Description</Label>
              <Input
                id="paymentDescription"
                value={paymentForm.description}
                onChange={(e) => setPaymentForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., 1st Contribution - Fence"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Amount (USD)</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  min="0"
                  step="1"
                  value={paymentForm.amount || ""}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentDate">Date</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddPayment}
              disabled={!paymentForm.description || paymentForm.amount <= 0}
            >
              Add Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
