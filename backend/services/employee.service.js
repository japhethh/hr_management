import employeeModel from "../models/employeeModel.js";

class employeeService {
  async createEmployee(userData) {
    try {
      const newEmployee = new employeeModel(userData);

      await newEmployee.save();
      return newEmployee;
    } catch (error) {
      throw error;
    }
  }

  async getEmployees() {
    try {
      const data = await employeeModel.find({});
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(id, userData) {
    try {
      const employee = await employeeModel.findByIdAndUpdate(id, userData, {
        new: true,
      });

      if (!employee) throw new Error("Employee not found");

      return employee;
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(id) {
    try {
      const user = await employeeModel.findByIdAndDelete(id);

      if (!user) throw new Error("Employee not found!");

      return { message: "Employee Deleted Successfully" };
    } catch (error) {
      throw error;
    }
  }

  async getEmployeeId(id) {
    try {
      const user = await employeeModel.findById(id);

      if (!user) throw new Error("Employee not found!");
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default employeeService;
