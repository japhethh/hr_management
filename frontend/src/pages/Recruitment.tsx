"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardContent } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Plus, FileText, User, Briefcase, Calendar, Clock } from "lucide-react"
import { mockJobPostings, mockJobApplications, mockDepartments } from "../lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"

// Define interfaces
interface JobPosting {
  id: number
  title: string
  departmentId: number
  description: string
  requirements: string
  postedDate: string
  status: string
}

interface JobApplication {
  id: number
  jobPostingId: number
  applicantName: string
  applicantEmail: string
  resumeLink: string
  applicationDate: string
  status: string
  hiredEmployeeId: number | null
}

// Default new job posting
const defaultNewJobPosting: Partial<JobPosting> = {
  title: "",
  departmentId: 1,
  description: "",
  requirements: "",
  postedDate: new Date().toISOString().split("T")[0],
  status: "Open",
}

const Recruitment = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogState, setDialogState] = useState({
    addJobPosting: false,
    viewResume: false,
  })
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [newJobPosting, setNewJobPosting] = useState<Partial<JobPosting>>({ ...defaultNewJobPosting })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setNewJobPosting((prev) => ({ ...prev, [id]: value }))
  }

  // Filter job postings based on search term
  const filteredJobPostings = mockJobPostings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Filter job applications based on search term
  const filteredJobApplications = mockJobApplications.filter(
    (app) =>
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Get department name by ID
  const getDepartmentName = (departmentId: number) => {
    const department = mockDepartments.find((dept) => dept.id === departmentId)
    return department ? department.departmentName : "N/A"
  }

  // Get job title by ID
  const getJobTitle = (jobPostingId: number) => {
    const job = mockJobPostings.find((job) => job.id === jobPostingId)
    return job ? job.title : "N/A"
  }

  // Dialog control functions
  const openDialog = (type: "addJobPosting" | "viewResume", application?: JobApplication) => {
    if (application) {
      setSelectedApplication(application)
    }
    setDialogState({ ...dialogState, [type]: true })
  }

  const closeDialog = (type: "addJobPosting" | "viewResume") => {
    setDialogState({ ...dialogState, [type]: false })
    if (type === "addJobPosting") {
      setNewJobPosting({ ...defaultNewJobPosting })
    }
  }

  // Handle adding a new job posting
  const handleAddJobPosting = () => {
    // In a real app, this would make an API call to add the job posting
    console.log("Adding job posting:", newJobPosting)
    closeDialog("addJobPosting")
  }

  // Render status badge for job postings
  const renderJobStatusBadge = (status: string) => (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "Open"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      }`}
    >
      {status}
    </span>
  )

  // Render status badge for applications
  const renderApplicationStatusBadge = (status: string) => (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === "Hired"
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
          : status === "Interviewed"
            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            : status === "Rejected"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      }`}
    >
      {status}
    </span>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment</h1>
          <p className="text-muted-foreground">Manage job postings and applications</p>
        </div>
      </div>

      <Tabs defaultValue="job-postings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="job-postings">
            <Briefcase className="mr-2 h-4 w-4" />
            Job Postings
          </TabsTrigger>
          <TabsTrigger value="applications">
            <FileText className="mr-2 h-4 w-4" />
            Applications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="job-postings" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search job postings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => openDialog("addJobPosting")}>
              <Plus className="mr-2 h-4 w-4" /> Add Job Posting
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Posted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Applications</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobPostings.length > 0 ? (
                    filteredJobPostings.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{getDepartmentName(job.departmentId)}</TableCell>
                        <TableCell>{job.postedDate}</TableCell>
                        <TableCell>{renderJobStatusBadge(job.status)}</TableCell>
                        <TableCell className="text-right">
                          {mockJobApplications.filter((app) => app.jobPostingId === job.id).length}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No job postings found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Application Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobApplications.length > 0 ? (
                    filteredJobApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4 text-muted-foreground" />
                            <div>
                              <div>{application.applicantName}</div>
                              <div className="text-xs text-muted-foreground">{application.applicantEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getJobTitle(application.jobPostingId)}</TableCell>
                        <TableCell>{application.applicationDate}</TableCell>
                        <TableCell>{renderApplicationStatusBadge(application.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => openDialog("viewResume", application)}>
                            <FileText className="mr-2 h-4 w-4" /> View Resume
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Job Posting Dialog */}
      <Dialog
        open={dialogState.addJobPosting}
        onOpenChange={(open) => setDialogState({ ...dialogState, addJobPosting: open })}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Job Posting</DialogTitle>
            <DialogDescription>Create a new job posting to attract candidates.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={newJobPosting.title}
                onChange={handleInputChange}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newJobPosting.departmentId?.toString()}
                  onValueChange={(value) =>
                    setNewJobPosting({ ...newJobPosting, departmentId: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newJobPosting.status}
                  onValueChange={(value) => setNewJobPosting({ ...newJobPosting, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={newJobPosting.description}
                onChange={handleInputChange}
                placeholder="Describe the job role, responsibilities, and other details..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={newJobPosting.requirements}
                onChange={handleInputChange}
                placeholder="List the required skills, experience, education, etc..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postedDate">Posted Date</Label>
              <Input id="postedDate" type="date" value={newJobPosting.postedDate} onChange={handleInputChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeDialog("addJobPosting")}>
              Cancel
            </Button>
            <Button onClick={handleAddJobPosting}>Create Job Posting</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Resume Dialog */}
      <Dialog
        open={dialogState.viewResume}
        onOpenChange={(open) => setDialogState({ ...dialogState, viewResume: open })}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Applicant Resume</DialogTitle>
            <DialogDescription>
              {selectedApplication && (
                <span>
                  Resume for {selectedApplication.applicantName} - {getJobTitle(selectedApplication.jobPostingId)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="grid gap-6 py-4">
              {/* Applicant Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="h-8 w-8 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedApplication.applicantName}</h3>
                    <p className="text-muted-foreground">{selectedApplication.applicantEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <Label className="text-muted-foreground">Position Applied For</Label>
                    <p className="font-medium">{getJobTitle(selectedApplication.jobPostingId)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Department</Label>
                    <p className="font-medium">
                      {getDepartmentName(
                        mockJobPostings.find((job) => job.id === selectedApplication.jobPostingId)?.departmentId || 0,
                      )}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Application Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{selectedApplication.applicationDate}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <p>{renderApplicationStatusBadge(selectedApplication.status)}</p>
                  </div>
                </div>
              </div>

              {/* Resume Document */}
              <div className="border rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Resume Document
                  </h3>
                  <Button variant="outline" size="sm" asChild>
                    <a href={selectedApplication.resumeLink} target="_blank" rel="noopener noreferrer">
                      Download Resume
                    </a>
                  </Button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-6 min-h-[300px] flex flex-col items-center justify-center">
                  <div className="text-center space-y-2">
                    <FileText className="h-16 w-16 mx-auto text-slate-400" />
                    <p className="text-muted-foreground">Resume preview not available</p>
                    <p className="text-sm text-muted-foreground">Click the download button to view the full resume</p>
                  </div>
                </div>
              </div>

              {/* Application Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Application Notes</Label>
                <Textarea id="notes" placeholder="Add notes about this application..." className="min-h-[100px]" />
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="mr-2 h-4 w-4" /> Schedule Interview
              </Button>
              <Select defaultValue={selectedApplication?.status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interviewed">Interviewed</SelectItem>
                  <SelectItem value="Hired">Hired</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => closeDialog("viewResume")}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Recruitment
