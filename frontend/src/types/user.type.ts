export interface User {
  _id?: string
  name?: string
  email: string
  password?: string
  userName?: string
  date?: Date
  role?: "admin" | "super-admin"
  image?: string
  createdAt?: string
  updatedAt?: string
}