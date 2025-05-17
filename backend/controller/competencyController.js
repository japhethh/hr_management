import expressAsyncHandler from "express-async-handler";
import competencyService from "../services/competency.service.js";

export const getCompetencies = expressAsyncHandler(async (req, res) => {
  const competencies = await competencyService.getCompetencies();
  res.status(200).json(competencies);
});

export const getCompetencyById = expressAsyncHandler(async (req, res) => {
  const competency = await competencyService.getCompetencyById(req.params.id);
  if (!competency) {
    res.status(404).json({ message: "Competency record not found!" });
    return;
  }
  res.status(200).json(competency);
});

export const getCompetenciesByEmployeeId = expressAsyncHandler(
  async (req, res) => {
    const competencies = await competencyService.getCompetenciesByEmployeeId(
      req.params.employeeId
    );
    res.status(200).json(competencies);
  }
);

export const getCompetenciesBySkillLevel = expressAsyncHandler(
  async (req, res) => {
    const competencies = await competencyService.getCompetenciesBySkillLevel(
      req.params.skillLevel
    );
    res.status(200).json(competencies);
  }
);

export const createCompetency = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const newCompetency = await competencyService.createCompetency(req.body);
  res.status(201).json(newCompetency);
});

export const updateCompetency = expressAsyncHandler(async (req, res) => {
  const updatedCompetency = await competencyService.updateCompetency(
    req.params.id,
    req.body
  );
  res.status(200).json(updatedCompetency);
});

export const deleteCompetency = expressAsyncHandler(async (req, res) => {
  const result = await competencyService.deleteCompetency(req.params.id);
  res.status(200).json(result);
});

export const getSkillDistribution = expressAsyncHandler(async (req, res) => {
  const distribution = await competencyService.getSkillDistribution();
  res.status(200).json(distribution);
});

export const getTopSkills = expressAsyncHandler(async (req, res) => {
  const { limit } = req.query;
  const topSkills = await competencyService.getTopSkills(
    limit ? Number.parseInt(limit) : 5
  );
  res.status(200).json(topSkills);
});

export const getCertificationStats = expressAsyncHandler(async (req, res) => {
  const stats = await competencyService.getCertificationStats();
  res.status(200).json(stats);
});
