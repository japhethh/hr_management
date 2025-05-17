"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Clock,
  GraduationCap,
  BarChart,
  LogOut,
  Menu,
  ChevronRight,
  X,
  LineChartIcon as ChartLine,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface NavItemProps {
  to: string
  icon: React.ElementType
  label: string
  isCollapsed: boolean
  onClick?: () => void
}

const NavItem = ({ to, icon: Icon, label, isCollapsed, onClick }: NavItemProps) => {
  // Using the blue theme colors from the second sidebar example
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive
            ? "bg-blue-200 text-blue-700" // Active state using blue theme
            : "hover:bg-blue-100 hover:text-blue-500", // Hover state using blue theme
          isCollapsed ? "justify-center" : "",
        )
      }
      onClick={onClick}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      <span className={cn("transition-all duration-200", isCollapsed ? "w-0 opacity-0 hidden" : "opacity-100")}>
        {label}
      </span>
    </NavLink>
  )
}

interface SubMenuProps {
  icon: React.ElementType
  label: string
  isCollapsed: boolean
  children: React.ReactNode
}

const SubMenu = ({ icon: Icon, label, isCollapsed, children }: SubMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)

  if (isCollapsed) {
    return (
      <div className="relative group">
        <Button variant="ghost" size="sm" className="w-full justify-center p-2 rounded-md">
          <Icon className="h-4 w-4" />
        </Button>

        {/* Tooltip on hover when collapsed */}
        <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
          <div className="bg-white shadow-md rounded-md py-2 px-2 text-sm border border-blue-100">
            <div className="font-medium mb-1 text-blue-700">{label}</div>
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-1">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium cursor-pointer",
          "hover:bg-blue-100 hover:text-blue-500 transition-colors",
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span>{label}</span>
        </div>
        <div
          className="transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>

      <div
        className={cn(
          "pl-9 space-y-1 overflow-hidden transition-all duration-200",
          isOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Handle screen resize to detect mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)

      // Auto-collapse on smaller screens
      if (mobile && !isCollapsed) {
        setIsCollapsed(true)
      }
    }

    // Check on initial load
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [isCollapsed])

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [sidebarOpen, setSidebarOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Ctrl+B
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const closeMobileMenu = () => {
    setSidebarOpen(false)
  }

  // Sidebar content - shared between desktop and mobile
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="flex items-center justify-between p-4 bg-white">
        {(!isCollapsed || isMobile) && (
          <h2 className="font-semibold text-lg transition-opacity duration-200 text-blue-700">HR System</h2>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "p-2 rounded-full transition-all duration-200 text-blue-700 hover:bg-blue-100",
              isCollapsed ? "mx-auto" : "",
            )}
            onClick={toggleSidebar}
            title="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full text-blue-700 hover:bg-blue-100"
            onClick={closeMobileMenu}
            title="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 flex flex-col p-2 space-y-1 overflow-y-auto">
        <NavItem
          to="/"
          icon={LayoutDashboard}
          label="Dashboard"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/employees"
          icon={Users}
          label="Employees"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/recruitment"
          icon={Briefcase}
          label="Recruitment"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/time-attendance"
          icon={Clock}
          label="Time & Attendance"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/competency"
          icon={GraduationCap}
          label="Competency"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/performance"
          icon={ChartLine}
          label="Performance"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/analytics"
          icon={BarChart}
          label="HR Analytics"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        {/* User Management SubMenu */}
        <SubMenu icon={Users} label="User Management" isCollapsed={isCollapsed && !isMobile}>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                isActive ? "bg-blue-200 text-blue-700" : "hover:bg-blue-100 hover:text-blue-500",
              )
            }
            onClick={isMobile ? closeMobileMenu : undefined}
          >
            All Users
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                isActive ? "bg-blue-200 text-blue-700" : "hover:bg-blue-100 hover:text-blue-500",
              )
            }
            onClick={isMobile ? closeMobileMenu : undefined}
          >
            Create User
          </NavLink>
        </SubMenu>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-100">
        <Button
          variant="ghost"
          className={cn(
            "w-full gap-3 transition-all duration-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
            isCollapsed && !isMobile ? "justify-center" : "justify-start",
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span
            className={cn(
              "transition-all duration-200",
              isCollapsed && !isMobile ? "w-0 opacity-0 hidden" : "opacity-100",
            )}
          >
            Logout
          </span>
        </Button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Sidebar using Sheet component */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px] bg-white border-r border-blue-100">
            <div className="h-full flex flex-col">
              <SidebarContent isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="h-screen border-r border-blue-100 bg-white flex-shrink-0 hidden md:block">
          <div
            className={cn(
              "h-full flex flex-col transition-all duration-300 ease-in-out",
              isCollapsed ? "w-16" : "w-64",
            )}
          >
            <SidebarContent />
          </div>
        </aside>
      )}
    </>
  )
}
