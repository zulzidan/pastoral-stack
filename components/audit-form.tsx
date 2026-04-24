"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckIcon } from "lucide-react"

interface AuditFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Status = "idle" | "loading" | "success" | "error"

export function AuditForm({ open, onOpenChange }: AuditFormProps) {
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      organisation: (form.elements.namedItem("organisation") as HTMLInputElement).value,
      state: (form.elements.namedItem("state") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error((json as { error?: string }).error ?? "Submission failed")
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
    }
  }

  function handleClose(open: boolean) {
    onOpenChange(open)
    if (!open) {
      // Reset after dialog exit animation
      setTimeout(() => {
        setStatus("idle")
        setErrorMsg("")
      }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-[#1d3428] border border-white/12 text-white [&>button]:text-white/50 [&>button:hover]:text-white">
        <DialogHeader>
          <div className="mb-1 h-px w-8 bg-[#7a4c2e]" />
          <DialogTitle className="font-[family-name:var(--font-dm-serif)] italic text-2xl text-white">
            Get a Free System Audit
          </DialogTitle>
          <p className="text-sm text-white/50 leading-relaxed mt-1">
            Tell us about your operation and we&apos;ll come back with a clear picture of where you stand.
          </p>
        </DialogHeader>

        {status === "success" ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2e6a4a]">
              <CheckIcon size={22} className="text-white" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs">
              Thanks — we&apos;ll be in touch shortly to arrange your free review.
            </p>
            <Button
              variant="outline"
              className="mt-2 border-white/20 text-white/70 hover:text-white hover:bg-white/8"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-white/70 text-xs uppercase tracking-wide">
                  Name <span className="text-[#7a4c2e]">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Jane Smith"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#7a4c2e]/50 focus-visible:border-[#7a4c2e]/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-white/70 text-xs uppercase tracking-wide">
                  Email <span className="text-[#7a4c2e]">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@station.com.au"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#7a4c2e]/50 focus-visible:border-[#7a4c2e]/60"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="organisation" className="text-white/70 text-xs uppercase tracking-wide">
                  Station / Business
                </Label>
                <Input
                  id="organisation"
                  name="organisation"
                  placeholder="Mulga Downs Station"
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#7a4c2e]/50 focus-visible:border-[#7a4c2e]/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="state" className="text-white/70 text-xs uppercase tracking-wide">
                  State / Territory
                </Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="QLD"
                  maxLength={3}
                  className="bg-white/5 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#7a4c2e]/50 focus-visible:border-[#7a4c2e]/60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="message" className="text-white/70 text-xs uppercase tracking-wide">
                Current setup / challenge
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={3}
                placeholder="Briefly describe your current systems or what's not working…"
                className="bg-white/5 border-white/15 text-white placeholder:text-white/25 focus-visible:ring-[#7a4c2e]/50 focus-visible:border-[#7a4c2e]/60 resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-sm text-red-400">{errorMsg}</p>
            )}

            <Button
              type="submit"
              disabled={status === "loading"}
              className="bg-[#7a4c2e] text-white hover:bg-[#7a4c2e]/85 rounded-sm font-semibold"
            >
              {status === "loading" ? "Sending…" : "Request Free Audit"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
