import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { hrAnalyticsApi } from "@/api/hrAnalytics.api"
import type { HrAnalytics } from "@/types"
import { toast } from "react-hot-toast"

export const useHrAnalytics = () => {
  const queryClient = useQueryClient()

  const getHrAnalyticsQuery = useQuery({
    queryKey: ["hr-analytics"],
    queryFn: hrAnalyticsApi.getHrAnalytics,
  })

  const getHrAnalyticsByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ["hr-analytics", id],
      queryFn: () => hrAnalyticsApi.getHrAnalyticsById(id),
      enabled: !!id,
    })
  }

  const getHrAnalyticsByEmployeeIdQuery = (employeeId: string) => {
    return useQuery({
      queryKey: ["hr-analytics", "employee", employeeId],
      queryFn: () => hrAnalyticsApi.getHrAnalyticsByEmployeeId(employeeId),
      enabled: !!employeeId && employeeId !== "all",
    })
  }

  const getEmployeePerformanceMetricsQuery = useQuery({
    queryKey: ["hr-analytics", "employee-performance"],
    queryFn: hrAnalyticsApi.getEmployeePerformanceMetrics,
  })

  const getDepartmentPerformanceMetricsQuery = useQuery({
    queryKey: ["hr-analytics", "department-performance"],
    queryFn: hrAnalyticsApi.getDepartmentPerformanceMetrics,
  })

  const getTopPerformersQuery = (limit = 5) => {
    return useQuery({
      queryKey: ["hr-analytics", "top-performers", limit],
      queryFn: () => hrAnalyticsApi.getTopPerformers(limit),
    })
  }

  const createHrAnalyticsMutation = useMutation({
    mutationFn: (hrAnalyticsData: Partial<HrAnalytics>) => hrAnalyticsApi.createHrAnalytics(hrAnalyticsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-analytics"] })
      toast.success("HR Analytics record created successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to create HR Analytics record:", error)
      toast.error("Failed to create HR Analytics record. Please try again.")
    },
  })

  const updateHrAnalyticsMutation = useMutation({
    mutationFn: ({ id, hrAnalyticsData }: { id: string; hrAnalyticsData: Partial<HrAnalytics> }) =>
      hrAnalyticsApi.updateHrAnalytics(id, hrAnalyticsData),
    onSuccess: (data, variables) => {
      console.log(data)

      queryClient.invalidateQueries({ queryKey: ["hr-analytics"] })
      queryClient.invalidateQueries({ queryKey: ["hr-analytics", variables.id] })
      toast.success("HR Analytics record updated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to update HR Analytics record:", error)
      toast.error("Failed to update HR Analytics record. Please try again.")
    },
  })

  const deleteHrAnalyticsMutation = useMutation({
    mutationFn: (id: string) => hrAnalyticsApi.deleteHrAnalytics(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-analytics"] })
      toast.success("HR Analytics record deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to delete HR Analytics record:", error)
      toast.error("Failed to delete HR Analytics record. Please try again.")
    },
  })

  const generateHrAnalyticsMutation = useMutation({
    mutationFn: (employeeId: string) => hrAnalyticsApi.generateHrAnalytics(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-analytics"] })
      toast.success("HR Analytics generated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to generate HR Analytics:", error)
      toast.error("Failed to generate HR Analytics. Please try again.")
    },
  })

  const generateAllHrAnalyticsMutation = useMutation({
    mutationFn: () => hrAnalyticsApi.generateAllHrAnalytics(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr-analytics"] })
      toast.success("HR Analytics generated for all employees!")
    },
    onError: (error: Error) => {
      console.error("Failed to generate HR Analytics for all employees:", error)
      toast.error("Failed to generate HR Analytics for all employees. Please try again.")
    },
  })

  return {
    getHrAnalyticsQuery,
    getHrAnalyticsByIdQuery,
    getHrAnalyticsByEmployeeIdQuery,
    getEmployeePerformanceMetricsQuery,
    getDepartmentPerformanceMetricsQuery,
    getTopPerformersQuery,
    createHrAnalyticsMutation,
    updateHrAnalyticsMutation,
    deleteHrAnalyticsMutation,
    generateHrAnalyticsMutation,
    generateAllHrAnalyticsMutation,
  }
}
