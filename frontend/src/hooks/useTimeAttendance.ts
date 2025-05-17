import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { TimeAttendance } from "@/types"
import { toast } from "react-hot-toast"
import { timeAttendanceApi } from "@/api/time-attendance.api"

export const useTimeAttendance = () => {
  const queryClient = useQueryClient()

  const getTimeAttendancesQuery = useQuery({
    queryKey: ["time-attendance"],
    queryFn: timeAttendanceApi.getTimeAttendances,
  })

  const getTimeAttendanceByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ["time-attendance", id],
      queryFn: () => timeAttendanceApi.getTimeAttendanceById(id),
      enabled: !!id,
    })
  }

  const getTimeAttendanceByEmployeeIdQuery = (employeeId: string) => {
    return useQuery({
      queryKey: ["time-attendance", "employee", employeeId],
      queryFn: () => timeAttendanceApi.getTimeAttendanceByEmployeeId(employeeId),
      enabled: !!employeeId,
    })
  }

  const getTimeAttendanceByDateRangeQuery = (startDate: string, endDate: string) => {
    return useQuery({
      queryKey: ["time-attendance", "date-range", startDate, endDate],
      queryFn: () => timeAttendanceApi.getTimeAttendanceByDateRange(startDate, endDate),
      enabled: !!startDate && !!endDate,
    })
  }

  const getAttendanceSummaryQuery = (startDate?: string, endDate?: string) => {
    return useQuery({
      queryKey: ["time-attendance", "summary", startDate, endDate],
      queryFn: () => timeAttendanceApi.getAttendanceSummary(startDate, endDate),
    })
  }

  const createTimeAttendanceMutation = useMutation({
    mutationFn: (timeAttendanceData: Partial<TimeAttendance>) =>
      timeAttendanceApi.createTimeAttendance(timeAttendanceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-attendance"] })
      toast.success("Time attendance record created successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to create time attendance record:", error)
      toast.error("Failed to create time attendance record. Please try again.")
    },
  })

  const updateTimeAttendanceMutation = useMutation({
    mutationFn: ({ id, timeAttendanceData }: { id: string; timeAttendanceData: Partial<TimeAttendance> }) =>
      timeAttendanceApi.updateTimeAttendance(id, timeAttendanceData),
    onSuccess: (data, variables) => {
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ["time-attendance"] })
      queryClient.invalidateQueries({ queryKey: ["time-attendance", variables.id] })
      toast.success("Time attendance record updated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to update time attendance record:", error)
      toast.error("Failed to update time attendance record. Please try again.")
    },
  })

  const deleteTimeAttendanceMutation = useMutation({
    mutationFn: (id: string) => timeAttendanceApi.deleteTimeAttendance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-attendance"] })
      toast.success("Time attendance record deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to delete time attendance record:", error)
      toast.error("Failed to delete time attendance record. Please try again.")
    },
  })

  const clockInMutation = useMutation({
    mutationFn: (employeeId: string) => timeAttendanceApi.clockIn(employeeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-attendance"] })
      queryClient.invalidateQueries({
        queryKey: ["time-attendance", "employee", data.EmployeeId],
      })
      toast.success("Clocked in successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to clock in:", error)
      toast.error(`Failed to clock in: ${error.message}`)
    },
  })

  const clockOutMutation = useMutation({
    mutationFn: (employeeId: string) => timeAttendanceApi.clockOut(employeeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-attendance"] })
      queryClient.invalidateQueries({
        queryKey: ["time-attendance", "employee", data.EmployeeId],
      })
      toast.success("Clocked out successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to clock out:", error)
      toast.error(`Failed to clock out: ${error.message}`)
    },
  })

  const markAbsentMutation = useMutation({
    mutationFn: ({ employeeId, date }: { employeeId: string; date?: string }) =>
      timeAttendanceApi.markAbsent(employeeId, date),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-attendance"] })
      queryClient.invalidateQueries({
        queryKey: ["time-attendance", "employee", data.EmployeeId],
      })
      toast.success("Employee marked as absent!")
    },
    onError: (error: Error) => {
      console.error("Failed to mark as absent:", error)
      toast.error(`Failed to mark as absent: ${error.message}`)
    },
  })

  const markLeaveMutation = useMutation({
    mutationFn: ({ employeeId, date }: { employeeId: string; date?: string }) =>
      timeAttendanceApi.markLeave(employeeId, date),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["time-attendance"] })
      queryClient.invalidateQueries({
        queryKey: ["time-attendance", "employee", data.EmployeeId],
      })
      toast.success("Employee marked as on leave!")
    },
    onError: (error: Error) => {
      console.error("Failed to mark as on leave:", error)
      toast.error(`Failed to mark as on leave: ${error.message}`)
    },
  })

  return {
    getTimeAttendancesQuery,
    getTimeAttendanceByIdQuery,
    getTimeAttendanceByEmployeeIdQuery,
    getTimeAttendanceByDateRangeQuery,
    getAttendanceSummaryQuery,
    createTimeAttendanceMutation,
    updateTimeAttendanceMutation,
    deleteTimeAttendanceMutation,
    clockInMutation,
    clockOutMutation,
    markAbsentMutation,
    markLeaveMutation,
  }
}
