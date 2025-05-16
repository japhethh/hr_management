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

// Define Employee interface
export interface Employee {
  _id: string
  FirstName?: string
  LastName?: string
  Email: string
  PhoneNumber: string
  HireDate: string
  JobTitle: string
  DepartmentId: string
  SupervisorId: string | null
  status: string
}



export interface Recruitment {
  _id: string
  title: string
  department: string
  postDate: string
  status: "open" | "closed"
  application: string
}



export interface TimeAttendance {
  _id?: string
  EmployeeId: string | Employee
  workDate: Date | string
  ClockIn?: string
  ClockOut?: string
  HoursWorked?: Date | string
  Status: "Present" | "Absent" | "Leave" | "Late"
}

export interface AttendanceSummary {
  total: number
  present: number
  absent: number
  leave: number
  late: number
}

