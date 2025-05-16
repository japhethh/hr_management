import api from "@/lib/axios"
import type { Recruitment } from "@/types"

export const recruitmentApi = {
  // Get all recruitment entries
  getRecruitments: async (): Promise<Recruitment[]> => {
    const response = await api.get<Recruitment[]>("/recruitments/")
    return response.data
  },

  // Get Recruitment by ID
  getRecruitmentById: async (id: string): Promise<Recruitment> => {
    const response = await api.get<Recruitment>(`/recruitments/${id}`, {})
    return response.data
  },

  // Create new Recruitment
  createRecruitment: async (recruitmentData: Omit<Recruitment, "_id">): Promise<Recruitment> => {
    const response = await api.post<Recruitment>("/recruitments", recruitmentData)
    return response.data
  },

  // Update Recruitment
  updateRecruitment: async (id: string, recruitmentData: Omit<Recruitment, "_id">): Promise<Recruitment> => {
    const response = await api.put<Recruitment>(`/recruitments/${id}`, { recruitmentData, id })
    return response.data
  },

  // Delete Recruitment
  deleteRecruitment: async (id: string): Promise<void> => {
    await api.delete(`/recruitments/${id}`)
  },
}
