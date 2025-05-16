import timeAttendanceModel from "../models/timeAttendance.js";

class TimeAttendanceService {
  async createTimeAttendance(timeAttendanceData) {
    const newTimeAttendance = new timeAttendanceModel(timeAttendanceData);
    const timeAttendance = await newTimeAttendance.save();
    return timeAttendance;
  }

  async getTimeAttendances() {
    return await timeAttendanceModel.find({}).populate("EmployeeId");
  }

  async getTimeAttendanceById(id) {
    const timeAttendance = await timeAttendanceModel
      .findById(id)
      .populate("EmployeeId");
    if (!timeAttendance) throw new Error("Time attendance record not found!");
    return timeAttendance;
  }

  async getTimeAttendanceByEmployeeId(employeeId) {
    // If employeeId is "all", return all records
    if (employeeId === "all") {
      return await timeAttendanceModel.find({}).populate("EmployeeId");
    }

    // Otherwise, filter by the specific employee ID
    const timeAttendances = await timeAttendanceModel
      .find({ EmployeeId: employeeId })
      .populate("EmployeeId");
    return timeAttendances;
  }

  async getTimeAttendanceByDateRange(startDate, endDate) {
    const timeAttendances = await timeAttendanceModel
      .find({
        workDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .populate("EmployeeId");
    return timeAttendances;
  }

  async updateTimeAttendance(id, timeAttendanceData) {
    // Handle nested structure if present
    if (timeAttendanceData?.timeAttendanceData && timeAttendanceData?.id) {
      id = timeAttendanceData.id;
      timeAttendanceData = timeAttendanceData.timeAttendanceData;
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...timeAttendanceData };
    delete updateData._id;
    delete updateData.__v;

    try {
      const timeAttendance = await timeAttendanceModel
        .findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true, runValidators: true }
        )
        .populate("EmployeeId");

      if (!timeAttendance) throw new Error("Time attendance record not found");
      return timeAttendance;
    } catch (error) {
      // Provide specific error messages based on error type
      if (error.name === "CastError")
        throw new Error("Invalid time attendance ID format");
      if (error.name === "ValidationError")
        throw new Error(`Validation error: ${error.message}`);
      throw error;
    }
  }

  async deleteTimeAttendance(id) {
    const result = await timeAttendanceModel.findByIdAndDelete(id);
    if (!result) throw new Error("Time attendance record not found!");
    return { message: "Time attendance record deleted successfully" };
  }

  async clockIn(employeeId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if there's already a record for today
    const existingRecord = await timeAttendanceModel.findOne({
      EmployeeId: employeeId,
      workDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingRecord) {
      if (existingRecord.ClockIn) {
        throw new Error("Employee has already clocked in today");
      }

      // Update existing record
      existingRecord.ClockIn = new Date().toLocaleTimeString();
      existingRecord.Status = "Present";
      await existingRecord.save();
      return existingRecord;
    }

    // Create new record
    const newTimeAttendance = new timeAttendanceModel({
      EmployeeId: employeeId,
      workDate: new Date(),
      ClockIn: new Date().toLocaleTimeString(),
      Status: "Present",
    });

    return await newTimeAttendance.save();
  }

  async clockOut(employeeId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's record
    const existingRecord = await timeAttendanceModel.findOne({
      EmployeeId: employeeId,
      workDate: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!existingRecord) {
      throw new Error("No clock-in record found for today");
    }

    if (!existingRecord.ClockIn) {
      throw new Error("Employee has not clocked in yet");
    }

    if (existingRecord.ClockOut) {
      throw new Error("Employee has already clocked out today");
    }

    // Update record with clock out time
    existingRecord.ClockOut = new Date().toLocaleTimeString();

    // Calculate hours worked
    const clockIn = existingRecord.ClockIn.split(":");
    const clockOut = existingRecord.ClockOut.split(":");

    const clockInDate = new Date();
    clockInDate.setHours(
      Number.parseInt(clockIn[0]),
      Number.parseInt(clockIn[1]),
      Number.parseInt(clockIn[2] || 0)
    );

    const clockOutDate = new Date();
    clockOutDate.setHours(
      Number.parseInt(clockOut[0]),
      Number.parseInt(clockOut[1]),
      Number.parseInt(clockOut[2] || 0)
    );

    const hoursWorked = (clockOutDate - clockInDate) / (1000 * 60 * 60);

    // Store hours worked as a Date object (as per your schema)
    const hoursWorkedDate = new Date();
    hoursWorkedDate.setHours(Math.floor(hoursWorked));
    hoursWorkedDate.setMinutes((hoursWorked % 1) * 60);
    hoursWorkedDate.setSeconds(0);

    existingRecord.HoursWorked = hoursWorkedDate;

    await existingRecord.save();
    return existingRecord;
  }

  async markAbsent(employeeId, date) {
    const workDate = date ? new Date(date) : new Date();
    workDate.setHours(0, 0, 0, 0);

    // Check if there's already a record for this date
    const existingRecord = await timeAttendanceModel.findOne({
      EmployeeId: employeeId,
      workDate: {
        $gte: workDate,
        $lt: new Date(workDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingRecord) {
      existingRecord.Status = "Absent";
      await existingRecord.save();
      return existingRecord;
    }

    // Create new record
    const newTimeAttendance = new timeAttendanceModel({
      EmployeeId: employeeId,
      workDate: workDate,
      Status: "Absent",
    });

    return await newTimeAttendance.save();
  }

  async markLeave(employeeId, date) {
    const workDate = date ? new Date(date) : new Date();
    workDate.setHours(0, 0, 0, 0);

    // Check if there's already a record for this date
    const existingRecord = await timeAttendanceModel.findOne({
      EmployeeId: employeeId,
      workDate: {
        $gte: workDate,
        $lt: new Date(workDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (existingRecord) {
      existingRecord.Status = "Leave";
      await existingRecord.save();
      return existingRecord;
    }

    // Create new record
    const newTimeAttendance = new timeAttendanceModel({
      EmployeeId: employeeId,
      workDate: workDate,
      Status: "Leave",
    });

    return await newTimeAttendance.save();
  }

  async getAttendanceSummary(startDate, endDate) {
    const query = {};

    if (startDate && endDate) {
      query.workDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await timeAttendanceModel
      .find(query)
      .populate("EmployeeId");

    const summary = {
      total: records.length,
      present: records.filter((r) => r.Status === "Present").length,
      absent: records.filter((r) => r.Status === "Absent").length,
      leave: records.filter((r) => r.Status === "Leave").length,
      late: records.filter((r) => r.Status === "Late").length,
    };

    return summary;
  }
}

export default new TimeAttendanceService(); // Export an instance
