"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Star } from "lucide-react"
import type { PerformanceReview } from "@/types"
import { format } from "date-fns"

interface PerformanceReviewTableProps {
  reviews: PerformanceReview[]
  isLoading: boolean
  onEdit: (review: PerformanceReview) => void
  onDelete: (id: string) => void
  getEmployeeName: (employeeId: string) => string
}

export function PerformanceReviewTable({
  reviews,
  isLoading,
  onEdit,
  onDelete,
  getEmployeeName,
}: PerformanceReviewTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">Loading performance reviews...</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">No performance reviews found.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Review ID</TableHead>
          <TableHead>Employee</TableHead>
          <TableHead>Review Period</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review._id}>
            <TableCell className="font-medium">{review.ReviewID}</TableCell>
            <TableCell>{getEmployeeName(review.EmployeeID)}</TableCell>
            <TableCell>
              {format(new Date(review.ReviewPeriodStart), "MMM d, yyyy")} -{" "}
              {format(new Date(review.ReviewPeriodEnd), "MMM d, yyyy")}
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Star
                  className={`h-4 w-4 mr-1 ${
                    Number.parseFloat(review.OverallRating) >= 3 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                  }`}
                />
                <span>{review.OverallRating}</span>
              </div>
            </TableCell>
            <TableCell className="max-w-xs truncate">{review.Comments}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(review)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(review._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
