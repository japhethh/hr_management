import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString()
}



// Mock data for the application
export const mockEmployees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    hireDate: "2020-01-15",
    jobTitle: "Software Engineer",
    departmentId: 1,
    supervisorId: 3,
    status: "Active",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phoneNumber: "123-456-7891",
    hireDate: "2019-05-20",
    jobTitle: "UX Designer",
    departmentId: 2,
    supervisorId: 4,
    status: "Active",
  },
  {
    id: 3,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    phoneNumber: "123-456-7892",
    hireDate: "2018-03-10",
    jobTitle: "Engineering Manager",
    departmentId: 1,
    supervisorId: null,
    status: "Active",
  },
  {
    id: 4,
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.williams@example.com",
    phoneNumber: "123-456-7893",
    hireDate: "2017-11-05",
    jobTitle: "Design Director",
    departmentId: 2,
    supervisorId: null,
    status: "Active",
  },
  {
    id: 5,
    firstName: "Robert",
    lastName: "Brown",
    email: "robert.brown@example.com",
    phoneNumber: "123-456-7894",
    hireDate: "2021-02-28",
    jobTitle: "Frontend Developer",
    departmentId: 1,
    supervisorId: 3,
    status: "On Leave",
  },
]

export const mockDepartments = [
  {
    id: 1,
    departmentName: "Engineering",
    location: "Building A, Floor 3",
  },
  {
    id: 2,
    departmentName: "Design",
    location: "Building B, Floor 2",
  },
  {
    id: 3,
    departmentName: "Marketing",
    location: "Building A, Floor 1",
  },
  {
    id: 4,
    departmentName: "Human Resources",
    location: "Building C, Floor 1",
  },
  {
    id: 5,
    departmentName: "Finance",
    location: "Building C, Floor 2",
  },
]

export const mockJobPostings = [
  {
    id: 1,
    title: "Senior Software Engineer",
    departmentId: 1,
    description: "We are looking for an experienced software engineer to join our team.",
    requirements: "5+ years of experience in web development, proficient in React and Node.js.",
    postedDate: "2023-04-15",
    status: "Open",
  },
  {
    id: 2,
    title: "UX/UI Designer",
    departmentId: 2,
    description: "Join our design team to create beautiful and intuitive user interfaces.",
    requirements: "3+ years of experience in UX/UI design, proficient in Figma and Adobe Creative Suite.",
    postedDate: "2023-04-20",
    status: "Open",
  },
  {
    id: 3,
    title: "Marketing Specialist",
    departmentId: 3,
    description: "Help us grow our brand and reach new customers.",
    requirements: "2+ years of experience in digital marketing, knowledge of SEO and social media marketing.",
    postedDate: "2023-03-10",
    status: "Closed",
  },
]

export const mockJobApplications = [
  {
    id: 1,
    jobPostingId: 1,
    applicantName: "Alice Johnson",
    applicantEmail: "alice.johnson@example.com",
    resumeLink: "https://example.com/resumes/alice_johnson.pdf",
    applicationDate: "2023-04-18",
    status: "Applied",
    hiredEmployeeId: null,
  },
  {
    id: 2,
    jobPostingId: 1,
    applicantName: "Bob Smith",
    applicantEmail: "bob.smith@example.com",
    resumeLink: "https://example.com/resumes/bob_smith.pdf",
    applicationDate: "2023-04-19",
    status: "Interviewed",
    hiredEmployeeId: null,
  },
  {
    id: 3,
    jobPostingId: 2,
    applicantName: "Charlie Brown",
    applicantEmail: "charlie.brown@example.com",
    resumeLink: "https://example.com/resumes/charlie_brown.pdf",
    applicationDate: "2023-04-22",
    status: "Applied",
    hiredEmployeeId: null,
  },
  {
    id: 4,
    jobPostingId: 3,
    applicantName: "Diana Prince",
    applicantEmail: "diana.prince@example.com",
    resumeLink: "https://example.com/resumes/diana_prince.pdf",
    applicationDate: "2023-03-15",
    status: "Hired",
    hiredEmployeeId: 6,
  },
]

export const mockCompetencies = [
  {
    id: 1,
    employeeId: 1,
    skillName: "React",
    skillLevel: "Advanced",
    certification: "React Certified Developer",
    certificationDate: "2022-05-15",
  },
  {
    id: 2,
    employeeId: 1,
    skillName: "Node.js",
    skillLevel: "Intermediate",
    certification: "Node.js Application Developer",
    certificationDate: "2021-10-20",
  },
  {
    id: 3,
    employeeId: 2,
    skillName: "UI Design",
    skillLevel: "Expert",
    certification: "Certified UX Designer",
    certificationDate: "2020-08-12",
  },
  {
    id: 4,
    employeeId: 3,
    skillName: "Project Management",
    skillLevel: "Advanced",
    certification: "PMP",
    certificationDate: "2019-03-25",
  },
  {
    id: 5,
    employeeId: 4,
    skillName: "Design Systems",
    skillLevel: "Expert",
    certification: "Design Systems Certification",
    certificationDate: "2018-11-30",
  },
]

export const mockPerformanceReviews = [
  {
    id: 1,
    employeeId: 1,
    reviewPeriodStart: "2023-01-01",
    reviewPeriodEnd: "2023-06-30",
    reviewerId: 3,
    overallRating: 4.5,
    strengths: "Strong technical skills, great team player",
    areasForImprovement: "Could improve communication with non-technical stakeholders",
    comments: "John has been a valuable asset to the team this period.",
  },
  {
    id: 2,
    employeeId: 2,
    reviewPeriodStart: "2023-01-01",
    reviewPeriodEnd: "2023-06-30",
    reviewerId: 4,
    overallRating: 4.8,
    strengths: "Exceptional design skills, great attention to detail",
    areasForImprovement: "Could be more vocal in team meetings",
    comments: "Jane consistently delivers high-quality designs.",
  },
  {
    id: 3,
    employeeId: 5,
    reviewPeriodStart: "2023-01-01",
    reviewPeriodEnd: "2023-06-30",
    reviewerId: 3,
    overallRating: 3.7,
    strengths: "Quick learner, good problem-solving skills",
    areasForImprovement: "Needs to improve code quality and documentation",
    comments: "Robert has shown good progress but still has areas to improve.",
  },
]

export const mockTimeAttendance = [
  {
    id: 1,
    employeeId: 1,
    workDate: "2023-07-10",
    clockIn: "09:00",
    clockOut: "17:30",
    hoursWorked: 8.5,
    status: "Present",
  },
  {
    id: 2,
    employeeId: 1,
    workDate: "2023-07-11",
    clockIn: "08:45",
    clockOut: "17:15",
    hoursWorked: 8.5,
    status: "Present",
  },
  {
    id: 3,
    employeeId: 2,
    workDate: "2023-07-10",
    clockIn: "09:15",
    clockOut: "18:00",
    hoursWorked: 8.75,
    status: "Present",
  },
  {
    id: 4,
    employeeId: 3,
    workDate: "2023-07-10",
    clockIn: null,
    clockOut: null,
    hoursWorked: 0,
    status: "Absent",
  },
  {
    id: 5,
    employeeId: 5,
    workDate: "2023-07-10",
    clockIn: "09:30",
    clockOut: "14:00",
    hoursWorked: 4.5,
    status: "Present",
  },
]

export const mockShiftSchedule = [
  {
    id: 1,
    employeeId: 1,
    shiftDate: "2023-07-17",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    shiftType: "Morning",
  },
  {
    id: 2,
    employeeId: 1,
    shiftDate: "2023-07-18",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    shiftType: "Morning",
  },
  {
    id: 3,
    employeeId: 2,
    shiftDate: "2023-07-17",
    shiftStart: "10:00",
    shiftEnd: "18:00",
    shiftType: "Morning",
  },
  {
    id: 4,
    employeeId: 3,
    shiftDate: "2023-07-17",
    shiftStart: "09:00",
    shiftEnd: "17:00",
    shiftType: "Morning",
  },
  {
    id: 5,
    employeeId: 4,
    shiftDate: "2023-07-17",
    shiftStart: "12:00",
    shiftEnd: "20:00",
    shiftType: "Afternoon",
  },
]

export const mockSuccessionPlanning = [
  {
    id: 1,
    employeeId: 1,
    positionTitle: "Senior Software Engineer",
    potentialSuccessorId: 5,
    readinessLevel: "Ready in 1 Year",
    developmentPlan: "Technical leadership training, architecture design workshops",
  },
  {
    id: 2,
    employeeId: 2,
    positionTitle: "Lead Designer",
    potentialSuccessorId: null,
    readinessLevel: "Not Ready",
    developmentPlan: "Identify potential candidates",
  },
  {
    id: 3,
    employeeId: 3,
    positionTitle: "Engineering Director",
    potentialSuccessorId: 1,
    readinessLevel: "Ready in 2+ Years",
    developmentPlan: "Leadership training, management workshops, shadowing opportunities",
  },
]

export const mockHRAnalytics = [
  {
    id: 1,
    employeeId: 1,
    reviewId: 1,
    attendanceRate: 0.95,
    avgHoursWorked: 8.2,
    competencyScore: 4.2,
  },
  {
    id: 2,
    employeeId: 2,
    reviewId: 2,
    attendanceRate: 0.98,
    avgHoursWorked: 8.5,
    competencyScore: 4.7,
  },
  {
    id: 3,
    employeeId: 3,
    reviewId: null,
    attendanceRate: 0.9,
    avgHoursWorked: 8.0,
    competencyScore: 4.5,
  },
  {
    id: 4,
    employeeId: 4,
    reviewId: null,
    attendanceRate: 0.92,
    avgHoursWorked: 8.3,
    competencyScore: 4.6,
  },
  {
    id: 5,
    employeeId: 5,
    reviewId: 3,
    attendanceRate: 0.85,
    avgHoursWorked: 7.8,
    competencyScore: 3.5,
  },
]
