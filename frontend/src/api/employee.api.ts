import api from "@/lib/axios";
import { Employee } from "@/types";

export const employeeApi = {
  // Get all users
  getEmployee: async (): Promise<Employee[]> => {
    const response = await api.get<Employee[]>("/employee/")
    return response.data
  },

  // Get Employee by ID
  getEmployeeById: async (id: string): Promise<Employee> => {
    const response = await api.get<Employee>(`/employee/${id}`, {})
    return response.data
  },

  // Create new Employee
  createEmployee: async (userData: Employee): Promise<Employee> => {
    const response = await api.post<Employee>("/employee", userData)
    return response.data
  },

  // Update Employee
  updateEmployee: async (id: string, userData: Employee): Promise<Employee> => {
    const response = await api.put<Employee>(`/employee/${id}`, { userData, id })
    return response.data
  },

  // Delete Employee
  deleteEmployee: async (id: string): Promise<void> => {
    await api.delete(`/employee/${id}`)
  },



}