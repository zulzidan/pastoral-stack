"use client"

import { useState } from "react"
import type { Lead } from "@/lib/db/schema"
import { DataTable } from "./data-table"
import { columns } from "./columns"

type ApiResponse = { page: number; limit: number; count: number; leads: Lead[] }

export default function AdminLeadsPage() {
  const [secret, setSecret] = useState("")
  const [input, setInput] = useState("")
  const [leads, setLeads] = useState<Lead[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [authed, setAuthed] = useState(false)

  async function fetchLeads(s: string) {
    setLoading(true)
    setError("")
    try {
      let page = 1
      let all: Lead[] = []
      while (true) {
        const res = await fetch(
          `/api/admin/leads?secret=${encodeURIComponent(s)}&page=${page}&limit=100`
        )
        if (res.status === 401) {
          setError("Unauthorised — wrong secret.")
          return
        }
        const json: ApiResponse = await res.json()
        all = all.concat(json.leads)
        if (json.count < json.limit) break
        page++
      }
      setLeads(all)
      setSecret(s)
      setAuthed(true)
    } catch {
      setError("Request failed. Is the server running?")
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    fetchLeads(input)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="h-px w-8 bg-[#7a4c2e] mb-4" />
          <h1 className="text-2xl font-semibold tracking-tight text-white">Leads — Admin</h1>
          <p className="text-white/40 text-sm mt-1">PastoralStack lead submissions</p>
        </div>
        {authed && (
          <button
            onClick={() => { setAuthed(false); setSecret(""); setLeads([]); setInput("") }}
            className="text-xs text-white/25 hover:text-white/50 transition-colors"
          >
            Sign out
          </button>
        )}
      </div>

      {!authed && (
        <div className="max-w-sm">
          <form onSubmit={handleSubmit} className="flex gap-3 mb-3">
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter admin secret"
              className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#7a4c2e] focus:ring-1 focus:ring-[#7a4c2e]/40"
              autoFocus
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#7a4c2e] rounded text-sm font-semibold text-white hover:bg-[#8f5c38] transition-colors disabled:opacity-50"
            >
              {loading ? "…" : "View"}
            </button>
          </form>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      )}

      {authed && (
        <DataTable columns={columns} data={leads} />
      )}
    </div>
  )
}
