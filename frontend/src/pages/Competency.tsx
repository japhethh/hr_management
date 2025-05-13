"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Plus, GraduationCap } from "lucide-react"
import { mockCompetencies, mockEmployees } from "../lib/utils"

const Competency = () => {
  const [searchTerm, setSearchTerm] = useState("")

  // Get employee name by ID
  const getEmployeeName = (employeeId: number) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "N/A"
  }

  // Filter competencies based on search term
  const filteredCompetencies = mockCompetencies.filter(
    (competency) =>
      getEmployeeName(competency.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      competency.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competency.certification.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competency Management</h1>
          <p className="text-muted-foreground">Track employee skills and certifications</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Competency
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Certifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-64 mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search competencies..."
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
                  <TableHead>Skill</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Certification</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompetencies.length > 0 ? (
                  filteredCompetencies.map((competency) => (
                    <TableRow key={competency.id}>
                      <TableCell className="font-medium">{getEmployeeName(competency.employeeId)}</TableCell>
                      <TableCell>{competency.skillName}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            competency.skillLevel === "Expert"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                              : competency.skillLevel === "Advanced"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : competency.skillLevel === "Intermediate"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {competency.skillLevel}
                        </span>
                      </TableCell>
                      <TableCell>{competency.certification}</TableCell>
                      <TableCell>{competency.certificationDate}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No competencies found.
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
            <CardTitle>Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">React</span>
                  <span className="text-sm font-medium">
                    {mockCompetencies.filter((c) => c.skillName === "React").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (mockCompetencies.filter((c) => c.skillName === "React").length / mockCompetencies.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Node.js</span>
                  <span className="text-sm font-medium">
                    {mockCompetencies.filter((c) => c.skillName === "Node.js").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (mockCompetencies.filter((c) => c.skillName === "Node.js").length / mockCompetencies.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">UI Design</span>
                  <span className="text-sm font-medium">
                    {mockCompetencies.filter((c) => c.skillName === "UI Design").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (mockCompetencies.filter((c) => c.skillName === "UI Design").length / mockCompetencies.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Project Management</span>
                  <span className="text-sm font-medium">
                    {mockCompetencies.filter((c) => c.skillName === "Project Management").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (mockCompetencies.filter((c) => c.skillName === "Project Management").length /
                          mockCompetencies.length) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Design Systems</span>
                  <span className="text-sm font-medium">
                    {mockCompetencies.filter((c) => c.skillName === "Design Systems").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{
                      width: `${
                        (mockCompetencies.filter((c) => c.skillName === "Design Systems").length /
                          mockCompetencies.length) *
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
            <CardTitle>Upcoming Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-2 rounded-md border">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">AWS Certified Solutions Architect</p>
                  <p className="text-sm text-muted-foreground">John Doe - Due in 30 days</p>
                </div>
              </div>

              <div className="flex items-center p-2 rounded-md border">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Certified Scrum Master</p>
                  <p className="text-sm text-muted-foreground">Michael Johnson - Due in 45 days</p>
                </div>
              </div>

              <div className="flex items-center p-2 rounded-md border">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Google UX Design Certificate</p>
                  <p className="text-sm text-muted-foreground">Jane Smith - Due in 60 days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Competency
