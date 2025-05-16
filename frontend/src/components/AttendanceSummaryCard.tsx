import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AttendanceSummary } from "@/types"

interface AttendanceSummaryCardProps {
  summary: AttendanceSummary
  isLoading: boolean
  title?: string
  description?: string
}

export const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  summary,
  isLoading,
  title = "Attendance Summary",
  description = "Overview of employee attendance records",
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Loading attendance summary...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span className="text-3xl font-bold">{summary.total}</span>
            <span className="text-sm text-muted-foreground">Total Records</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">{summary.present}</span>
            <span className="text-sm text-muted-foreground">Present</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <span className="text-3xl font-bold text-red-600 dark:text-red-400">{summary.absent}</span>
            <span className="text-sm text-muted-foreground">Absent</span>
          </div>

          <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summary.leave}</span>
            <span className="text-sm text-muted-foreground">On Leave</span>
          </div>

          {summary.late > 0 && (
            <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{summary.late}</span>
              <span className="text-sm text-muted-foreground">Late</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
