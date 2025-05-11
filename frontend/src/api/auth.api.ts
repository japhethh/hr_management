import { User, LoginCredentials, AuthResponse } from "@/types";
import api from "@/lib/axios";

export const authApi = {
  loginUser: async (userData: LoginCredentials): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>("/auth/login",
      userData
    );
    return response.data
  },
  registerUser: async (userData: User): Promise<User> => {

    const response = await api.post("/auth/register", userData)
    return response.data
  }
}