"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Client } from "@/lib/types";
import { TOTAL_SUBSCRIPTION_AMOUNT } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => void;
  initialData?: Client;
  isEdit?: boolean;
}

export function ClientForm({ open, onOpenChange, onSubmit, initialData, isEdit }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    standNumber: "",
    phone: "",
    email: "",
    subscriptionDate: "",
    totalAmount: TOTAL_SUBSCRIPTION_AMOUNT,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        standNumber: initialData.standNumber,
        phone: initialData.phone,
        email: initialData.email,
        subscriptionDate: initialData.subscriptionDate,
        totalAmount: initialData.totalAmount,
      });
    } else {
      setFormData({
        name: "",
        standNumber: "",
        phone: "",
        email: "",
        subscriptionDate: new Date().toISOString().split("T")[0],
        totalAmount: TOTAL_SUBSCRIPTION_AMOUNT,
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 300));

    onSubmit({
      ...formData,
      payments: initialData?.payments || [],
    });
    setIsSubmitting(false);
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Client" : "Add New Client"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the client information below."
              : "Fill in the details to add a new client. Total subscription amount is $9,280."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="standNumber">Stand Number</Label>
              <Input
                id="standNumber"
                value={formData.standNumber}
                onChange={(e) => handleChange("standNumber", e.target.value)}
                placeholder="11378"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="0774915087"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="client@example.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subscriptionDate">Registration Date</Label>
              <Input
                id="subscriptionDate"
                type="date"
                value={formData.subscriptionDate}
                onChange={(e) => handleChange("subscriptionDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Subscription (USD)</Label>
              <Input
                id="totalAmount"
                type="number"
                min="0"
                step="1"
                value={formData.totalAmount}
                onChange={(e) => handleChange("totalAmount", Number(e.target.value))}
                placeholder="9280"
                required
              />
            </div>
          </div>

          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              Note: All clients have a standard subscription amount of $9,280. Payments can be recorded after creating the client record.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Client"
              ) : (
                "Add Client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
