"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Calendar, Clock, Filter } from "lucide-react"
import { mockTimeAttendance, mockShiftSchedule, mockEmployees } from "../lib/utils"

const TimeAttendance = () => {
  const [searchTerm, setSearchTerm] = useState("")

  // Get employee name by ID
  const getEmployeeName = (employeeId: number) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "N/A"
  }

  // Filter attendance records based on search term
  const filteredAttendance = mockTimeAttendance.filter((record) =>
    getEmployeeName(record.employeeId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter shift schedule based on search term
  const filteredSchedule = mockShiftSchedule.filter((shift) =>
    getEmployeeName(shift.employeeId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Time & Attendance</h1>
        <p className="text-muted-foreground">Track employee attendance and manage schedules</p>
      </div>

      <Tabs defaultValue="attendance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance">
            <Clock className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" />
            Shift Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          <div className="flex items-center justify-between">
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
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button>Record Attendance</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Hours Worked</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{getEmployeeName(record.employeeId)}</TableCell>
                        <TableCell>{record.workDate}</TableCell>
                        <TableCell>{record.clockIn || "N/A"}</TableCell>
                        <TableCell>{record.clockOut || "N/A"}</TableCell>
                        <TableCell>{record.hoursWorked}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : record.status === "Late"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="flex items-center justify-between">
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
            <Button>Create Schedule</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift Start</TableHead>
                    <TableHead>Shift End</TableHead>
                    <TableHead>Shift Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedule.length > 0 ? (
                    filteredSchedule.map((shift) => (
                      <TableRow key={shift.id}>
                        <TableCell className="font-medium">{getEmployeeName(shift.employeeId)}</TableCell>
                        <TableCell>{shift.shiftDate}</TableCell>
                        <TableCell>{shift.shiftStart}</TableCell>
                        <TableCell>{shift.shiftEnd}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              shift.shiftType === "Morning"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : shift.shiftType === "Afternoon"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                                  : shift.shiftType === "Night"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {shift.shiftType}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No shift schedules found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TimeAttendance
