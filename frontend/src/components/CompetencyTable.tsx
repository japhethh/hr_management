"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Competency, Employee } from "@/types"
import { formatDate } from "@/lib/utils"

interface CompetencyTableProps {
  competencies: Competency[]
  isLoading: boolean
  onEdit?: (competency: Competency) => void
  onDelete?: (id: string) => void
}

export const CompetencyTable: React.FC<CompetencyTableProps> = ({ competencies, isLoading, onEdit, onDelete }) => {
  // Helper function to get employee name
  const getEmployeeName = (employee: string | Employee | undefined | null): string => {
    if (!employee) return "Unknown Employee"
    if (typeof employee === "string") return employee

    // Check if FirstName and LastName properties exist
    if (employee.FirstName && employee.LastName) {
      return `${employee.FirstName} ${employee.LastName}`
    }

    // If only one name property exists
    if (employee.FirstName) return employee.FirstName
    if (employee.LastName) return employee.LastName

    // If we have an _id, use that
    if (employee._id) return employee._id.toString()

    // Fallback
    return "Unknown Employee"
  }

  // Render skill level badge
  const renderSkillLevelBadge = (skillLevel: string) => {
    let badgeClass = ""

    switch (skillLevel) {
      case "Beginner":
        badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        break
      case "Intermediate":
        badgeClass = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        break
      case "Advanced":
        badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        break
      case "Expert":
        badgeClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
        break
      default:
        badgeClass = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }

    return <Badge className={badgeClass}>{skillLevel}</Badge>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Skill</TableHead>
          <TableHead>Level</TableHead>
          <TableHead>Certification</TableHead>
          <TableHead>Certification Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              Loading competency records...
            </TableCell>
          </TableRow>
        ) : competencies.length > 0 ? (
          competencies.map((competency) => (
            <TableRow key={competency._id}>
              <TableCell className="font-medium">{getEmployeeName(competency.EmployeeID)}</TableCell>
              <TableCell>{competency.SkillName}</TableCell>
              <TableCell>{renderSkillLevelBadge(competency.SkillLevel)}</TableCell>
              <TableCell>{competency.Certification || "N/A"}</TableCell>
              <TableCell>{competency.CertificationDate ? formatDate(competency.CertificationDate) : "N/A"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(competency)}>
                      Edit
                    </Button>
                  )}
                  {onDelete && competency._id && (
                    <Button variant="destructive" size="sm" onClick={() => onDelete(competency._id as string)}>
                      Delete
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No competency records found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
