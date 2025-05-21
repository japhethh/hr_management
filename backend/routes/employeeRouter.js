import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  notif,
  notifGet,
  updateEmployee,
} from "../controller/employeeController.js";

const employeeRouter = express.Router();
employeeRouter.get("/", getEmployees);
employeeRouter.post("/", createEmployee);
employeeRouter.put("/:id", updateEmployee);
employeeRouter.delete("/:id", deleteEmployee);
employeeRouter.post("/notif", notif);
employeeRouter.get("/notif", notifGet);

export default employeeRouter;
