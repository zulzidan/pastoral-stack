"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Lead } from "@/lib/db/schema"

export const columns: ColumnDef<Lead>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium text-white">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Email</span>
    ),
    cell: ({ row }) => (
      <a
        href={`mailto:${row.getValue("email")}`}
        className="text-[#c8845a] hover:underline underline-offset-2"
      >
        {row.getValue("email")}
      </a>
    ),
  },
  {
    accessorKey: "organisation",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Organisation</span>
    ),
    cell: ({ row }) => (
      <span className="text-white/60">{row.getValue("organisation") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "state",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-widest text-white/40">State</span>
    ),
    cell: ({ row }) => (
      <span className="text-white/60">{row.getValue("state") ?? "—"}</span>
    ),
  },
  {
    accessorKey: "message",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Message</span>
    ),
    cell: ({ row }) => {
      const msg: string | null = row.getValue("message")
      return (
        <span className="text-white/55 max-w-xs block truncate" title={msg ?? ""}>
          {msg ?? "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Submitted
        <ArrowUpDown className="ml-1.5 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const d = row.getValue<Date | string>("createdAt")
      return (
        <span className="text-white/40 text-xs whitespace-nowrap">
          {new Date(d).toLocaleString("en-AU", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )
    },
    sortingFn: "datetime",
  },
]
