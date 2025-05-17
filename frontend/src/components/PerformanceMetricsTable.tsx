"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import type { EmployeePerformanceMetric } from "@/types"

interface PerformanceMetricsTableProps {
  metrics: EmployeePerformanceMetric[]
  isLoading: boolean
}

export const PerformanceMetricsTable: React.FC<PerformanceMetricsTableProps> = ({ metrics, isLoading }) => {
  // Helper function to render progress bar
  const renderProgressBar = (value: number, color: string) => {
    return (
      <div className="w-full">
        <div className="flex justify-between mb-1 text-xs">
          <span>{value.toFixed(2)}</span>
        </div>
        <Progress value={value} className={`h-2 ${color}`} />
      </div>
    )
  }

  // Helper function to determine performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Average"
    if (score >= 20) return "Below Average"
    return "Poor"
  }

  // Helper function to get performance level color
  const getPerformanceLevelColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-blue-600"
    if (score >= 40) return "text-yellow-600"
    if (score >= 20) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Attendance Rate</TableHead>
          <TableHead>Avg Hours Worked</TableHead>
          <TableHead>Competency Score</TableHead>
          <TableHead>Overall Score</TableHead>
          <TableHead>Performance Level</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              Loading performance metrics...
            </TableCell>
          </TableRow>
        ) : metrics.length > 0 ? (
          metrics.map((metric) => (
            <TableRow key={metric.employeeId}>
              <TableCell className="font-medium">{metric.employeeName}</TableCell>
              <TableCell>{metric.department}</TableCell>
              <TableCell className="w-32">{renderProgressBar(metric.attendanceRate, "bg-green-500")}</TableCell>
              <TableCell>{metric.avgHoursWorked.toFixed(2)}</TableCell>
              <TableCell className="w-32">{renderProgressBar(metric.competencyScore, "bg-blue-500")}</TableCell>
              <TableCell className="w-32">{renderProgressBar(metric.overallScore, "bg-purple-500")}</TableCell>
              <TableCell className={`font-medium ${getPerformanceLevelColor(metric.overallScore)}`}>
                {getPerformanceLevel(metric.overallScore)}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No performance metrics found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
