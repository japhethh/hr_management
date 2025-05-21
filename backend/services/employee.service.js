import employeeModel from "../models/employeeModel.js";
import notifModel from "../models/notifModel.js";

class EmployeeService {
  // Class name should be PascalCase
  async createEmployee(userData) {
    // Integration

    const newNotif = new notifModel({ newNotif: userData });

    await newNotif.save();
    const newEmployee = new employeeModel(userData);

    const user = await newEmployee.save();
    return user;
  }

  async getEmployees() {
    return await employeeModel.find({});
  }

  async getEmployeeId(id) {
    const employee = await employeeModel.findById(id);
    if (!employee) throw new Error("Employee not found!");
    return employee;
  }

  async updateEmployee(id, userData) {
    // Handle nested structure if present
    if (userData?.userData && userData?.id) {
      id = userData.id;
      userData = userData.userData;
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...userData };
    delete updateData._id;
    delete updateData.__v;

    try {
      const employee = await employeeModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!employee) throw new Error("Employee not found");
      return employee;
    } catch (error) {
      // Provide specific error messages based on error type
      if (error.name === "CastError")
        throw new Error("Invalid employee ID format");
      if (error.name === "ValidationError")
        throw new Error(`Validation error: ${error.message}`);
      throw error;
    }
  }
  async deleteEmployee(id) {
    const result = await employeeModel.findByIdAndDelete(id);
    if (!result) throw new Error("Employee not found!");
    return { message: "Employee Deleted Successfully" };
  }

  // Class name should be PascalCase
  async notifIntegration(userData) {
    // Integration
    const newNotif = new notifModel(userData);

    const user = await newNotif.save();
    return user;
  }
  async notifIntegrationGet() {
    // Integration

    const data = await notifModel.find({});

    return data;
  }
}

export default new EmployeeService(); // Export an instance
