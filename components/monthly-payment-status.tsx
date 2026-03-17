"use client";

import { CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthlyPaymentStatusProps {
  isPaid: boolean;
  isCurrentMonth?: boolean;
  showLabel?: boolean;
  amount?: number;
}

export function MonthlyPaymentStatus({ 
  isPaid, 
  isCurrentMonth = false, 
  showLabel = true,
  amount 
}: MonthlyPaymentStatusProps) {
  const getStatusConfig = () => {
    if (isPaid) {
      return {
        bgColor: "bg-green-100",
        textColor: "text-green-700",
        icon: CheckCircle,
        label: "Paid"
      };
    } else if (isCurrentMonth) {
      return {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
        icon: Clock,
        label: "Due"
      };
    } else {
      return {
        bgColor: "bg-red-100",
        textColor: "text-red-700",
        icon: XCircle,
        label: "Unpaid"
      };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.bgColor,
        config.textColor
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {showLabel && (
        <span>
          {config.label}
          {amount && isPaid && ` ($${amount})`}
        </span>
      )}
    </div>
  );
}
