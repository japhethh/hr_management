"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Plus, TrendingUp } from "lucide-react"
import { mockSuccessionPlanning, mockEmployees } from "../lib/utils"

const SuccessionPlanning = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get employee name by ID
  const getEmployeeName = (employeeId: number | null) => {
    if (!employeeId) return "Not Assigned";
    const employee = mockEmployees.find(emp => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "N/A";
  };
  
  // Filter succession plans based on search term
  const filteredPlans = mockSuccessionPlanning.filter(plan => 
    getEmployeeName(plan.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getEmployeeName(plan.potentialSuccessorId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.positionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Succession Planning</h1>
          <p className="text-muted-foreground">Plan for future leadership and critical positions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Plan
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Succession Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-64 mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search plans..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Current Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Potential Successor</TableHead>
                  <TableHead>Readiness Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.length > 0 ? (
                  filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">
                        {getEmployeeName(plan.employeeId)}
                      </TableCell>
                      <TableCell>{plan.positionTitle}</TableCell>
                      <TableCell>{getEmployeeName(plan.potentialSuccessorId)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          plan.readinessLevel === "Ready Now" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
                            : plan.readinessLevel === "Ready in 1 Year"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : plan.readinessLevel === "Ready in 2+ Years"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}>
                          {plan.readinessLevel}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">View Plan</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No succession plans found.
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
            <CardTitle>Readiness Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Ready Now</span>
                  <span className="text-sm font-medium">
                    {mockSuccessionPlanning.filter(p => p.readinessLevel === "Ready Now").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div 
                    className="h-2 rounded-full bg-green-500" 
                    style={{ 
                      width: `${(mockSuccessionPlanning.filter(p => p.readinessLevel === "Ready Now").length / 
                        mockSuccessionPlanning.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Ready in 1 Year</span>
                  <span className="text-sm font-medium">
                    {mockSuccessionPlanning.filter(p => p.readinessLevel === "Ready in 1 Year").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div 
                    className="h-2 rounded-full bg-blue-500" 
                    style={{ 
                      width: `${(mockSuccessionPlanning.filter(p => p.readinessLevel === "Ready in 1 Year").length / 
                        mockSuccessionPlanning.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Ready in 2+ Years</span>
                  <span className="text-sm font-medium">
                    {mockSuccessionPlanning.filter(p => p.readinessLevel === "Ready in 2+ Years").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div 
                    className="h-2 rounded-full bg-yellow-500" 
                    style={{ 
                      width: `${(mockSuccessionPlanning.filter(p => p.readinessLevel === "Ready in 2+ Years").length / 
                        mockSuccessionPlanning.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Not Ready</span>
                  <span className="text-sm font-medium">
                    {mockSuccessionPlanning.filter(p => p.readinessLevel === "Not Ready").length}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div 
                    className="h-2 rounded-full bg-red-500" 
                    style={{ 
                      width: `${(mockSuccessionPlanning.filter(p => p.readinessLevel === "Not Ready").length / 
                        mockSuccessionPlanning.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Critical Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-2 rounded-md border">
                <div className="mr-4 rounded-full bg-primary/10 p-2">
                  <TrendingUp className\
