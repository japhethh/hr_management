import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { useState } from "react"

export default function MainLayout() {

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
