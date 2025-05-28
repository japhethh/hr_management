"use client"

import { useState } from "react"
import { useTimeAttendance } from "@/hooks/useTimeAttendance"
import { useEmployee } from "@/hooks/useEmployee"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimeAttendanceTable } from "@/components/TimeAttendanceTable"
import { AttendanceSummaryCard } from "@/components/AttendanceSummaryCard"
import { CalendarIcon, ClockIcon, UserIcon } from "lucide-react"
import type { TimeAttendance } from "@/types"
import { format } from "date-fns"

export default function TimeAttendancePage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().setDate(1)), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  })
  const [newAttendance, setNewAttendance] = useState<Partial<TimeAttendance>>({
    Status: "Present",
    workDate: format(new Date(), "yyyy-MM-dd"),
  })

  // Get employees
  const { getEmployeeQuery } = useEmployee()
  const { data: employees = [] } = getEmployeeQuery

  // Get time attendance data
  const {
    getTimeAttendancesQuery,
    getTimeAttendanceByEmployeeIdQuery,
    getTimeAttendanceByDateRangeQuery,
    getAttendanceSummaryQuery,
    createTimeAttendanceMutation,
    clockInMutation,
    clockOutMutation,
    markAbsentMutation,
    markLeaveMutation,
    deleteTimeAttendanceMutation,
  } = useTimeAttendance()

  // Get all time attendance records
  const { data: allTimeAttendances = [], isLoading: isLoadingAllTimeAttendances } = getTimeAttendancesQuery

  // Get time attendance records for selected employee
  const { data: employeeTimeAttendances = [], isLoading: isLoadingEmployeeTimeAttendances } =
    getTimeAttendanceByEmployeeIdQuery(selectedEmployeeId)

  // Get time attendance records for selected date range
  const { data: dateRangeTimeAttendances = [], isLoading: isLoadingDateRangeTimeAttendances } =
    getTimeAttendanceByDateRangeQuery(dateRange.startDate, dateRange.endDate)

  // Get attendance summary
  const {
    data: attendanceSummary = { total: 0, present: 0, absent: 0, leave: 0, late: 0 },
    isLoading: isLoadingAttendanceSummary,
  } = getAttendanceSummaryQuery(dateRange.startDate, dateRange.endDate)

  // Handle creating a new time attendance record
  const handleCreateTimeAttendance = () => {
    if (!newAttendance.EmployeeId) {
      alert("Please select an employee")
      return
    }

    createTimeAttendanceMutation.mutate(newAttendance as TimeAttendance)

    // Reset form
    setNewAttendance({
      Status: "Present",
      workDate: format(new Date(), "yyyy-MM-dd"),
    })
  }

  // Handle clock in
  const handleClockIn = (employeeId: string) => {
    clockInMutation.mutate(employeeId)
  }

  // Handle clock out
  const handleClockOut = (employeeId: string) => {
    clockOutMutation.mutate(employeeId)
  }

  // Handle mark absent
  const handleMarkAbsent = (employeeId: string) => {
    markAbsentMutation.mutate({ employeeId })
  }

  // Handle mark leave
  const handleMarkLeave = (employeeId: string) => {
    markLeaveMutation.mutate({ employeeId })
  }

  // Handle delete time attendance record
  const handleDeleteTimeAttendance = (id: string) => {
    if (confirm("Are you sure you want to delete this time attendance record?")) {
      deleteTimeAttendanceMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Time & Attendance</h1>
          <p className="text-muted-foreground">Manage employee time and attendance records</p>
        </div>
      </div>

      {/* Attendance Summary Card */}
      <AttendanceSummaryCard
        summary={attendanceSummary}
        isLoading={isLoadingAttendanceSummary}
        description={`Summary for ${format(new Date(dateRange.startDate), "MMM d, yyyy")} - ${format(new Date(dateRange.endDate), "MMM d, yyyy")}`}
      />

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeFilter">Filter by Employee</Label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger id="employeeFilter">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id as string}>
                      {employee?.FirstName || "Unknown"} {employee?.LastName || "Employee"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Time Attendance Record */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Attendance Record</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={newAttendance.EmployeeId as string}
                onValueChange={(value) => setNewAttendance({ ...newAttendance, EmployeeId: value })}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id as string}>
                      {employee?.FirstName || "Unknown"} {employee?.LastName || "Employee"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workDate">Date</Label>
              <Input
                id="workDate"
                type="date"
                value={newAttendance.workDate as string}
                onChange={(e) => setNewAttendance({ ...newAttendance, workDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newAttendance.Status}
                onValueChange={(value) =>
                  setNewAttendance({
                    ...newAttendance,
                    Status: value as "Present" | "Absent" | "Leave" | "Late",
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Present">Present</SelectItem>
                  <SelectItem value="Absent">Absent</SelectItem>
                  <SelectItem value="Leave">Leave</SelectItem>
                  <SelectItem value="Late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                className="w-full"
                onClick={handleCreateTimeAttendance}
                disabled={createTimeAttendanceMutation.isPending || !newAttendance.EmployeeId}
              >
                {createTimeAttendanceMutation.isPending ? "Adding..." : "Add Record"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Attendance Records */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            <CalendarIcon className="mr-2 h-4 w-4" />
            All Records
          </TabsTrigger>
          <TabsTrigger value="by-employee" disabled={selectedEmployeeId === "all"}>
            <UserIcon className="mr-2 h-4 w-4" />
            By Employee
          </TabsTrigger>
          <TabsTrigger value="by-date">
            <ClockIcon className="mr-2 h-4 w-4" />
            By Date Range
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <TimeAttendanceTable
                timeAttendances={allTimeAttendances}
                employees={employees}
                isLoading={isLoadingAllTimeAttendances}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                onMarkAbsent={handleMarkAbsent}
                onMarkLeave={handleMarkLeave}
                onDelete={handleDeleteTimeAttendance}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-employee" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <TimeAttendanceTable
                timeAttendances={employeeTimeAttendances}
                employees={employees}
                isLoading={isLoadingEmployeeTimeAttendances}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                onMarkAbsent={handleMarkAbsent}
                onMarkLeave={handleMarkLeave}
                onDelete={handleDeleteTimeAttendance}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-date" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <TimeAttendanceTable
                timeAttendances={dateRangeTimeAttendances}
                employees={employees}
                isLoading={isLoadingDateRangeTimeAttendances}
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                onMarkAbsent={handleMarkAbsent}
                onMarkLeave={handleMarkLeave}
                onDelete={handleDeleteTimeAttendance}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
