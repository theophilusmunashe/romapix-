"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PaymentStatusBadge } from "@/components/payment-status-badge";
import type { Client } from "@/lib/types";
import { calculateClientTotals } from "@/lib/types";
import { Eye, Pencil, Trash2, MoreHorizontal, Search, Filter } from "lucide-react";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "unpaid">("all");

  const filteredClients = clients.filter((client) => {
    const { isPaid } = calculateClientTotals(client);
    const matchesSearch =
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.standNumber.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && isPaid) ||
      (statusFilter === "unpaid" && !isPaid);

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, stand number, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-1">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "paid" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("paid")}
              className={statusFilter === "paid" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              Paid
            </Button>
            <Button
              variant={statusFilter === "unpaid" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("unpaid")}
              className={statusFilter === "unpaid" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              Owing
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Stand No.</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Owing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => {
                const { totalPaid, amountOwing, isPaid } = calculateClientTotals(client);
                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{client.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{client.standNumber}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                    <TableCell className="text-right">
                      <span className="text-green-600 font-medium">
                        {formatCurrency(totalPaid)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={amountOwing > 0 ? "text-red-600 font-medium" : "text-muted-foreground"}>
                        {formatCurrency(amountOwing)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge isPaid={isPaid} />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/client/${client.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(client)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(client)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredClients.length} of {clients.length} clients
      </div>
    </div>
  );
}
