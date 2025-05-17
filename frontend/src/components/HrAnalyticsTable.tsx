"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { HrAnalytics } from "@/types"

interface HrAnalyticsTableProps {
  analytics: HrAnalytics[]
  isLoading: boolean
  onEdit?: (analytics: HrAnalytics) => void
  onDelete?: (id: string) => void
  onGenerate?: (employeeId: string) => void
}

export const HrAnalyticsTable: React.FC<HrAnalyticsTableProps> = ({
  analytics,
  isLoading,
  onEdit,
  onDelete,
  onGenerate,
}) => {
  // Helper function to render progress bar
  const renderProgressBar = (value: string, color: string) => {
    const numericValue = Number.parseFloat(value)
    return (
      <div className="w-full">
        <div className="flex justify-between mb-1 text-xs">
          <span>{value}%</span>
        </div>
        <Progress value={numericValue} className={`h-2 ${color}`} />
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Analytics ID</TableHead>
          <TableHead>Employee ID</TableHead>
          <TableHead>Review ID</TableHead>
          <TableHead>Attendance Rate</TableHead>
          <TableHead>Avg Hours Worked</TableHead>
          <TableHead>Competency Score</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Loading HR analytics records...
            </TableCell>
          </TableRow>
        ) : analytics.length > 0 ? (
          analytics.map((record) => (
            <TableRow key={record._id}>
              <TableCell className="font-medium">{record.AnalyticsID}</TableCell>
              <TableCell>{record.EmployeeID}</TableCell>
              <TableCell>{record.ReviewID}</TableCell>
              <TableCell className="w-32">{renderProgressBar(record.AttendanceRate, "bg-green-500")}</TableCell>
              <TableCell>{record.AvgHoursWorked}</TableCell>
              <TableCell className="w-32">{renderProgressBar(record.CompentencyScore, "bg-blue-500")}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(record)}>
                      Edit
                    </Button>
                  )}
                  {onGenerate && (
                    <Button variant="outline" size="sm" onClick={() => onGenerate(record.EmployeeID)}>
                      Regenerate
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
              No HR analytics records found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
