import employeeModel from "../models/employeeModel.js";

class EmployeeService {
  // Class name should be PascalCase
  async createEmployee(userData) {
    const newEmployee = new employeeModel(userData);
    const user =  await newEmployee.save();
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
    const employee = await employeeModel.findByIdAndUpdate(id, userData, {
      new: true,
    });
    if (!employee) throw new Error("Employee not found");
    return employee;
  }

  async deleteEmployee(id) {
    const result = await employeeModel.findByIdAndDelete(id);
    if (!result) throw new Error("Employee not found!");
    return { message: "Employee Deleted Successfully" };
  }
}

export default new EmployeeService(); // Export an instance
