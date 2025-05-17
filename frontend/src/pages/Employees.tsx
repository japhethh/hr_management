"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useEmployee } from "@/hooks/useEmployee"
import type { Employee } from "@/types"
import { toast } from "react-hot-toast"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Icons
import { MoreHorizontal, Pencil, Trash2, Eye, Filter, X, Save, UserPlus } from "lucide-react"

// Define filter types
interface Filters {
  status: string
  department: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

// Define new employee form data
interface EmployeeFormData {
  FirstName: string
  LastName: string
  Email: string
  PhoneNumber: string
  HireDate: string
  JobTitle: string
  DepartmentId: string
  SupervisorId: string
  status: string
}

const EmployeeDataTable = () => {
  // React Query hooks
  const { getEmployeeQuery, createEmployeeMutation, UpdateEmployeeMutation, deleteEmployee } =
    useEmployee()

  // State for UI
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    department: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [newEmployee, setNewEmployee] = useState<EmployeeFormData>({
    FirstName: "",
    LastName: "",
    Email: "",
    PhoneNumber: "",
    HireDate: new Date().toISOString().split("T")[0],
    JobTitle: "",
    DepartmentId: "",
    SupervisorId: "",
    status: "Active",
  })

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.status !== "all") count++
    if (filters.department !== "all") count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    setActiveFiltersCount(count)
  }, [filters])

  // Handle view employee
  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsViewDialogOpen(true)
  }

  // Handle edit employee
  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee({ ...employee })
    setIsEditDialogOpen(true)
  }

  // Handle delete employee
  const handleDeleteEmployee = (employeeId: string) => {
    setEmployeeToDelete(employeeId)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete employee
  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return

    try {
      await deleteEmployee.mutateAsync(employeeToDelete)
      setIsViewDialogOpen(false)
      setIsDeleteDialogOpen(false)
      setEmployeeToDelete(null)
      toast.success("Employee has been successfully deleted.")
    } catch (error) {
      console.error("Failed to delete employee:", error)
      toast.error("Failed to delete employee. Please try again.")
    }
  }

  // Handle save employee (edit)
  const handleSaveEmployee = async () => {
    if (!editingEmployee) return

    try {
      await UpdateEmployeeMutation.mutateAsync({
        id: editingEmployee._id,
        userData: editingEmployee,
      })
      setIsEditDialogOpen(false)
      setEditingEmployee(null)
    } catch (error) {
      console.error("Failed to update employee:", error)
      toast.error("There was an error updating the employee. Please try again.")
    }
  }

  // Handle add new employee
  const handleAddEmployee = async () => {
    try {
      await createEmployeeMutation.mutateAsync(newEmployee as any)
      setIsAddDialogOpen(false)
      // Reset form
      setNewEmployee({
        FirstName: "",
        LastName: "",
        Email: "",
        PhoneNumber: "",
        HireDate: new Date().toISOString().split("T")[0],
        JobTitle: "",
        DepartmentId: "",
        SupervisorId: "",
        status: "Active",
      })
    } catch (error) {
      console.error("Failed to add employee:", error)
      toast.error("There was an error adding the employee. Please try again.")
    }
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      department: "all",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    })
  }

  // Dialog state handlers
  const handleViewDialogChange = (open: boolean) => {
    setIsViewDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setSelectedEmployee(null)
      }, 100)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setEditingEmployee(null)
      }, 100)
    }
  }

  const handleAddDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open)
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setEmployeeToDelete(null)
      }, 100)
    }
  }

  // Filter and pagination logic
  const filteredData = getEmployeeQuery.data
    ? getEmployeeQuery.data.filter((employee: Employee) => {
      // Text search filter
      const fullName = `${employee.FirstName} ${employee.LastName}`.toLowerCase()
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        employee.Email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.JobTitle?.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      // Status filter
      if (filters.status !== "all" && employee.status !== filters.status) {
        return false
      }

      // Department filter
      if (filters.department !== "all" && employee.DepartmentId !== filters.department) {
        return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const hireDate = new Date(employee.HireDate || "")

        if (filters.dateRange.from && hireDate < filters.dateRange.from) {
          return false
        }

        if (filters.dateRange.to) {
          const endDate = new Date(filters.dateRange.to)
          endDate.setHours(23, 59, 59, 999) // End of the day
          if (hireDate > endDate) {
            return false
          }
        }
      }

      return true
    })
    : []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Loading and error states
  if (getEmployeeQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading employees...</p>
        </div>
      </div>
    )
  }

  if (getEmployeeQuery.isError) {
    return <div className="p-4 text-red-500">Error loading employee data. Please try again.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Employees</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters({ ...filters, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="HR001">HR</SelectItem>
                      <SelectItem value="IT001">IT</SelectItem>
                      <SelectItem value="FIN001">Finance</SelectItem>
                      <SelectItem value="MKT001">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Hire Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">From</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                            {filters.dateRange.from ? (
                              format(filters.dateRange.from, "PP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from}
                            onSelect={(date) =>
                              setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, from: date },
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">To</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                            {filters.dateRange.to ? (
                              format(filters.dateRange.to, "PP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to}
                            onSelect={(date) =>
                              setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, to: date },
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active Filters:</span>

              {filters.status !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "all" })}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.department !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Department: {filters.department}
                  <button
                    onClick={() => setFilters({ ...filters, department: "all" })}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {(filters.dateRange.from || filters.dateRange.to) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Hire Date: {filters.dateRange.from ? format(filters.dateRange.from, "PP") : "Any"}
                  {" - "}
                  {filters.dateRange.to ? format(filters.dateRange.to, "PP") : "Any"}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        dateRange: { from: undefined, to: undefined },
                      })
                    }
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto text-xs h-7">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((employee: Employee) => (
                <TableRow key={employee._id}>
                  <TableCell className="font-medium">{employee._id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {employee.FirstName} {employee.LastName}
                  </TableCell>
                  <TableCell>{employee.Email}</TableCell>
                  <TableCell>{employee.JobTitle}</TableCell>
                  <TableCell>{employee.DepartmentId}</TableCell>
                  <TableCell>{employee.HireDate ? format(new Date(employee.HireDate), "PP") : "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "Active"
                          ? "default"
                          : employee.status === "Inactive"
                            ? "destructive"
                            : "outline"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openMenuId === employee._id}
                      onOpenChange={(open) => {
                        setOpenMenuId(open ? employee._id : null)
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleViewEmployee(employee)
                            setOpenMenuId(null)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditEmployee(employee)
                            setOpenMenuId(null)
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            handleDeleteEmployee(employee._id)
                            setOpenMenuId(null)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
          {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} employees
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber: number

                // Logic to show pages around current page
                if (totalPages <= 5) {
                  pageNumber = index + 1
                } else if (currentPage <= 3) {
                  pageNumber = index + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index
                } else {
                  pageNumber = currentPage - 2 + index
                }

                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink onClick={() => paginate(pageNumber)} isActive={currentPage === pageNumber}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleViewDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>View detailed information about this employee</DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4">
              <div className="py-4 space-y-4">
                <DetailRow label="ID" value={selectedEmployee._id} />
                <DetailRow label="Name" value={`${selectedEmployee.FirstName} ${selectedEmployee.LastName}`} />
                <DetailRow label="Email" value={selectedEmployee.Email} />
                <DetailRow label="Phone" value={selectedEmployee.PhoneNumber || "N/A"} />
                <DetailRow label="Job Title" value={selectedEmployee.JobTitle || "N/A"} />
                <DetailRow label="Department" value={selectedEmployee.DepartmentId || "N/A"} />
                <DetailRow label="Supervisor" value={selectedEmployee.SupervisorId || "N/A"} />
                <DetailRow label="Status" value={selectedEmployee.status || "N/A"} />
                <DetailRow
                  label="Hire Date"
                  value={selectedEmployee.HireDate ? format(new Date(selectedEmployee.HireDate), "PPpp") : "N/A"}
                />
              </div>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEditEmployee(selectedEmployee)
                    setIsViewDialogOpen(false)
                  }}
                >
                  Edit Employee
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteEmployee(selectedEmployee._id)}>
                  Delete Employee
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Make changes to employee information</DialogDescription>
          </DialogHeader>

          {editingEmployee && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-firstname" className="text-right">
                    First Name
                  </Label>
                  <Input
                    id="edit-firstname"
                    value={editingEmployee.FirstName}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        FirstName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-lastname" className="text-right">
                    Last Name
                  </Label>
                  <Input
                    id="edit-lastname"
                    value={editingEmployee.LastName}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        LastName: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingEmployee.Email}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        Email: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="edit-phone"
                    value={editingEmployee.PhoneNumber || ""}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        PhoneNumber: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-jobtitle" className="text-right">
                    Job Title
                  </Label>
                  <Input
                    id="edit-jobtitle"
                    value={editingEmployee.JobTitle || ""}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        JobTitle: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-department" className="text-right">
                    Department
                  </Label>
                  <Select
                    value={editingEmployee.DepartmentId || ""}
                    onValueChange={(value) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        DepartmentId: value,
                      })
                    }
                  >
                    <SelectTrigger id="edit-department" className="col-span-3">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR001">HR</SelectItem>
                      <SelectItem value="IT001">IT</SelectItem>
                      <SelectItem value="FIN001">Finance</SelectItem>
                      <SelectItem value="MKT001">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-supervisor" className="text-right">
                    Supervisor ID
                  </Label>
                  <Input
                    id="edit-supervisor"
                    value={editingEmployee.SupervisorId || ""}
                    onChange={(e) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        SupervisorId: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editingEmployee.status || ""}
                    onValueChange={(value) =>
                      setEditingEmployee({
                        ...editingEmployee,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger id="edit-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEmployee} disabled={UpdateEmployeeMutation.isPending} className="gap-2">
                  {UpdateEmployeeMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Enter the details for the new employee</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-firstname" className="text-right">
                  First Name
                </Label>
                <Input
                  id="add-firstname"
                  value={newEmployee.FirstName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      FirstName: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-lastname" className="text-right">
                  Last Name
                </Label>
                <Input
                  id="add-lastname"
                  value={newEmployee.LastName}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      LastName: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="add-email"
                  type="email"
                  value={newEmployee.Email}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      Email: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="add-phone"
                  value={newEmployee.PhoneNumber}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      PhoneNumber: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-hiredate" className="text-right">
                  Hire Date
                </Label>
                <Input
                  id="add-hiredate"
                  type="date"
                  value={newEmployee.HireDate}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      HireDate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-jobtitle" className="text-right">
                  Job Title
                </Label>
                <Input
                  id="add-jobtitle"
                  value={newEmployee.JobTitle}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      JobTitle: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-department" className="text-right">
                  Department
                </Label>
                <Select
                  value={newEmployee.DepartmentId}
                  onValueChange={(value) =>
                    setNewEmployee({
                      ...newEmployee,
                      DepartmentId: value,
                    })
                  }
                >
                  <SelectTrigger id="add-department" className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR001">HR</SelectItem>
                    <SelectItem value="IT001">IT</SelectItem>
                    <SelectItem value="FIN001">Finance</SelectItem>
                    <SelectItem value="MKT001">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-supervisor" className="text-right">
                  Supervisor ID
                </Label>
                <Input
                  id="add-supervisor"
                  value={newEmployee.SupervisorId}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      SupervisorId: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newEmployee.status}
                  onValueChange={(value) =>
                    setNewEmployee({
                      ...newEmployee,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="add-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEmployee} disabled={createEmployeeMutation.isPending} className="gap-2">
                {createEmployeeMutation.isPending && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <UserPlus className="h-4 w-4 mr-1" />
                Add Employee
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this employee? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteEmployee}
              disabled={deleteEmployee.isPending}
              className="gap-2"
            >
              {deleteEmployee.isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper component
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <span className="text-sm font-medium text-gray-500">{label}:</span>
    <span className="col-span-3 text-sm break-all">{value}</span>
  </div>
)

export default EmployeeDataTable
