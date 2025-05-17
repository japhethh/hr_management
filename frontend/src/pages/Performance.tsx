"use client"

import { useState, useEffect } from "react"
import { usePerformanceReview } from "@/hooks/usePerformanceReview"
import { useEmployee } from "@/hooks/useEmployee"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerformanceReviewTable } from "@/components/PerformanceReviewTable"
import { RatingDistributionCard } from "@/components/RatingDistributionCard"
import { DepartmentSummaryCard } from "@/components/DepartmentSummaryCard"
import { PlusIcon, Search, CalendarIcon, BarChart2Icon, UsersIcon, UserIcon } from "lucide-react"
import type { PerformanceReview } from "@/types"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { performanceReviewApi } from "@/api/performanceReview.api"

export default function Performance() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentReview, setCurrentReview] = useState<Partial<PerformanceReview>>({
    OverallRating: "3",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("reviews")

  // Get employees
  const { getEmployeeQuery } = useEmployee()
  const { data: employees = [] } = getEmployeeQuery

  // Get performance review data
  const {
    getPerformanceReviewsQuery,
    getPerformanceReviewStatsQuery,
    getDepartmentReviewSummaryQuery,
    createPerformanceReviewMutation,
    updatePerformanceReviewMutation,
    deletePerformanceReviewMutation,
  } = usePerformanceReview()

  // Get all performance reviews
  const { data: allReviews = [], isLoading: isLoadingAllReviews } = getPerformanceReviewsQuery

  // Get performance reviews for selected employee
  const { data: employeeReviews = [], isLoading: isLoadingEmployeeReviews } = useQuery({
    queryKey: ["performance-review", "employee", selectedEmployeeId],
    queryFn: () => performanceReviewApi.getPerformanceReviewsByEmployeeId(selectedEmployeeId),
    enabled: selectedEmployeeId !== "all",
  })

  // Get performance reviews for selected period
  const { data: periodReviews = [], isLoading: isLoadingPeriodReviews } = useQuery({
    queryKey: ["performance-review", "period", periodStart, periodEnd],
    queryFn: () => performanceReviewApi.getPerformanceReviewsByPeriod(periodStart, periodEnd),
    enabled: !!(periodStart && periodEnd),
  })

  // Get performance review stats
  const { data: reviewStats, isLoading: isLoadingReviewStats } = getPerformanceReviewStatsQuery

  // Get employee review summary
  const { data: employeeSummary, isLoading: isLoadingEmployeeSummary } = useQuery({
    queryKey: ["performance-review", "employee-summary", selectedEmployeeId],
    queryFn: () => performanceReviewApi.getEmployeeReviewSummary(selectedEmployeeId),
    enabled: selectedEmployeeId !== "all",
  })

  // Get department review summary
  const { data: departmentSummary = [], isLoading: isLoadingDepartmentSummary } = getDepartmentReviewSummaryQuery

  // Filter reviews based on search term
  const filteredReviews = (
    activeTab === "employee" ? employeeReviews : activeTab === "period" ? periodReviews : allReviews
  ).filter((review: PerformanceReview) => {
    if (searchTerm === "") return true

    const employee = employees.find((emp) => emp._id === review.EmployeeID)
    const employeeName = employee ? `${employee.FirstName} ${employee.LastName}`.toLowerCase() : ""

    return (
      review.ReviewID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeName.includes(searchTerm.toLowerCase()) ||
      review.Comments.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.Strengths.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.AreasForImprovement.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Handle creating/updating a performance review
  const handleSaveReview = () => {
    if (!currentReview.EmployeeID) {
      alert("Please select an employee")
      return
    }

    if (!currentReview.ReviewPeriodStart || !currentReview.ReviewPeriodEnd) {
      alert("Please enter review period dates")
      return
    }

    if (isEditing && currentReview._id) {
      updatePerformanceReviewMutation.mutate({
        id: currentReview._id,
        reviewData: currentReview,
      })
    } else {
      createPerformanceReviewMutation.mutate(currentReview as PerformanceReview)
    }

    // Close dialog and reset form
    setIsDialogOpen(false)
    setCurrentReview({
      OverallRating: "3",
    })
    setIsEditing(false)
  }

  // Handle editing a performance review
  const handleEditReview = (review: PerformanceReview) => {
    setCurrentReview({
      ...review,
      ReviewPeriodStart: review.ReviewPeriodStart.split("T")[0],
      ReviewPeriodEnd: review.ReviewPeriodEnd.split("T")[0],
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle deleting a performance review
  const handleDeleteReview = (id: string) => {
    if (confirm("Are you sure you want to delete this performance review?")) {
      deletePerformanceReviewMutation.mutate(id)
    }
  }

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp._id === employeeId)
    return employee ? `${employee.FirstName} ${employee.LastName}` : "Unknown Employee"
  }

  // Reset period filters when tab changes
  useEffect(() => {
    if (activeTab !== "period") {
      setPeriodStart("")
      setPeriodEnd("")
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Reviews</h1>
          <p className="text-muted-foreground">Manage and track employee performance reviews</p>
        </div>
        <Button
          onClick={() => {
            setCurrentReview({ OverallRating: "3" })
            setIsEditing(false)
            setIsDialogOpen(true)
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> New Review
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Reviews</CardTitle>
            <CardDescription>Overall performance review count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{reviewStats?.totalReviews || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Rating</CardTitle>
            <CardDescription>Overall performance score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-4xl font-bold mr-2">{reviewStats?.averageRating || "0"}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${Number.parseFloat(reviewStats?.averageRating || "0") >= star
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <RatingDistributionCard stats={reviewStats} isLoading={isLoadingReviewStats} />
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Reviews</CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="searchFilter">Search Reviews</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="searchFilter"
                  placeholder="Search by ID, employee, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="reviews" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reviews">
            <BarChart2Icon className="mr-2 h-4 w-4" />
            All Reviews
          </TabsTrigger>
          <TabsTrigger value="employee" disabled={selectedEmployeeId === "all"}>
            <UserIcon className="mr-2 h-4 w-4" />
            Employee Summary
          </TabsTrigger>
          <TabsTrigger value="period">
            <CalendarIcon className="mr-2 h-4 w-4" />
            By Period
          </TabsTrigger>
          <TabsTrigger value="departments">
            <UsersIcon className="mr-2 h-4 w-4" />
            Departments
          </TabsTrigger>
        </TabsList>

        {/* All Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <PerformanceReviewTable
                reviews={filteredReviews}
                isLoading={isLoadingAllReviews}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                getEmployeeName={getEmployeeName}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Summary Tab */}
        <TabsContent value="employee" className="space-y-4">
          {selectedEmployeeId !== "all" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Employee Summary</CardTitle>
                  <CardDescription>{getEmployeeName(selectedEmployeeId)}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingEmployeeSummary ? (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-muted-foreground">Loading employee summary...</p>
                    </div>
                  ) : employeeSummary ? (
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Reviews:</span>
                        <span className="font-medium">{employeeSummary.totalReviews}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average Rating:</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{employeeSummary.averageRating}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`h-4 w-4 ${Number.parseFloat(employeeSummary.averageRating) >= star
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                                  }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      {employeeSummary.latestReview && (
                        <>
                          <div className="pt-4 border-t">
                            <h4 className="font-medium mb-2">Latest Review</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Period:</span>
                                <span>
                                  {format(new Date(employeeSummary.latestReview.ReviewPeriodStart), "MMM d, yyyy")} -{" "}
                                  {format(new Date(employeeSummary.latestReview.ReviewPeriodEnd), "MMM d, yyyy")}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Rating:</span>
                                <span>{employeeSummary.latestReview.OverallRating}</span>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground block mb-1">Strengths:</span>
                                <p className="text-sm">{employeeSummary.latestReview.Strengths}</p>
                              </div>
                              <div className="text-sm">
                                <span className="text-muted-foreground block mb-1">Areas for Improvement:</span>
                                <p className="text-sm">{employeeSummary.latestReview.AreasForImprovement}</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-muted-foreground">No summary data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rating Trend</CardTitle>
                  <CardDescription>Performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingEmployeeSummary ? (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-muted-foreground">Loading trend data...</p>
                    </div>
                  ) : employeeSummary && employeeSummary.ratingTrend.length > 0 ? (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={employeeSummary.ratingTrend}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="period" />
                          <YAxis domain={[0, 5]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="rating" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-muted-foreground">No trend data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardContent className="p-0">
              <PerformanceReviewTable
                reviews={filteredReviews}
                isLoading={isLoadingEmployeeReviews}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                getEmployeeName={getEmployeeName}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Period Tab */}
        <TabsContent value="period" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Filter by Review Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="periodStart">Period Start</Label>
                  <Input
                    id="periodStart"
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="periodEnd">Period End</Label>
                  <Input id="periodEnd" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <PerformanceReviewTable
                reviews={filteredReviews}
                isLoading={isLoadingPeriodReviews}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                getEmployeeName={getEmployeeName}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-4">
          <DepartmentSummaryCard departments={departmentSummary} isLoading={isLoadingDepartmentSummary} />

          <Card>
            <CardHeader>
              <CardTitle>Department Comparison</CardTitle>
              <CardDescription>Average ratings by department</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingDepartmentSummary ? (
                <div className="flex justify-center items-center h-64">
                  <p className="text-muted-foreground">Loading department data...</p>
                </div>
              ) : departmentSummary.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={departmentSummary.map((dept) => ({
                        name: dept.departmentId,
                        rating: Number.parseFloat(dept.averageRating),
                        employees: dept.employeeCount,
                        reviews: dept.totalReviews,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-muted-foreground">No department data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Performance Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Performance Review" : "Create New Performance Review"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the performance review details below."
                : "Enter the details for the new performance review."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={currentReview.EmployeeID as string}
                onValueChange={(value) => setCurrentReview({ ...currentReview, EmployeeID: value })}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="periodStart">Period Start</Label>
                <Input
                  id="periodStart"
                  type="date"
                  value={currentReview.ReviewPeriodStart || ""}
                  onChange={(e) => setCurrentReview({ ...currentReview, ReviewPeriodStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodEnd">Period End</Label>
                <Input
                  id="periodEnd"
                  type="date"
                  value={currentReview.ReviewPeriodEnd || ""}
                  onChange={(e) => setCurrentReview({ ...currentReview, ReviewPeriodEnd: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Overall Rating</Label>
              <Select
                value={currentReview.OverallRating}
                onValueChange={(value) => setCurrentReview({ ...currentReview, OverallRating: value })}
              >
                <SelectTrigger id="rating">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Below Average</SelectItem>
                  <SelectItem value="3">3 - Average</SelectItem>
                  <SelectItem value="4">4 - Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="strengths">Strengths</Label>
              <Textarea
                id="strengths"
                value={currentReview.Strengths || ""}
                onChange={(e) => setCurrentReview({ ...currentReview, Strengths: e.target.value })}
                placeholder="Employee's key strengths and achievements"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="improvements">Areas for Improvement</Label>
              <Textarea
                id="improvements"
                value={currentReview.AreasForImprovement || ""}
                onChange={(e) => setCurrentReview({ ...currentReview, AreasForImprovement: e.target.value })}
                placeholder="Areas where the employee can improve"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                value={currentReview.Comments || ""}
                onChange={(e) => setCurrentReview({ ...currentReview, Comments: e.target.value })}
                placeholder="Any additional comments or feedback"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveReview}
              disabled={
                createPerformanceReviewMutation.isPending ||
                updatePerformanceReviewMutation.isPending ||
                !currentReview.EmployeeID ||
                !currentReview.ReviewPeriodStart ||
                !currentReview.ReviewPeriodEnd
              }
            >
              {createPerformanceReviewMutation.isPending || updatePerformanceReviewMutation.isPending
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
