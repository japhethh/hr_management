"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useRecruitment } from "@/hooks/useRecruitment"
import type { Recruitment } from "@/types"
import { toast } from "react-hot-toast"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Icons
import { MoreHorizontal, Pencil, Trash2, Eye, Filter, X, Save, PlusCircle, FileText } from "lucide-react"

// Define filter types
interface Filters {
  status: string
  department: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

// Define new recruitment form data
interface RecruitmentFormData {
  title: string
  department: string
  postDate: string
  status: "open" | "closed"
  application: string
}

const RecruitmentDataTable = () => {
  // React Query hooks
  const {
    getRecruitmentsQuery,
    createRecruitmentMutation,
    updateRecruitmentMutation,
    deleteRecruitmentMutation,
    getRecruitmentById,
  } = useRecruitment()

  // State for UI
  const [selectedRecruitment, setSelectedRecruitment] = useState<Recruitment | null>(null)
  const [editingRecruitment, setEditingRecruitment] = useState<Recruitment | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [recruitmentToDelete, setRecruitmentToDelete] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    department: "all",
    dateRange: {
      from: undefined,
      to: undefined,
    },
  })
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [newRecruitment, setNewRecruitment] = useState<RecruitmentFormData>({
    title: "",
    department: "",
    postDate: new Date().toISOString().split("T")[0],
    status: "open",
    application: "",
  })

  // Count active filters
  useEffect(() => {
    let count = 0
    if (filters.status !== "all") count++
    if (filters.department !== "all") count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    setActiveFiltersCount(count)
  }, [filters])

  // Handle view recruitment
  const handleViewRecruitment = (recruitment: Recruitment) => {
    setSelectedRecruitment(recruitment)
    setIsViewDialogOpen(true)
  }

  // Handle edit recruitment
  const handleEditRecruitment = (recruitment: Recruitment) => {
    setEditingRecruitment({ ...recruitment })
    setIsEditDialogOpen(true)
  }

  // Handle delete recruitment
  const handleDeleteRecruitment = (recruitmentId: string) => {
    setRecruitmentToDelete(recruitmentId)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete recruitment
  const confirmDeleteRecruitment = async () => {
    if (!recruitmentToDelete) return

    try {
      await deleteRecruitmentMutation.mutateAsync(recruitmentToDelete)
      setIsViewDialogOpen(false)
      setIsDeleteDialogOpen(false)
      setRecruitmentToDelete(null)
      toast.success("Recruitment entry has been successfully deleted.")
    } catch (error) {
      console.error("Failed to delete recruitment entry:", error)
      toast.error("Failed to delete recruitment entry. Please try again.")
    }
  }

  // Handle save recruitment (edit)
  const handleSaveRecruitment = async () => {
    if (!editingRecruitment) return

    try {
      const { _id, ...recruitmentData } = editingRecruitment
      await updateRecruitmentMutation.mutateAsync({
        id: _id,
        recruitmentData,
      })
      setIsEditDialogOpen(false)
      setEditingRecruitment(null)
    } catch (error) {
      console.error("Failed to update recruitment entry:", error)
      toast.error("There was an error updating the recruitment entry. Please try again.")
    }
  }

  // Handle add new recruitment
  const handleAddRecruitment = async () => {
    try {
      await createRecruitmentMutation.mutateAsync(newRecruitment)
      setIsAddDialogOpen(false)
      // Reset form
      setNewRecruitment({
        title: "",
        department: "",
        postDate: new Date().toISOString().split("T")[0],
        status: "open",
        application: "",
      })
    } catch (error) {
      console.error("Failed to add recruitment entry:", error)
      toast.error("There was an error adding the recruitment entry. Please try again.")
    }
  }

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: "all",
      department: "all",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    })
  }

  // Dialog state handlers
  const handleViewDialogChange = (open: boolean) => {
    setIsViewDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setSelectedRecruitment(null)
      }, 100)
    }
  }

  const handleEditDialogChange = (open: boolean) => {
    setIsEditDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setEditingRecruitment(null)
      }, 100)
    }
  }

  const handleAddDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open)
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open)
    if (!open) {
      setTimeout(() => {
        setRecruitmentToDelete(null)
      }, 100)
    }
  }

  // Filter and pagination logic
  const filteredData = getRecruitmentsQuery.data
    ? getRecruitmentsQuery.data.filter((recruitment: Recruitment) => {
        // Text search filter
        const matchesSearch =
          recruitment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recruitment.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          recruitment._id.toLowerCase().includes(searchQuery.toLowerCase())

        if (!matchesSearch) return false

        // Status filter
        if (filters.status !== "all" && recruitment.status !== filters.status) {
          return false
        }

        // Department filter
        if (filters.department !== "all" && recruitment.department !== filters.department) {
          return false
        }

        // Date range filter
        if (filters.dateRange.from || filters.dateRange.to) {
          const postDate = new Date(recruitment.postDate)

          if (filters.dateRange.from && postDate < filters.dateRange.from) {
            return false
          }

          if (filters.dateRange.to) {
            const endDate = new Date(filters.dateRange.to)
            endDate.setHours(23, 59, 59, 999) // End of the day
            if (postDate > endDate) {
              return false
            }
          }
        }

        return true
      })
    : []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open":
        return "success"
      case "closed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Loading and error states
  if (getRecruitmentsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading recruitment data...</p>
        </div>
      </div>
    )
  }

  if (getRecruitmentsQuery.isError) {
    return <div className="p-4 text-red-500">Error loading recruitment data. Please try again.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="relative w-full max-w-sm">
            <Input
              placeholder="Search job positions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-8"
            />
            {searchQuery && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Job Positions</h4>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters({ ...filters, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Post Date</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">From</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                            {filters.dateRange.from ? (
                              format(filters.dateRange.from, "PP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.from}
                            onSelect={(date) =>
                              setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, from: date },
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">To</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                            {filters.dateRange.to ? (
                              format(filters.dateRange.to, "PP")
                            ) : (
                              <span className="text-muted-foreground">Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={filters.dateRange.to}
                            onSelect={(date) =>
                              setFilters({
                                ...filters,
                                dateRange: { ...filters.dateRange, to: date },
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button variant="ghost" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Job Position
        </Button>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <Card className="mb-4">
          <CardContent className="py-3">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium">Active Filters:</span>

              {filters.status !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => setFilters({ ...filters, status: "all" })}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {filters.department !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Department: {filters.department}
                  <button
                    onClick={() => setFilters({ ...filters, department: "all" })}
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {(filters.dateRange.from || filters.dateRange.to) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Post Date: {filters.dateRange.from ? format(filters.dateRange.from, "PP") : "Any"}
                  {" - "}
                  {filters.dateRange.to ? format(filters.dateRange.to, "PP") : "Any"}
                  <button
                    onClick={() =>
                      setFilters({
                        ...filters,
                        dateRange: { from: undefined, to: undefined },
                      })
                    }
                    className="ml-1 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" onClick={resetFilters} className="ml-auto text-xs h-7">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recruitment Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Post Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No job positions found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((recruitment: Recruitment) => (
                <TableRow key={recruitment._id}>
                  <TableCell className="font-medium">{recruitment._id.substring(0, 8)}...</TableCell>
                  <TableCell>{recruitment.title}</TableCell>
                  <TableCell>{recruitment.department}</TableCell>
                  <TableCell>{format(new Date(recruitment.postDate), "PP")}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(recruitment.status)}>{recruitment.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu
                      open={openMenuId === recruitment._id}
                      onOpenChange={(open) => {
                        setOpenMenuId(open ? recruitment._id : null)
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            handleViewRecruitment(recruitment)
                            setOpenMenuId(null)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            handleEditRecruitment(recruitment)
                            setOpenMenuId(null)
                          }}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            handleDeleteRecruitment(recruitment._id)
                            setOpenMenuId(null)
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
          {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} job positions
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                let pageNumber: number

                // Logic to show pages around current page
                if (totalPages <= 5) {
                  pageNumber = index + 1
                } else if (currentPage <= 3) {
                  pageNumber = index + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index
                } else {
                  pageNumber = currentPage - 2 + index
                }

                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink onClick={() => paginate(pageNumber)} isActive={currentPage === pageNumber}>
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                return null
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* View Recruitment Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={handleViewDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Job Position Details</DialogTitle>
            <DialogDescription>View detailed information about this job position</DialogDescription>
          </DialogHeader>

          {selectedRecruitment && (
            <div className="space-y-4">
              <div className="py-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{selectedRecruitment.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedRecruitment.department}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(selectedRecruitment.status)}>
                    {selectedRecruitment.status}
                  </Badge>
                </div>

                <DetailRow label="ID" value={selectedRecruitment._id} />
                <DetailRow label="Post Date" value={format(new Date(selectedRecruitment.postDate), "PP")} />

                <div className="space-y-2">
                  <h4 className="font-medium">Application Details</h4>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Application Information</span>
                    </div>
                    <p className="text-sm whitespace-pre-line">{selectedRecruitment.application}</p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-between sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleEditRecruitment(selectedRecruitment)
                    setIsViewDialogOpen(false)
                  }}
                >
                  Edit Job Position
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteRecruitment(selectedRecruitment._id)}>
                  Delete Job Position
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Recruitment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Job Position</DialogTitle>
            <DialogDescription>Make changes to job position information</DialogDescription>
          </DialogHeader>

          {editingRecruitment && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-title" className="text-right">
                    Job Title
                  </Label>
                  <Input
                    id="edit-title"
                    value={editingRecruitment.title}
                    onChange={(e) =>
                      setEditingRecruitment({
                        ...editingRecruitment,
                        title: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-department" className="text-right">
                    Department
                  </Label>
                  <Input
                    id="edit-department"
                    value={editingRecruitment.department}
                    onChange={(e) =>
                      setEditingRecruitment({
                        ...editingRecruitment,
                        department: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editingRecruitment.status}
                    onValueChange={(value: "open" | "closed") =>
                      setEditingRecruitment({
                        ...editingRecruitment,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger id="edit-status" className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-postDate" className="text-right">
                    Post Date
                  </Label>
                  <Input
                    id="edit-postDate"
                    type="date"
                    value={new Date(editingRecruitment.postDate).toISOString().split("T")[0]}
                    onChange={(e) =>
                      setEditingRecruitment({
                        ...editingRecruitment,
                        postDate: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="edit-application" className="text-right pt-2">
                    Application
                  </Label>
                  <Textarea
                    id="edit-application"
                    value={editingRecruitment.application}
                    onChange={(e) =>
                      setEditingRecruitment({
                        ...editingRecruitment,
                        application: e.target.value,
                      })
                    }
                    className="col-span-3 min-h-[100px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRecruitment}
                  disabled={updateRecruitmentMutation.isPending}
                  className="gap-2"
                >
                  {updateRecruitmentMutation.isPending && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Recruitment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={handleAddDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Job Position</DialogTitle>
            <DialogDescription>Enter the details for the new job position</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-title" className="text-right">
                  Job Title
                </Label>
                <Input
                  id="add-title"
                  value={newRecruitment.title}
                  onChange={(e) =>
                    setNewRecruitment({
                      ...newRecruitment,
                      title: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-department" className="text-right">
                  Department
                </Label>
                <Input
                  id="add-department"
                  value={newRecruitment.department}
                  onChange={(e) =>
                    setNewRecruitment({
                      ...newRecruitment,
                      department: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newRecruitment.status}
                  onValueChange={(value: "open" | "closed") =>
                    setNewRecruitment({
                      ...newRecruitment,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="add-status" className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="add-postDate" className="text-right">
                  Post Date
                </Label>
                <Input
                  id="add-postDate"
                  type="date"
                  value={newRecruitment.postDate}
                  onChange={(e) =>
                    setNewRecruitment({
                      ...newRecruitment,
                      postDate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="add-application" className="text-right pt-2">
                  Application
                </Label>
                <Textarea
                  id="add-application"
                  value={newRecruitment.application}
                  onChange={(e) =>
                    setNewRecruitment({
                      ...newRecruitment,
                      application: e.target.value,
                    })
                  }
                  className="col-span-3 min-h-[100px]"
                  placeholder="Enter application details..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRecruitment} disabled={createRecruitmentMutation.isPending} className="gap-2">
                {createRecruitmentMutation.isPending && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Job Position
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this job position? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteRecruitment}
              disabled={deleteRecruitmentMutation.isPending}
              className="gap-2"
            >
              {deleteRecruitmentMutation.isPending && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <Trash2 className="h-4 w-4 mr-1" />
              Delete Job Position
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper component
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <span className="text-sm font-medium text-gray-500">{label}:</span>
    <span className="col-span-3 text-sm break-all">{value}</span>
  </div>
)

export default RecruitmentDataTable
