import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { employeeApi } from "@/api/employee.api"
import type { Employee } from "@/types"
import { toast } from "react-hot-toast"

export const useEmployee = () => {
  const queryClient = useQueryClient()

  const getEmployeeQuery = useQuery({
    queryKey: ["employee"],
    queryFn: employeeApi.getEmployee,

  })

  const getEmployeeId = useMutation({
    mutationFn: (id: string) => employeeApi.getEmployeeById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] })
    },
    onError: (error: Error) => {
      console.error("Failed to fetch employee details:", error)
      toast.error("Failed to load employee details. Please try again.")
    },
  })

  const createEmployeeMutation = useMutation({
    mutationFn: (userData: Employee) => employeeApi.createEmployee(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] })
      toast.success("Employee created successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to create employee:", error)
      toast.error("Failed to create employee. Please check the form and try again.")
    },
  })

  const UpdateEmployeeMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Employee }) => employeeApi.updateEmployee(id, userData),
    onSuccess: (data, variables) => {
      console.log(data)

      queryClient.invalidateQueries({ queryKey: ["employee"] })
      queryClient.invalidateQueries({ queryKey: ["employee", variables.id] })
      toast.success("Employee updated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to update employee:", error)
      toast.error("Failed to update employee. Please check the form and try again.")
    },
  })

  const deleteEmployee = useMutation({
    mutationFn: (id: string) => employeeApi.deleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee"] })
      toast.success("Employee deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to delete employee:", error)
      toast.error("Failed to delete employee. Please try again.")
    },
  })

  return {
    getEmployeeQuery,
    createEmployeeMutation,
    UpdateEmployeeMutation,
    deleteEmployee,
    getEmployeeId,
  }
}
