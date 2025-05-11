"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Settings,
  Users,
  Calendar,
  FileText,
  LogOut,
  Menu,
  NotebookText,
  CreditCard,
  Cog,
  ChevronRight,
  X,
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
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted hover:text-muted-foreground",
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
          <div className="bg-popover shadow-md rounded-md py-2 px-2 text-sm">
            <div className="font-medium mb-1">{label}</div>
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
          "hover:bg-muted hover:text-muted-foreground transition-colors",
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

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  // Sidebar content - shared between desktop and mobile
  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="flex items-center justify-between p-4">
        {(!isCollapsed || isMobile) && (
          <h2 className="font-semibold text-lg transition-opacity duration-200">Dashboard</h2>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className={cn("p-2 rounded-full transition-all duration-200", isCollapsed ? "mx-auto" : "")}
            onClick={toggleSidebar}
            title="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
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
          to="/invoice-management"
          icon={NotebookText}
          label="Invoice Management"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/testUserList"
          icon={NotebookText}
          label="Test Userlist"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/payment-process"
          icon={CreditCard}
          label="Payment Process"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/payment-gateway"
          icon={Cog}
          label="Payment Gateway"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
        <NavItem
          to="/settings"
          icon={Settings}
          label="Settings"
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
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted hover:text-muted-foreground",
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
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted hover:text-muted-foreground",
              )
            }
            onClick={isMobile ? closeMobileMenu : undefined}
          >
            Create User
          </NavLink>
        </SubMenu>

        {/* Content SubMenu */}
        <SubMenu icon={FileText} label="Content" isCollapsed={isCollapsed && !isMobile}>
          <NavLink
            to="/posts"
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted hover:text-muted-foreground",
              )
            }
            onClick={isMobile ? closeMobileMenu : undefined}
          >
            Posts
          </NavLink>
          <NavLink
            to="/media"
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors w-full",
                isActive ? "bg-accent text-accent-foreground" : "hover:bg-muted hover:text-muted-foreground",
              )
            }
            onClick={isMobile ? closeMobileMenu : undefined}
          >
            Media
          </NavLink>
        </SubMenu>

        <NavItem
          to="/calendar"
          icon={Calendar}
          label="Calendar"
          isCollapsed={isCollapsed && !isMobile}
          onClick={isMobile ? closeMobileMenu : undefined}
        />
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full gap-3 transition-all duration-200",
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
      {/* Mobile Menu Trigger */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-40 p-2 rounded-full md:hidden bg-background shadow-sm"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile Sidebar using Sheet component */}
      {isMobile && (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px]">
            <div className="h-full flex flex-col">
              <SidebarContent isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="h-screen border-r bg-background flex-shrink-0 hidden md:block">
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
