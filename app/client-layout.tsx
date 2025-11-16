"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

const pages = [
  { path: "/", name: "Overview", icon: "📊" },
  { path: "/data-apis", name: "Data & APIs", icon: "🔌" },
  { path: "/models-benchmarks", name: "Models & Benchmarks", icon: "🧠" },
  { path: "/model-comparison", name: "Model Comparison", icon: "⚖️" },
  { path: "/portfolio-results", name: "Portfolio Results", icon: "💼" },
]

const ClientLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const currentPage = pages.find((p) => p.path === pathname) || pages[0]

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 border-r border-slate-800 transition-all duration-300 flex flex-col overflow-hidden`}
      >

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {pages.map((page) => (
            <Link key={page.path} href={page.path}>
              <button
                className={`w-full text-left px-4 py-3 rounded transition-colors text-sm font-medium flex items-center gap-3 ${
                  pathname === page.path ? "bg-teal-600 text-white shadow-lg" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span className="text-base">{page.icon}</span>
                {sidebarOpen && <span>{page.name}</span>}
              </button>
            </Link>
          ))}
        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-950">{children}</div>
      </main>
    </div>
  )
}

export default ClientLayout
