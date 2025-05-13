"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Plus, Star, StarHalf } from "lucide-react"
import { mockPerformanceReviews, mockEmployees } from "../lib/utils"

const Performance = () => {
  const [searchTerm, setSearchTerm] = useState("")

  // Get employee name by ID
  const getEmployeeName = (employeeId: number) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "N/A"
  }

  // Get reviewer name by ID
  const getReviewerName = (reviewerId: number) => {
    const reviewer = mockEmployees.find((emp) => emp.id === reviewerId)
    return reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : "N/A"
  }

  // Filter performance reviews based on search term
  const filteredReviews = mockPerformanceReviews.filter(
    (review) =>
      getEmployeeName(review.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getReviewerName(review.reviewerId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Render stars based on rating
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-2 text-sm">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
          <p className="text-muted-foreground">Track and manage employee performance reviews</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-64 mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search reviews..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Review Period</TableHead>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">{getEmployeeName(review.employeeId)}</TableCell>
                      <TableCell>
                        {review.reviewPeriodStart} to {review.reviewPeriodEnd}
                      </TableCell>
                      <TableCell>{getReviewerName(review.reviewerId)}</TableCell>
                      <TableCell>{renderRating(review.overallRating)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No performance reviews found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Average Rating</span>
                  <span className="text-sm font-medium">
                    {(
                      filteredReviews.reduce((acc, review) => acc + review.overallRating, 0) /
                      (filteredReviews.length || 1)
                    ).toFixed(1)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (filteredReviews.reduce((acc, review) => acc + review.overallRating, 0) /
                          (filteredReviews.length || 1)) *
                        20
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Reviews Completed</span>
                  <span className="text-sm font-medium">
                    {filteredReviews.length} / {mockEmployees.length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${(filteredReviews.length / mockEmployees.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">High Performers</span>
                  <span className="text-sm font-medium">
                    {filteredReviews.filter((review) => review.overallRating >= 4.5).length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (filteredReviews.filter((review) => review.overallRating >= 4.5).length /
                          (filteredReviews.length || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-2 rounded-md border">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Robert Brown</p>
                  <p className="text-sm text-muted-foreground">Due in 5 days</p>
                </div>
              </div>

              <div className="flex items-center p-2 rounded-md border">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Michael Johnson</p>
                  <p className="text-sm text-muted-foreground">Due in 12 days</p>
                </div>
              </div>

              <div className="flex items-center p-2 rounded-md border">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Emily Williams</p>
                  <p className="text-sm text-muted-foreground">Due in 15 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Performance
