import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Competency } from "@/types"
import { toast } from "react-hot-toast"
import { competencyApi } from "@/api/compentency.api"

export const useCompetency = () => {
  const queryClient = useQueryClient()

  const getCompetenciesQuery = useQuery({
    queryKey: ["competency"],
    queryFn: competencyApi.getCompetencies,
  })

  const getCompetencyByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ["competency", id],
      queryFn: () => competencyApi.getCompetencyById(id),
      enabled: !!id,
    })
  }

  const getCompetenciesByEmployeeIdQuery = (employeeId: string) => {
    return useQuery({
      queryKey: ["competency", "employee", employeeId],
      queryFn: () => competencyApi.getCompetenciesByEmployeeId(employeeId),
      enabled: !!employeeId && employeeId !== "all",
    })
  }

  const getCompetenciesBySkillLevelQuery = (skillLevel: string) => {
    return useQuery({
      queryKey: ["competency", "skill-level", skillLevel],
      queryFn: () => competencyApi.getCompetenciesBySkillLevel(skillLevel),
      enabled: !!skillLevel,
    })
  }

  const getSkillDistributionQuery = useQuery({
    queryKey: ["competency", "skill-distribution"],
    queryFn: competencyApi.getSkillDistribution,
  })

  const getTopSkillsQuery = (limit = 5) => {
    return useQuery({
      queryKey: ["competency", "top-skills", limit],
      queryFn: () => competencyApi.getTopSkills(limit),
    })
  }

  const getCertificationStatsQuery = useQuery({
    queryKey: ["competency", "certification-stats"],
    queryFn: competencyApi.getCertificationStats,
  })

  const createCompetencyMutation = useMutation({
    mutationFn: (competencyData: Partial<Competency>) => competencyApi.createCompetency(competencyData),
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: ["competency"] })
      toast.success("Competency record created successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to create competency record:", error)
      toast.error("Failed to create competency record. Please try again.")
    },
  })

  const updateCompetencyMutation = useMutation({
    mutationFn: ({ id, competencyData }: { id: string; competencyData: Partial<Competency> }) =>
      competencyApi.updateCompetency(id, competencyData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["competency"] })
      queryClient.invalidateQueries({ queryKey: ["competency", variables.id] })
      toast.success("Competency record updated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to update competency record:", error)
      toast.error("Failed to update competency record. Please try again.")
    },
  })

  const deleteCompetencyMutation = useMutation({
    mutationFn: (id: string) => competencyApi.deleteCompetency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["competency"] })
      toast.success("Competency record deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to delete competency record:", error)
      toast.error("Failed to delete competency record. Please try again.")
    },
  })

  return {
    getCompetenciesQuery,
    getCompetencyByIdQuery,
    getCompetenciesByEmployeeIdQuery,
    getCompetenciesBySkillLevelQuery,
    getSkillDistributionQuery,
    getTopSkillsQuery,
    getCertificationStatsQuery,
    createCompetencyMutation,
    updateCompetencyMutation,
    deleteCompetencyMutation,
  }
}
