"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Search, Plus, Filter, MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { mockEmployees, mockDepartments } from "../lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"

// Define Employee interface
interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  hireDate: string
  jobTitle: string
  departmentId: number
  supervisorId: number | null
  status: string
}

// Default empty employee for the new employee form
const defaultNewEmployee: Partial<Employee> = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  hireDate: "",
  jobTitle: "",
  departmentId: 1,
  supervisorId: null,
  status: "Active",
}

const Employees = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogState, setDialogState] = useState({
    add: false,
    view: false,
    edit: false,
    delete: false,
  })
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ ...defaultNewEmployee })

  // Filter employees based on search term
  const filteredEmployees = mockEmployees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Helper functions
  const getDepartmentName = (departmentId: number) => {
    const department = mockDepartments.find((dept) => dept.id === departmentId)
    return department ? department.departmentName : "N/A"
  }

  const getSupervisorName = (supervisorId: number | null) => {
    if (!supervisorId) return "None"
    const supervisor = mockEmployees.find((emp) => emp.id === supervisorId)
    return supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : "N/A"
  }

  // Dialog control functions
  const openDialog = (type: "add" | "view" | "edit" | "delete", employee?: Employee) => {
    if (employee) {
      setSelectedEmployee(type === "edit" ? { ...employee } : employee)
    }
    setDialogState({ ...dialogState, [type]: true })
  }

  const closeDialog = (type: "add" | "view" | "edit" | "delete") => {
    setDialogState({ ...dialogState, [type]: false })
    if (type === "add") {
      setNewEmployee({ ...defaultNewEmployee })
    }
  }

  // CRUD operations
  const handleAddEmployee = () => {
    // In a real app, this would make an API call to add the employee
    console.log("Adding employee:", newEmployee)
    closeDialog("add")
  }

  const handleEditEmployee = () => {
    // In a real app, this would make an API call to update the employee
    console.log("Editing employee:", selectedEmployee)
    closeDialog("edit")
  }

  const handleDeleteEmployee = () => {
    // In a real app, this would make an API call to delete the employee
    console.log("Deleting employee:", selectedEmployee)
    closeDialog("delete")
  }

  // Render status badge
  const renderStatusBadge = (status: string) => (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "Active"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      }`}
    >
      {status}
    </span>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">Manage your employee records</p>
        </div>
        <Button onClick={() => openDialog("add")}>
          <Plus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search employees..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.jobTitle}</TableCell>
                      <TableCell>{getDepartmentName(employee.departmentId)}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell>{renderStatusBadge(employee.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDialog("view", employee)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog("edit", employee)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openDialog("delete", employee)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No employees found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={dialogState.add} onOpenChange={(open) => setDialogState({ ...dialogState, add: open })}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Fill in the details to add a new employee to the system.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={newEmployee.phoneNumber}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={newEmployee.hireDate}
                  onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={newEmployee.jobTitle}
                onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newEmployee.departmentId?.toString()}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, departmentId: Number.parseInt(value) })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newEmployee.status}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Select
                value={newEmployee.supervisorId?.toString() || ""}
                onValueChange={(value) =>
                  setNewEmployee({ ...newEmployee, supervisorId: value ? Number.parseInt(value) : null })
                }
              >
                <SelectTrigger id="supervisor">
                  <SelectValue placeholder="Select supervisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id.toString()}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog("add")}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={dialogState.view} onOpenChange={(open) => setDialogState({ ...dialogState, view: open })}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>View detailed information about this employee.</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Job Title</Label>
                  <p className="font-medium">{selectedEmployee.jobTitle}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Email</Label>
                <p className="font-medium">{selectedEmployee.email}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Phone Number</Label>
                  <p className="font-medium">{selectedEmployee.phoneNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Hire Date</Label>
                  <p className="font-medium">{selectedEmployee.hireDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Department</Label>
                  <p className="font-medium">{getDepartmentName(selectedEmployee.departmentId)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p>{renderStatusBadge(selectedEmployee.status)}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Supervisor</Label>
                <p className="font-medium">{getSupervisorName(selectedEmployee.supervisorId)}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => closeDialog("view")}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={dialogState.edit} onOpenChange={(open) => setDialogState({ ...dialogState, edit: open })}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information.</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name</Label>
                  <Input
                    id="edit-firstName"
                    value={selectedEmployee.firstName}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name</Label>
                  <Input
                    id="edit-lastName"
                    value={selectedEmployee.lastName}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, lastName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedEmployee.email}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                  <Input
                    id="edit-phoneNumber"
                    value={selectedEmployee.phoneNumber}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, phoneNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-hireDate">Hire Date</Label>
                  <Input
                    id="edit-hireDate"
                    type="date"
                    value={selectedEmployee.hireDate}
                    onChange={(e) => setSelectedEmployee({ ...selectedEmployee, hireDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-jobTitle">Job Title</Label>
                <Input
                  id="edit-jobTitle"
                  value={selectedEmployee.jobTitle}
                  onChange={(e) => setSelectedEmployee({ ...selectedEmployee, jobTitle: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Select
                    value={selectedEmployee.departmentId.toString()}
                    onValueChange={(value) =>
                      setSelectedEmployee({ ...selectedEmployee, departmentId: Number.parseInt(value) })
                    }
                  >
                    <SelectTrigger id="edit-department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.departmentName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedEmployee.status}
                    onValueChange={(value) => setSelectedEmployee({ ...selectedEmployee, status: value })}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-supervisor">Supervisor</Label>
                <Select
                  value={selectedEmployee.supervisorId?.toString() || ""}
                  onValueChange={(value) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      supervisorId: value ? Number.parseInt(value) : null,
                    })
                  }
                >
                  <SelectTrigger id="edit-supervisor">
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {mockEmployees
                      .filter((emp) => emp.id !== selectedEmployee.id)
                      .map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {emp.firstName} {emp.lastName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog("edit")}>
              Cancel
            </Button>
            <Button onClick={handleEditEmployee}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={dialogState.delete} onOpenChange={(open) => setDialogState({ ...dialogState, delete: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the employee record for{" "}
              {selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : "this employee"}. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => closeDialog("delete")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Employees
