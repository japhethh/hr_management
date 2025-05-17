import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { DepartmentPerformanceMetric } from "@/types"

interface DepartmentPerformanceCardProps {
  metrics: DepartmentPerformanceMetric[]
  isLoading: boolean
  title?: string
  description?: string
}

export const DepartmentPerformanceCard: React.FC<DepartmentPerformanceCardProps> = ({
  metrics,
  isLoading,
  title = "Department Performance",
  description = "Overview of department performance metrics",
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
            <p className="text-muted-foreground">Loading department performance metrics...</p>
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
        <div className="space-y-6">
          {metrics.map((dept) => (
            <div key={dept.department} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{dept.department}</h3>
                  <p className="text-xs text-muted-foreground">{dept.employeeCount} employees</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Avg Score:{" "}
                    {(
                      (Number.parseFloat(dept.avgAttendanceRate) +
                        Number.parseFloat(dept.avgHoursWorked) +
                        Number.parseFloat(dept.avgCompetencyScore)) /
                      3
                    ).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Attendance Rate</span>
                  <span>{dept.avgAttendanceRate}%</span>
                </div>
                <Progress value={Number.parseFloat(dept.avgAttendanceRate)} className="h-1 bg-green-100" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Avg Hours Worked</span>
                  <span>{dept.avgHoursWorked}</span>
                </div>
                <Progress value={Number.parseFloat(dept.avgHoursWorked) * 10} className="h-1 bg-blue-100" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Competency Score</span>
                  <span>{dept.avgCompetencyScore}</span>
                </div>
                <Progress value={Number.parseFloat(dept.avgCompetencyScore) * 25} className="h-1 bg-purple-100" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
