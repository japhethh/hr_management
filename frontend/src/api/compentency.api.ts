import api from "@/lib/axios"
import type { Competency, SkillDistribution, TopSkill, CertificationStats } from "@/types"

export const competencyApi = {
  getCompetencies: async (): Promise<Competency[]> => {
    const response = await api.get<Competency[]>("/competency/")
    return response.data
  },

  getCompetencyById: async (id: string): Promise<Competency> => {
    const response = await api.get<Competency>(`/competency/${id}`)
    return response.data
  },

  getCompetenciesByEmployeeId: async (employeeId: string): Promise<Competency[]> => {
    if (!employeeId || employeeId === "all") {
      return [] // Return empty array or fetch all records
    }
    const response = await api.get<Competency[]>(`/competency/employee/${employeeId}`)
    return response.data
  },

  getCompetenciesBySkillLevel: async (skillLevel: string): Promise<Competency[]> => {
    const response = await api.get<Competency[]>(`/competency/skill-level/${skillLevel}`)
    return response.data
  },

  createCompetency: async (competencyData: Partial<Competency>): Promise<Competency> => {
    const response = await api.post<Competency>("/competency", competencyData)
    return response.data
  },

  updateCompetency: async (id: string, competencyData: Partial<Competency>): Promise<Competency> => {
    const response = await api.put<Competency>(`/competency/${id}`, { competencyData, id })
    return response.data
  },

  deleteCompetency: async (id: string): Promise<void> => {
    await api.delete(`/competency/${id}`)
  },

  getSkillDistribution: async (): Promise<SkillDistribution> => {
    const response = await api.get<SkillDistribution>("/competency/skill-distribution")
    return response.data
  },

  getTopSkills: async (limit = 5): Promise<TopSkill[]> => {
    const response = await api.get<TopSkill[]>(`/competency/top-skills`, {
      params: { limit },
    })
    return response.data
  },

  getCertificationStats: async (): Promise<CertificationStats> => {
    const response = await api.get<CertificationStats>("/competency/certification-stats")
    return response.data
  },
}
