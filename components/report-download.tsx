"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Client } from "@/lib/types";
import { calculateClientTotals } from "@/lib/types";
import { Download, FileSpreadsheet, Filter } from "lucide-react";

interface ReportDownloadProps {
  clients: Client[];
}

export function ReportDownload({ clients }: ReportDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCSV = (data: Client[], filename: string) => {
    setIsGenerating(true);

    // CSV Headers
    const headers = [
      "Client Name",
      "Stand Number",
      "Phone",
      "Email",
      "Total Subscription (USD)",
      "Amount Paid (USD)",
      "Amount Owing (USD)",
      "Payment Status",
      "Number of Payments",
    ];

    // CSV Rows
    const rows = data.map((client) => {
      const { totalPaid, amountOwing, isPaid } = calculateClientTotals(client);
      return [
        client.name,
        client.standNumber,
        client.phone,
        client.email,
        client.totalAmount.toString(),
        totalPaid.toString(),
        amountOwing.toString(),
        isPaid ? "Fully Paid" : "Outstanding",
        client.payments.length.toString(),
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setIsGenerating(false), 500);
  };

  const paidClients = clients.filter((c) => calculateClientTotals(c).isPaid);
  const unpaidClients = clients.filter((c) => !calculateClientTotals(c).isPaid);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isGenerating}>
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? "Generating..." : "Download Report"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => generateCSV(clients, "romapix_all_clients")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          All Clients ({clients.length})
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => generateCSV(paidClients, "romapix_paid_clients")}
          disabled={paidClients.length === 0}
        >
          <Filter className="mr-2 h-4 w-4 text-green-500" />
          Fully Paid Only ({paidClients.length})
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => generateCSV(unpaidClients, "romapix_unpaid_clients")}
          disabled={unpaidClients.length === 0}
        >
          <Filter className="mr-2 h-4 w-4 text-red-500" />
          Outstanding Only ({unpaidClients.length})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
