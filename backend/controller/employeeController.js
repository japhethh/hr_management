import expressAsyncHandler from "express-async-handler";
import employeeService from "../services/employee.service.js";

exports.getEmployees = expressAsyncHandler(async (req, res) => {
  const employee = await employeeService.getEmployees();

  res.status(200).json(employee);
});

exports.createEmployee = expressAsyncHandler(async (req, res) => {
  const newEmployee = await employeeService.createEmployee(req.body);

  res.status(201).json(newEmployee);
});

exports.updateEmployee = expressAsyncHandler(async (req, res) => {
  const updatedEmployee = await employeeService.updateEmployee(
    req.params.id,
    req.body
  );

  res.status(200).json(updatedEmployee);
});

exports.deleteEmployee = expressAsyncHandler(async (req, res) => {
  const deletedEmployee = await employeeService.deleteEmployee(req.params.id);

  res.status(200).json(deletedEmployee);
});
