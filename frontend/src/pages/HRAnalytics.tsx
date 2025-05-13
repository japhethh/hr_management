import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { mockHRAnalytics, mockEmployees } from "../lib/utils"

const HRAnalytics = () => {
  // Get employee name by ID
  const getEmployeeName = (employeeId: number) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "N/A"
  }

  // Calculate average metrics
  const avgAttendanceRate = mockHRAnalytics.reduce((acc, item) => acc + item.attendanceRate, 0) / mockHRAnalytics.length
  const avgHoursWorked = mockHRAnalytics.reduce((acc, item) => acc + item.avgHoursWorked, 0) / mockHRAnalytics.length
  const avgCompetencyScore =
    mockHRAnalytics.reduce((acc, item) => acc + item.competencyScore, 0) / mockHRAnalytics.length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">HR Analytics</h1>
        <p className="text-muted-foreground">Insights and metrics for HR management</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgAttendanceRate * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average employee attendance rate</p>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${avgAttendanceRate * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Hours Worked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgHoursWorked.toFixed(1)} hours</div>
            <p className="text-xs text-muted-foreground">Average daily working hours</p>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${(avgHoursWorked / 10) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Competency Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompetencyScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Average employee competency rating</p>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${(avgCompetencyScore / 5) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Performance Metrics</CardTitle>
          <CardDescription>Detailed analytics for each employee</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Avg Hours Worked</TableHead>
                <TableHead>Competency Score</TableHead>
                <TableHead>Performance Index</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockHRAnalytics.map((analytics) => {
                // Calculate a simple performance index
                const performanceIndex =
                  (analytics.attendanceRate * 0.3 +
                    (analytics.avgHoursWorked / 10) * 0.3 +
                    (analytics.competencyScore / 5) * 0.4) *
                  100

                return (
                  <TableRow key={analytics.id}>
                    <TableCell className="font-medium">{getEmployeeName(analytics.employeeId)}</TableCell>
                    <TableCell>{(analytics.attendanceRate * 100).toFixed(1)}%</TableCell>
                    <TableCell>{analytics.avgHoursWorked.toFixed(1)} hours</TableCell>
                    <TableCell>{analytics.competencyScore.toFixed(1)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full mr-4">
                          <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className={`h-2 rounded-full ${
                                performanceIndex >= 80
                                  ? "bg-green-500"
                                  : performanceIndex >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${performanceIndex}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{performanceIndex.toFixed(1)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Average performance by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between">
              <div className="flex flex-col items-center">
                <div className="h-[160px] w-12 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Engineering</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[140px] w-12 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Design</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[100px] w-12 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Marketing</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[120px] w-12 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">HR</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[130px] w-12 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Finance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Monthly attendance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end justify-between">
              <div className="flex flex-col items-center">
                <div className="h-[160px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Jan</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[150px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Feb</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[170px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Mar</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[140px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Apr</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[130px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">May</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[120px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Jun</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[110px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Jul</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[140px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Aug</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[150px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Sep</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[160px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Oct</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[150px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Nov</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-[140px] w-8 bg-primary rounded-t-md"></div>
                <span className="mt-2 text-xs">Dec</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HRAnalytics
