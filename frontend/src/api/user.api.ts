import api from "@/lib/axios";
import { AuthResponse, LoginCredentials, User } from "@/types";

export const userApi = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await api.post<User[]>("/user/get")
    return response.data
  },

  // Get user by ID
  getUserById: async (): Promise<User> => {
    const response = await api.post<User>(`/user/getId`, {})
    return response.data
  },

  // Create new user
  createUser: async (userData: User): Promise<User> => {
    const response = await api.post<User>("/user/create", userData)
    return response.data
  },

  // Update user
  updateUser: async (id: string, userData: User): Promise<User> => {
    const response = await api.post<User>(`/user/update`, { userData, id })
    return response.data
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await api.post(`/user/delete`, { id })
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", credentials)
    return response.data
  },

  // Register
  register: async (userData: User): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData)
    return response.data
  },



}