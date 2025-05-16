import express from "express"
import {
  createRecruitment,
  deleteRecruitment,
  getRecruitments,
  getRecruitmentById,
  updateRecruitment,
  closeRecruitment,
} from "../controller/recruitmentController.js"

const recruitmentRouter = express.Router()

recruitmentRouter.get("/", getRecruitments)
recruitmentRouter.get("/:id", getRecruitmentById)
recruitmentRouter.post("/", createRecruitment)
recruitmentRouter.put("/:id", updateRecruitment)
recruitmentRouter.delete("/:id", deleteRecruitment)
recruitmentRouter.patch("/:id/close", closeRecruitment)

export default recruitmentRouter
