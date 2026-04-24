export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d1410] text-white font-[family-name:var(--font-geist-sans)]">
      {children}
    </div>
  )
}
