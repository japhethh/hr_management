import expressAsyncHandler from "express-async-handler";
import employeeService from "../services/employee.service.js";

// Use export const instead of exports.
export const getEmployees = expressAsyncHandler(async (req, res) => {
  const employees = await employeeService.getEmployees();
  res.status(200).json(employees);
});

export const createEmployee = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
  const newEmployee = await employeeService.createEmployee(req.body);

  if (!newEmployee) res.status(404).json({ message: "Employee not found!" });
  res.status(201).json(newEmployee);
});

export const updateEmployee = expressAsyncHandler(async (req, res) => {
  const updatedEmployee = await employeeService.updateEmployee(
    req.params.id,
    req.body
  );
  res.status(200).json(updatedEmployee);
});

export const deleteEmployee = expressAsyncHandler(async (req, res) => {
  const result = await employeeService.deleteEmployee(req.params.id);
  res.status(200).json(result);
});
