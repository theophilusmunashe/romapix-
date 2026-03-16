"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  isPaid: boolean;
  showLabel?: boolean;
}

export function PaymentStatusBadge({ isPaid, showLabel = true }: PaymentStatusBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isPaid
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      )}
    >
      {isPaid ? (
        <CheckCircle className="h-3.5 w-3.5" />
      ) : (
        <XCircle className="h-3.5 w-3.5" />
      )}
      {showLabel && (isPaid ? "Paid" : "Unpaid")}
    </div>
  );
}
