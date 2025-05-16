import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { recruitmentApi } from "@/api/recruitment.api"
import type { Recruitment } from "@/types"
import { toast } from "react-hot-toast"

export const useRecruitment = () => {
  const queryClient = useQueryClient()

  const getRecruitmentsQuery = useQuery({
    queryKey: ["recruitment"],
    queryFn: recruitmentApi.getRecruitments,
  })

  const getRecruitmentById = useMutation({
    mutationFn: (id: string) => recruitmentApi.getRecruitmentById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] })
    },
    onError: (error: Error) => {
      console.error("Failed to fetch recruitment details:", error)
      toast.error("Failed to load recruitment details. Please try again.")
    },
  })

  const createRecruitmentMutation = useMutation({
    mutationFn: (recruitmentData: Omit<Recruitment, "_id">) => recruitmentApi.createRecruitment(recruitmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] })
      toast.success("Recruitment entry created successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to create recruitment entry:", error)
      toast.error("Failed to create recruitment entry. Please check the form and try again.")
    },
  })

  const updateRecruitmentMutation = useMutation({
    mutationFn: ({ id, recruitmentData }: { id: string; recruitmentData: Omit<Recruitment, "_id"> }) =>
      recruitmentApi.updateRecruitment(id, recruitmentData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] })
      queryClient.invalidateQueries({ queryKey: ["recruitment", variables.id] })
      toast.success("Recruitment entry updated successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to update recruitment entry:", error)
      toast.error("Failed to update recruitment entry. Please check the form and try again.")
    },
  })

  const deleteRecruitmentMutation = useMutation({
    mutationFn: (id: string) => recruitmentApi.deleteRecruitment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recruitment"] })
      toast.success("Recruitment entry deleted successfully!")
    },
    onError: (error: Error) => {
      console.error("Failed to delete recruitment entry:", error)
      toast.error("Failed to delete recruitment entry. Please try again.")
    },
  })

  return {
    getRecruitmentsQuery,
    createRecruitmentMutation,
    updateRecruitmentMutation,
    deleteRecruitmentMutation,
    getRecruitmentById,
  }
}
