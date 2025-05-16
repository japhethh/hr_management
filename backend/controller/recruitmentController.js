import expressAsyncHandler from "express-async-handler"
import recruitmentService from "../services/recruitment.service.js"

export const getRecruitments = expressAsyncHandler(async (req, res) => {
  const recruitments = await recruitmentService.getRecruitments()
  res.status(200).json(recruitments)
})

export const getRecruitmentById = expressAsyncHandler(async (req, res) => {
  const recruitment = await recruitmentService.getRecruitmentById(req.params.id)
  if (!recruitment) {
    res.status(404).json({ message: "Recruitment posting not found!" })
    return
  }
  res.status(200).json(recruitment)
})

export const createRecruitment = expressAsyncHandler(async (req, res) => {
  console.log(req.body)
  const newRecruitment = await recruitmentService.createRecruitment(req.body)
  res.status(201).json(newRecruitment)
})

export const updateRecruitment = expressAsyncHandler(async (req, res) => {
  const updatedRecruitment = await recruitmentService.updateRecruitment(req.params.id, req.body)
  res.status(200).json(updatedRecruitment)
})

export const deleteRecruitment = expressAsyncHandler(async (req, res) => {
  const result = await recruitmentService.deleteRecruitment(req.params.id)
  res.status(200).json(result)
})

export const closeRecruitment = expressAsyncHandler(async (req, res) => {
  const result = await recruitmentService.closeRecruitment(req.params.id)
  res.status(200).json(result)
})
