import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { DepartmentSummary } from "@/types"
import { Star } from "lucide-react"

interface DepartmentSummaryCardProps {
  departments: DepartmentSummary[] | undefined
  isLoading: boolean
}

export function DepartmentSummaryCard({ departments, isLoading }: DepartmentSummaryCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Average ratings by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">Loading department data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!departments || departments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Average ratings by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-40">
            <p className="text-muted-foreground">No department data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Sort departments by average rating (highest first)
  const sortedDepartments = [...departments].sort(
    (a, b) => Number.parseFloat(b.averageRating) - Number.parseFloat(a.averageRating),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Performance</CardTitle>
        <CardDescription>Average ratings by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedDepartments.map((dept) => (
            <div key={dept.departmentId} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{dept.departmentId}</span>
                <div className="flex items-center">
                  <span className="mr-2">{dept.averageRating}</span>
                  <Star
                    className={`h-4 w-4 ${Number.parseFloat(dept.averageRating) >= 3 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                      }`}
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{dept.employeeCount} employees</span>
                <span>{dept.totalReviews} reviews</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${Number.parseFloat(dept.averageRating) >= 4
                      ? "bg-green-500"
                      : Number.parseFloat(dept.averageRating) >= 3
                        ? "bg-blue-500"
                        : Number.parseFloat(dept.averageRating) >= 2
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  style={{ width: `${(Number.parseFloat(dept.averageRating) / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
