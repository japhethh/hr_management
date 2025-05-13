import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../controller/employeeController.js";

const employeeRouter = express.Router();
employeeRouter.get("/", getEmployees);
employeeRouter.post("/", createEmployee);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);

export default employeeRouter;
