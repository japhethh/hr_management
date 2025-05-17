import competencyModel from "../models/compentencyModel.js";

class CompetencyService {
  async createCompetency(competencyData) {
    const newCompetency = new competencyModel(competencyData);
    const competency = await newCompetency.save();
    return competency;
  }

  async getCompetencies() {
    return await competencyModel.find({}).populate("EmployeeID");
  }

  async getCompetencyById(id) {
    const competency = await competencyModel
      .findById(id)
      .populate("EmployeeID");
    if (!competency) throw new Error("Competency record not found!");
    return competency;
  }

  async getCompetenciesByEmployeeId(employeeId) {
    // If employeeId is "all", return all records
    if (employeeId === "all") {
      return await competencyModel.find({}).populate("EmployeeID");
    }

    const competencies = await competencyModel
      .find({ EmployeeID: employeeId })
      .populate("EmployeeID");
    return competencies;
  }

  async getCompetenciesBySkillLevel(skillLevel) {
    const competencies = await competencyModel
      .find({ SkillLevel: skillLevel })
      .populate("EmployeeID");
    return competencies;
  }

  async updateCompetency(id, competencyData) {
    // Handle nested structure if present
    if (competencyData?.competencyData && competencyData?.id) {
      id = competencyData.id;
      competencyData = competencyData.competencyData;
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...competencyData };
    delete updateData._id;
    delete updateData.__v;

    try {
      const competency = await competencyModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        )
        .populate("EmployeeID");

      if (!competency) throw new Error("Competency record not found");
      return competency;
    } catch (error) {
      // Provide specific error messages based on error type
      if (error.name === "CastError")
        throw new Error("Invalid competency ID format");
      if (error.name === "ValidationError")
        throw new Error(`Validation error: ${error.message}`);
      throw error;
    }
  }

  async deleteCompetency(id) {
    const result = await competencyModel.findByIdAndDelete(id);
    if (!result) throw new Error("Competency record not found!");
    return { message: "Competency record deleted successfully" };
  }

  async getSkillDistribution() {
    const skillDistribution = await competencyModel.aggregate([
      {
        $group: {
          _id: "$SkillLevel",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Transform to a more usable format
    const result = {
      Beginner: 0,
      Intermediate: 0,
      Advanced: 0,
      Expert: 0,
    };

    skillDistribution.forEach((item) => {
      result[item._id] = item.count;
    });

    return result;
  }

  async getTopSkills(limit = 5) {
    const topSkills = await competencyModel.aggregate([
      {
        $group: {
          _id: "$SkillName",
          count: { $sum: 1 },
          averageLevel: {
            $avg: {
              $switch: {
                branches: [
                  { case: { $eq: ["$SkillLevel", "Beginner"] }, then: 1 },
                  { case: { $eq: ["$SkillLevel", "Intermediate"] }, then: 2 },
                  { case: { $eq: ["$SkillLevel", "Advanced"] }, then: 3 },
                  { case: { $eq: ["$SkillLevel", "Expert"] }, then: 4 },
                ],
                default: 0,
              },
            },
          },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
    ]);

    return topSkills;
  }

  async getCertificationStats() {
    const totalEmployees = await competencyModel.aggregate([
      {
        $group: {
          _id: "$EmployeeID",
          count: { $sum: 1 },
        },
      },
    ]);

    const withCertification = await competencyModel.aggregate([
      {
        $match: {
          Certification: { $ne: null, $ne: "" },
        },
      },
      {
        $group: {
          _id: "$EmployeeID",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalEmployees: totalEmployees.length,
      withCertification: withCertification.length,
      certificationRate:
        totalEmployees.length > 0
          ? (withCertification.length / totalEmployees.length) * 100
          : 0,
    };
  }
}

export default new CompetencyService(); // Export an instance
