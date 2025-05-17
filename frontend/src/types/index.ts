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


export interface Competency {
  _id?: string
  EmployeeID: string | Employee
  SkillName: string
  SkillLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  Certification?: string
  CertificationDate?: Date | string
}

export interface SkillDistribution {
  Beginner: number
  Intermediate: number
  Advanced: number
  Expert: number
}

export interface TopSkill {
  _id: string // Skill name
  count: number
  averageLevel: number
}

export interface CertificationStats {
  totalEmployees: number
  withCertification: number
  certificationRate: number
}

// Add this to your existing types file

export interface HrAnalytics {
  _id?: string
  AnalyticsID: string
  EmployeeID: string
  ReviewID: string
  AttendanceRate: string
  AvgHoursWorked: string
  CompentencyScore: string
}

export interface EmployeePerformanceMetric {
  employeeId: string
  employeeName: string
  department: string
  attendanceRate: number
  avgHoursWorked: number
  competencyScore: number
  overallScore: number
}

export interface DepartmentPerformanceMetric {
  department: string
  employeeCount: number
  avgAttendanceRate: string
  avgHoursWorked: string
  avgCompetencyScore: string
}


// Add these types to your existing types file

export interface PerformanceReview {
  _id: string
  ReviewID: string
  EmployeeID: string
  ReviewPeriodStart: string
  ReviewPeriodEnd: string
  OverallRating: string
  Strengths: string
  AreasForImprovement: string
  Comments: string
}

export interface ReviewStats {
  totalReviews: number
  averageRating: string
  ratingDistribution: {
    "1": number
    "2": number
    "3": number
    "4": number
    "5": number
  }
}

export interface EmployeeSummary {
  employeeId: string
  totalReviews: number
  averageRating: string
  latestReview: PerformanceReview | null
  ratingTrend: {
    period: string
    rating: number
  }[]
}

export interface DepartmentSummary {
  departmentId: string
  employeeCount: number
  totalReviews: number
  averageRating: string
}



export interface TopPerformer extends EmployeePerformanceMetric { }
