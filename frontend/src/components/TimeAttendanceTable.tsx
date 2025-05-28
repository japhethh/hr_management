"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TimeAttendance, Employee } from "@/types"
import { formatDate } from "@/lib/utils"

interface TimeAttendanceTableProps {
  timeAttendances: TimeAttendance[]
  employees: Employee[]
  isLoading: boolean
  onClockIn?: (employeeId: string) => void
  onClockOut?: (employeeId: string) => void
  onMarkAbsent?: (employeeId: string) => void
  onMarkLeave?: (employeeId: string) => void
  onDelete?: (id: string) => void
}

export const TimeAttendanceTable: React.FC<TimeAttendanceTableProps> = ({
  timeAttendances,
  employees,
  isLoading,
  onClockIn,
  onClockOut,
  onMarkAbsent,
  onMarkLeave,
  onDelete,
}) => {
  // Helper function to get employee name by ID
  const getEmployeeName = (employeeId: string | Employee): string => {
    if (typeof employeeId === "object" && employeeId?.FirstName) {
      return `${employeeId?.FirstName} ${employeeId?.LastName}`
    }

    // If employeeId is a string, find the employee in the employees array
    if (typeof employeeId === "string") {
      const employee = employees.find((emp) => emp._id === employeeId)
      if (employee && employee.FirstName && employee.LastName) {
        return `${employee.FirstName} ${employee.LastName}`
      }
      return "Unknown Employee"
    }

    return "Unknown Employee"
  }

  // Helper function to format time
  const formatTime = (time?: string): string => {
    if (!time) return "N/A"
    return time
  }

  // Helper function to format hours worked
  const formatHoursWorked = (hoursWorked?: Date | string): string => {
    if (!hoursWorked) return "N/A"

    if (typeof hoursWorked === "string") {
      const date = new Date(hoursWorked)
      return `${date.getHours()}h ${date.getMinutes()}m`
    }

    return `${hoursWorked.getHours()}h ${hoursWorked.getMinutes()}m`
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let badgeClass = ""

    switch (status) {
      case "Present":
        badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        break
      case "Absent":
        badgeClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
        break
      case "Leave":
        badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        break
      case "Late":
        badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        break
      default:
        badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }

    return <Badge className={badgeClass}>{status}</Badge>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Clock In</TableHead>
          <TableHead>Clock Out</TableHead>
          <TableHead>Hours Worked</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Loading time attendance records...
            </TableCell>
          </TableRow>
        ) : timeAttendances.length > 0 ? (
          timeAttendances.map((record) => (
            <TableRow key={record._id}>
              <TableCell className="font-medium">{getEmployeeName(record.EmployeeId)}</TableCell>
              <TableCell>{formatDate(record.workDate)}</TableCell>
              <TableCell>{formatTime(record.ClockIn)}</TableCell>
              <TableCell>{formatTime(record.ClockOut)}</TableCell>
              <TableCell>{formatHoursWorked(record.HoursWorked)}</TableCell>
              <TableCell>{renderStatusBadge(record.Status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onClockIn && !record.ClockIn && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const employeeId =
                          typeof record.EmployeeId === "string" ? record.EmployeeId : record.EmployeeId._id
                        if (employeeId) onClockIn(employeeId)
                      }}
                    >
                      Clock In
                    </Button>
                  )}

                  {onClockOut && record.ClockIn && !record.ClockOut && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const employeeId =
                          typeof record.EmployeeId === "string" ? record.EmployeeId : record.EmployeeId._id
                        if (employeeId) onClockOut(employeeId)
                      }}
                    >
                      Clock Out
                    </Button>
                  )}

                  {onMarkAbsent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const employeeId =
                          typeof record.EmployeeId === "string" ? record.EmployeeId : record.EmployeeId._id
                        if (employeeId) onMarkAbsent(employeeId)
                      }}
                      disabled={record.Status === "Absent"}
                    >
                      Mark Absent
                    </Button>
                  )}

                  {onMarkLeave && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const employeeId =
                          typeof record.EmployeeId === "string" ? record.EmployeeId : record.EmployeeId._id
                        if (employeeId) onMarkLeave(employeeId)
                      }}
                      disabled={record.Status === "Leave"}
                    >
                      Mark Leave
                    </Button>
                  )}

                  {onDelete && record._id && (
                    <Button variant="destructive" size="sm" onClick={() => onDelete(record._id as string)}>
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No time attendance records found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
