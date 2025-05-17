"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { useCompetency } from "@/hooks/useCompetency"
import { useEmployee } from "@/hooks/useEmployee"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompetencyTable } from "@/components/CompetencyTable"
import { SkillDistributionCard } from "@/components/SkillDistributionCard"
import { PlusIcon, UserIcon, BarChartIcon, AwardIcon } from "lucide-react"
import type { Competency } from "@/types"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CompetencyPage() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("all")
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentCompetency, setCurrentCompetency] = useState<Partial<Competency>>({
    SkillLevel: "Beginner",
  })
  const [isEditing, setIsEditing] = useState(false)

  // Get employees
  const { getEmployeeQuery } = useEmployee()
  const { data: employees = [] } = getEmployeeQuery

  // Get competency data
  const {
    getCompetenciesQuery,
    getCompetenciesByEmployeeIdQuery,
    getCompetenciesBySkillLevelQuery,
    getSkillDistributionQuery,
    getTopSkillsQuery,
    getCertificationStatsQuery,
    createCompetencyMutation,
    updateCompetencyMutation,
    deleteCompetencyMutation,
  } = useCompetency()

  // Get all competency records
  const { data: allCompetencies = [], isLoading: isLoadingAllCompetencies } = getCompetenciesQuery

  // Get competency records for selected employee
  const { data: employeeCompetencies = [], isLoading: isLoadingEmployeeCompetencies } =
    getCompetenciesByEmployeeIdQuery(selectedEmployeeId)

  // Get competency records for selected skill level
  const { data: skillLevelCompetencies = [], isLoading: isLoadingSkillLevelCompetencies } =
    getCompetenciesBySkillLevelQuery(selectedSkillLevel !== "all" ? selectedSkillLevel : "")

  // Get skill distribution
  const {
    data: skillDistribution = { Beginner: 0, Intermediate: 0, Advanced: 0, Expert: 0 },
    isLoading: isLoadingSkillDistribution,
  } = getSkillDistributionQuery

  // Get top skills
  const { data: topSkills = [], isLoading: isLoadingTopSkills } = getTopSkillsQuery(5)

  // Get certification stats
  const {
    data: certificationStats = { totalEmployees: 0, withCertification: 0, certificationRate: 0 },
    isLoading: isLoadingCertificationStats,
  } = getCertificationStatsQuery

  // Handle creating/updating a competency record
  const handleSaveCompetency = () => {
    if (!currentCompetency.EmployeeID) {
      alert("Please select an employee")
      return
    }

    if (!currentCompetency.SkillName) {
      alert("Please enter a skill name")
      return
    }

    if (isEditing && currentCompetency._id) {
      updateCompetencyMutation.mutate({
        id: currentCompetency._id,
        competencyData: currentCompetency,
      })
    } else {
      createCompetencyMutation.mutate(currentCompetency as Competency)
    }

    // Close dialog and reset form
    setIsDialogOpen(false)
    setCurrentCompetency({
      SkillLevel: "Beginner",
    })
    setIsEditing(false)
  }

  // Handle editing a competency record
  const handleEditCompetency = (competency: Competency) => {
    setCurrentCompetency({
      ...competency,
      EmployeeID: typeof competency.EmployeeID === "string" ? competency.EmployeeID : competency.EmployeeID._id,
      CertificationDate: competency.CertificationDate
        ? typeof competency.CertificationDate === "string"
          ? competency.CertificationDate.split("T")[0]
          : format(new Date(competency.CertificationDate), "yyyy-MM-dd")
        : undefined,
    })
    setIsEditing(true)
    setIsDialogOpen(true)
  }

  // Handle deleting a competency record
  const handleDeleteCompetency = (id: string) => {
    if (confirm("Are you sure you want to delete this competency record?")) {
      deleteCompetencyMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competency Management</h1>
          <p className="text-muted-foreground">Track and manage employee skills and certifications</p>
        </div>
        <Button
          onClick={() => {
            setCurrentCompetency({ SkillLevel: "Beginner" })
            setIsEditing(false)
            setIsDialogOpen(true)
          }}
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add Competency
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkillDistributionCard distribution={skillDistribution} isLoading={isLoadingSkillDistribution} />

        <Card>
          <CardHeader>
            <CardTitle>Top Skills</CardTitle>
            <CardDescription>Most common skills in the organization</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingTopSkills ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-muted-foreground">Loading top skills...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topSkills.map((skill) => (
                  <div key={skill._id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill._id}</span>
                      <span>{skill.count} employees</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${(skill.count / (topSkills[0]?.count || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certification Overview</CardTitle>
            <CardDescription>Employee certification statistics</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCertificationStats ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-muted-foreground">Loading certification stats...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 space-y-4">
                <div className="text-5xl font-bold text-indigo-600">
                  {Math.round(certificationStats.certificationRate)}%
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  {certificationStats.withCertification} out of {certificationStats.totalEmployees} employees have
                  certifications
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Competencies</CardTitle>
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
              <Label htmlFor="skillLevelFilter">Filter by Skill Level</Label>
              <Select value={selectedSkillLevel} onValueChange={setSelectedSkillLevel}>
                <SelectTrigger id="skillLevelFilter">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competency Records */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            <BarChartIcon className="mr-2 h-4 w-4" />
            All Competencies
          </TabsTrigger>
          <TabsTrigger value="by-employee" disabled={selectedEmployeeId === "all"}>
            <UserIcon className="mr-2 h-4 w-4" />
            By Employee
          </TabsTrigger>
          <TabsTrigger value="by-skill-level" disabled={selectedSkillLevel === "all"}>
            <AwardIcon className="mr-2 h-4 w-4" />
            By Skill Level
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <CompetencyTable
                competencies={allCompetencies}
                isLoading={isLoadingAllCompetencies}
                onEdit={handleEditCompetency}
                onDelete={handleDeleteCompetency}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-employee" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <CompetencyTable
                competencies={employeeCompetencies}
                isLoading={isLoadingEmployeeCompetencies}
                onEdit={handleEditCompetency}
                onDelete={handleDeleteCompetency}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-skill-level" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <CompetencyTable
                competencies={skillLevelCompetencies}
                isLoading={isLoadingSkillLevelCompetencies}
                onEdit={handleEditCompetency}
                onDelete={handleDeleteCompetency}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Competency Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Competency" : "Add New Competency"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the competency details below." : "Enter the details for the new competency record."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee</Label>
              <Select
                value={currentCompetency.EmployeeID as string}
                onValueChange={(value) => setCurrentCompetency({ ...currentCompetency, EmployeeID: value })}
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

            <div className="space-y-2">
              <Label htmlFor="skillName">Skill Name</Label>
              <Input
                id="skillName"
                value={currentCompetency.SkillName || ""}
                onChange={(e) => setCurrentCompetency({ ...currentCompetency, SkillName: e.target.value })}
                placeholder="e.g. JavaScript, Project Management, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skillLevel">Skill Level</Label>
              <Select
                value={currentCompetency.SkillLevel}
                onValueChange={(value) =>
                  setCurrentCompetency({
                    ...currentCompetency,
                    SkillLevel: value as "Beginner" | "Intermediate" | "Advanced" | "Expert",
                  })
                }
              >
                <SelectTrigger id="skillLevel">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certification">Certification (Optional)</Label>
              <Input
                id="certification"
                value={currentCompetency.Certification || ""}
                onChange={(e) => setCurrentCompetency({ ...currentCompetency, Certification: e.target.value })}
                placeholder="e.g. AWS Certified Developer, PMP, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificationDate">Certification Date (Optional)</Label>
              <Input
                id="certificationDate"
                type="date"
                value={
                  currentCompetency.CertificationDate
                    ? typeof currentCompetency.CertificationDate === "string"
                      ? currentCompetency.CertificationDate
                      : format(new Date(currentCompetency.CertificationDate), "yyyy-MM-dd")
                    : ""
                }
                onChange={(e) => setCurrentCompetency({ ...currentCompetency, CertificationDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCompetency}
              disabled={
                createCompetencyMutation.isPending ||
                updateCompetencyMutation.isPending ||
                !currentCompetency.EmployeeID ||
                !currentCompetency.SkillName
              }
            >
              {createCompetencyMutation.isPending || updateCompetencyMutation.isPending
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
