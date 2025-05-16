import recruitmentModel from "../models/recruitmentModel.js";

class RecruitmentService {
  async createRecruitment(recruitmentData) {
    // Set default postDate to current date if not provided
    if (!recruitmentData.postDate) {
      recruitmentData.postDate = new Date();
    }

    const newRecruitment = new recruitmentModel(recruitmentData);
    const recruitment = await newRecruitment.save();
    return recruitment;
  }

  async getRecruitments() {
    return await recruitmentModel.find({});
  }

  async getRecruitmentById(id) {
    const recruitment = await recruitmentModel.findById(id);
    if (!recruitment) throw new Error("Recruitment posting not found!");
    return recruitment;
  }

  async updateRecruitment(id, recruitmentData) {
    // Handle nested structure if present
    if (recruitmentData?.recruitmentData && recruitmentData?.id) {
      id = recruitmentData.id;
      recruitmentData = recruitmentData.recruitmentData;
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...recruitmentData };
    delete updateData._id;
    delete updateData.__v;

    try {
      const recruitment = await recruitmentModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!recruitment) throw new Error("Recruitment posting not found");
      return recruitment;
    } catch (error) {
      // Provide specific error messages based on error type
      if (error.name === "CastError")
        throw new Error("Invalid recruitment ID format");
      if (error.name === "ValidationError")
        throw new Error(`Validation error: ${error.message}`);
      throw error;
    }
  }

  async deleteRecruitment(id) {
    const result = await recruitmentModel.findByIdAndDelete(id);
    if (!result) throw new Error("Recruitment posting not found!");
    return { message: "Recruitment Posting Deleted Successfully" };
  }

  async closeRecruitment(id) {
    const recruitment = await recruitmentModel.findById(id);
    if (!recruitment) throw new Error("Recruitment posting not found!");

    recruitment.status = "closed";
    await recruitment.save();
    return { message: "Recruitment Posting Closed Successfully" };
  }
}

export default new RecruitmentService(); // Export an instance
