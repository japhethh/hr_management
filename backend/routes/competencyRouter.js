import express from "express";
import {
  createCompetency,
  deleteCompetency,
  getCompetencies,
  getCompetencyById,
  getCompetenciesByEmployeeId,
  getCompetenciesBySkillLevel,
  updateCompetency,
  getSkillDistribution,
  getTopSkills,
  getCertificationStats,
} from "../controller/competencyController.js";

const competencyRouter = express.Router();

// Basic CRUD routes
competencyRouter.get("/", getCompetencies);
competencyRouter.get("/skill-distribution", getSkillDistribution);
competencyRouter.get("/top-skills", getTopSkills);
competencyRouter.get("/certification-stats", getCertificationStats);
competencyRouter.get("/employee/:employeeId", getCompetenciesByEmployeeId);
competencyRouter.get("/skill-level/:skillLevel", getCompetenciesBySkillLevel);
competencyRouter.get("/:id", getCompetencyById);
competencyRouter.post("/", createCompetency);
competencyRouter.put("/:id", updateCompetency);
competencyRouter.delete("/:id", deleteCompetency);

export default competencyRouter;
