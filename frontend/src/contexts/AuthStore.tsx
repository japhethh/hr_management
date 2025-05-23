import axios from 'axios'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  token: string | null
  userData: () => Promise<void>
}

interface User {
  _id?: string
  name: string
  email: string
  password: string
  userName: string
  role: string
  image?: string
}

export const apiURL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://hr-management-api-hznz.onrender.com";



const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("token"),
  userData: async () => {
    try {
      const { token } = get();

      const response = await axios.post(`${apiURL}/api/user/getId`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      console.log(response.data)

      set({ user: response.data })
    } catch (error) {
      console.log(error)
    }
  }
}))


export default useAuthStore