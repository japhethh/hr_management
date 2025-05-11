export interface User {
  _id: string;
  email: string;
  name: string;
  password: string;
  image?: string;
  role: string;
  createdAt: string;
  status?: string;
  userName?: string;
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string
  }
}
