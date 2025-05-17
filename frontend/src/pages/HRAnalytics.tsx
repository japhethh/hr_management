"use client"

import { useState } from "react"
import { useHrAnalytics } from "@/hooks/useHrAnalytics"
import { useEmployee } from "@/hooks/useEmployee"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HrAnalyticsTable } from "@/components/HrAnalyticsTable"
import { PerformanceMetricsTable } from "@/components/PerformanceMetricsTable"
import { DepartmentPerformanceCard } from "@/components/DepartmentPerformanceCard"
import { BarChart, LineChart, RefreshCw, Users } from "lucide-react"
import type { HrAnalytics } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function HrAnalyticsPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentAnalytics, setCurrentAnalytics] = useState<Partial<HrAnalytics>>({
    AnalyticsID: `ANA-${Date.now()}`,
    ReviewID: `REV-${Date.now()}`,
  })
  const [isEditing, setIsEditing] = useState(false)

  // Get employees
  const { getEmployeeQuery } = useEmployee()
  const { data: employees = [] } = getEmployeeQuery

  // Get HR analytics data
  const {
    getHrAnalyticsQuery,
    getHrAnalyticsByEmployeeIdQuery,
    getEmployeePerformanceMetricsQuery,
    getDepartmentPerformanceMetricsQuery,
    getTopPerformersQuery,
    createHrAnalyticsMutation,
    updateHrAnalyticsMutation,
    deleteHrAnalyticsMutation,
    generateHrAnalyticsMutation,
    generateAllHrAnalyticsMutation,
  } = useHrAnalytics()

  // Get all HR analytics records
  const { data: allAnalytics = [], isLoading: isLoadingAllAnalytics } = getHrAnalyticsQuery

  // Get HR analytics records for selected employee
  const { data: employeeAnalytics = [], isLoading: isLoadingEmployeeAnalytics } =
    getHrAnalyticsByEmployeeIdQuery(selectedEmployeeId)

  // Get employee performance metrics
  const { data: performanceMetrics = [], isLoading: isLoadingPerformanceMetrics } = getEmployeePerformanceMetricsQuery

  // Get department performance metrics
  const { data: departmentMetrics = [], isLoading: isLoadingDepartmentMetrics } = getDepartmentPerformanceMetricsQuery

  // Get top performers
  const { data: topPerformers = [], isLoading: isLoadingTopPerformers } = getTopPerformersQuery(5)

  // Handle creating/updating an HR analytics record
  const handleSaveAnalytics = () => {
    if (!currentAnalytics.EmployeeID) {
      alert("Please select an employee")
      return
    }

    if (isEditing && currentAnalytics._id) {
      updateHrAnalyticsMutation.mutate({
        id: currentAnalytics._id,
        hrAnalyticsData: currentAnalytics,
      })
    } else {
      createHrAnalyticsMutation.mutate(currentAnalytics as HrAnalytics)
    }

    // Close dialog and reset form
    setIsDialogOpen(false)
    setCurrentAnalytics({
      AnalyticsID: `ANA-${Date.now()}`,
      ReviewID: `REV-${Date.now()}`,
    })
    setIsEditing(false)
  }

  // Handle editing an HR analytics record
  const handleEditAnalytics = (analytics: HrAnalytics) => {
    setCurrentAnalytics({
      ...analytics,
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle deleting an HR analytics record
  const handleDeleteAnalytics = (id: string) => {
    if (confirm("Are you sure you want to delete this HR analytics record?")) {
      deleteHrAnalyticsMutation.mutate(id)
    }
  }

  // Handle generating HR analytics for an employee
  const handleGenerateAnalytics = (employeeId: string) => {
    generateHrAnalyticsMutation.mutate(employeeId)
  }

  // Handle generating HR analytics for all employees
  const handleGenerateAllAnalytics = () => {
    generateAllHrAnalyticsMutation.mutate()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Analytics</h1>
          <p className="text-muted-foreground">Track and analyze employee performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateAllAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" /> Generate All Analytics
          </Button>
          <Button
            onClick={() => {
              setCurrentAnalytics({
                AnalyticsID: `ANA-${Date.now()}`,
                ReviewID: `REV-${Date.now()}`,
              })
              setIsEditing(false)
              setIsDialogOpen(true)
            }}
          >
            Add Analytics Record
          </Button>
        </div>
      </div>

      {/* Top Performers Card */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
          <CardDescription>Employees with the highest overall performance scores</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingTopPerformers ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">Loading top performers...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {topPerformers.map((performer, index) => (
                <Card key={performer.employeeId} className={index === 0 ? "border-2 border-yellow-400" : ""}>
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <Users className="h-8 w-8 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{performer.employeeName}</h3>
                        <p className="text-xs text-muted-foreground">{performer.department}</p>
                      </div>
                      <div className="text-2xl font-bold text-indigo-600">{performer.overallScore.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground">Overall Score</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Department Performance Card */}
      <DepartmentPerformanceCard metrics={departmentMetrics} isLoading={isLoadingDepartmentMetrics} />

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {employee.FirstName} {employee.LastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* HR Analytics Records */}
      <Tabs defaultValue="analytics">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">
            <BarChart className="mr-2 h-4 w-4" />
            Analytics Records
          </TabsTrigger>
          <TabsTrigger value="performance">
            <LineChart className="mr-2 h-4 w-4" />
            Performance Metrics
          </TabsTrigger>
          <TabsTrigger value="employee-analytics" disabled={selectedEmployeeId === "all"}>
            <Users className="mr-2 h-4 w-4" />
            Employee Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <HrAnalyticsTable
                analytics={allAnalytics}
                isLoading={isLoadingAllAnalytics}
                onEdit={handleEditAnalytics}
                onDelete={handleDeleteAnalytics}
                onGenerate={handleGenerateAnalytics}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <PerformanceMetricsTable metrics={performanceMetrics} isLoading={isLoadingPerformanceMetrics} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employee-analytics" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <HrAnalyticsTable
                analytics={employeeAnalytics}
                isLoading={isLoadingEmployeeAnalytics}
                onEdit={handleEditAnalytics}
                onDelete={handleDeleteAnalytics}
                onGenerate={handleGenerateAnalytics}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit HR Analytics Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit HR Analytics" : "Add New HR Analytics"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the HR analytics details below."
                : "Enter the details for the new HR analytics record."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="analyticsId">Analytics ID</Label>
              <Input
                id="analyticsId"
                value={currentAnalytics.AnalyticsID || ""}
                onChange={(e) => setCurrentAnalytics({ ...currentAnalytics, AnalyticsID: e.target.value })}
                placeholder="e.g. ANA-12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={currentAnalytics.EmployeeID}
                onValueChange={(value) => setCurrentAnalytics({ ...currentAnalytics, EmployeeID: value })}
                disabled={isEditing}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee._id} value={employee._id as string}>
                      {employee.FirstName} {employee.LastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reviewId">Review ID</Label>
              <Input
                id="reviewId"
                value={currentAnalytics.ReviewID || ""}
                onChange={(e) => setCurrentAnalytics({ ...currentAnalytics, ReviewID: e.target.value })}
                placeholder="e.g. REV-12345"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendanceRate">Attendance Rate (%)</Label>
              <Input
                id="attendanceRate"
                type="number"
                min="0"
                max="100"
                value={currentAnalytics.AttendanceRate || ""}
                onChange={(e) => setCurrentAnalytics({ ...currentAnalytics, AttendanceRate: e.target.value })}
                placeholder="e.g. 95"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgHoursWorked">Average Hours Worked</Label>
              <Input
                id="avgHoursWorked"
                type="number"
                step="0.01"
                min="0"
                value={currentAnalytics.AvgHoursWorked || ""}
                onChange={(e) => setCurrentAnalytics({ ...currentAnalytics, AvgHoursWorked: e.target.value })}
                placeholder="e.g. 8.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="competencyScore">Competency Score</Label>
              <Input
                id="competencyScore"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={currentAnalytics.CompentencyScore || ""}
                onChange={(e) => setCurrentAnalytics({ ...currentAnalytics, CompentencyScore: e.target.value })}
                placeholder="e.g. 3.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveAnalytics}
              disabled={
                createHrAnalyticsMutation.isPending ||
                updateHrAnalyticsMutation.isPending ||
                !currentAnalytics.EmployeeID
              }
            >
              {createHrAnalyticsMutation.isPending || updateHrAnalyticsMutation.isPending
                ? "Saving..."
                : isEditing
                  ? "Update"
                  : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
