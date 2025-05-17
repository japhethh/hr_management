import employeeModel from "../models/employeeModel.js";
import competencyModel from "../models/compentencyModel.js";
import hrAnalyticsModel from "../models/hr-analyticsModel.js";
import timeAttendanceModel from "../models/timeAttendance.js";

class HrAnalyticsService {
  async createHrAnalytics(hrAnalyticsData) {
    const newHrAnalytics = new hrAnalyticsModel(hrAnalyticsData);
    const hrAnalytics = await newHrAnalytics.save();
    return hrAnalytics;
  }

  async getHrAnalytics() {
    return await hrAnalyticsModel.find({});
  }

  async getHrAnalyticsById(id) {
    const hrAnalytics = await hrAnalyticsModel.findById(id);
    if (!hrAnalytics) throw new Error("HR Analytics record not found!");
    return hrAnalytics;
  }

  async getHrAnalyticsByEmployeeId(employeeId) {
    // If employeeId is "all", return all records
    if (employeeId === "all") {
      return await hrAnalyticsModel.find({});
    }

    const hrAnalytics = await hrAnalyticsModel.find({ EmployeeID: employeeId });
    return hrAnalytics;
  }

  async updateHrAnalytics(id, hrAnalyticsData) {
    // Handle nested structure if present
    if (hrAnalyticsData?.hrAnalyticsData && hrAnalyticsData?.id) {
      id = hrAnalyticsData.id;
      hrAnalyticsData = hrAnalyticsData.hrAnalyticsData;
    }

    // Remove fields that shouldn't be updated
    const updateData = { ...hrAnalyticsData };
    delete updateData._id;
    delete updateData.__v;

    try {
      const hrAnalytics = await hrAnalyticsModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!hrAnalytics) throw new Error("HR Analytics record not found");
      return hrAnalytics;
    } catch (error) {
      // Provide specific error messages based on error type
      if (error.name === "CastError")
        throw new Error("Invalid HR Analytics ID format");
      if (error.name === "ValidationError")
        throw new Error(`Validation error: ${error.message}`);
      throw error;
    }
  }

  async deleteHrAnalytics(id) {
    const result = await hrAnalyticsModel.findByIdAndDelete(id);
    if (!result) throw new Error("HR Analytics record not found!");
    return { message: "HR Analytics record deleted successfully" };
  }

  async generateHrAnalytics(employeeId) {
    // Check if employee exists
    const employee = await employeeModel.findById(employeeId);
    if (!employee) throw new Error("Employee not found!");

    // Get attendance data
    const attendanceRecords = await timeAttendanceModel.find({
      EmployeeId: employeeId,
    });

    // Calculate attendance rate
    const totalRecords = attendanceRecords.length;
    const presentRecords = attendanceRecords.filter(
      (record) => record.Status === "Present"
    ).length;
    const attendanceRate =
      totalRecords > 0
        ? ((presentRecords / totalRecords) * 100).toFixed(2)
        : "0";

    // Calculate average hours worked
    let totalHoursWorked = 0;
    let recordsWithHours = 0;

    for (const record of attendanceRecords) {
      if (record.HoursWorked) {
        const hoursWorkedDate = new Date(record.HoursWorked);
        const hours =
          hoursWorkedDate.getHours() + hoursWorkedDate.getMinutes() / 60;
        totalHoursWorked += hours;
        recordsWithHours++;
      }
    }

    const avgHoursWorked =
      recordsWithHours > 0
        ? (totalHoursWorked / recordsWithHours).toFixed(2)
        : "0";

    // Get competency data
    const competencyRecords = await competencyModel.find({
      EmployeeID: employeeId,
    });

    // Calculate competency score
    let competencyScore = 0;

    for (const record of competencyRecords) {
      switch (record.SkillLevel) {
        case "Beginner":
          competencyScore += 1;
          break;
        case "Intermediate":
          competencyScore += 2;
          break;
        case "Advanced":
          competencyScore += 3;
          break;
        case "Expert":
          competencyScore += 4;
          break;
      }
    }

    const avgCompetencyScore =
      competencyRecords.length > 0
        ? (competencyScore / competencyRecords.length).toFixed(2)
        : "0";

    // Create or update HR Analytics record
    const existingRecord = await hrAnalyticsModel.findOne({
      EmployeeID: employeeId,
    });

    if (existingRecord) {
      existingRecord.AttendanceRate = attendanceRate;
      existingRecord.AvgHoursWorked = avgHoursWorked;
      existingRecord.CompentencyScore = avgCompetencyScore;
      await existingRecord.save();
      return existingRecord;
    } else {
      const newHrAnalytics = new hrAnalyticsModel({
        AnalyticsID: `ANA-${Date.now()}`,
        EmployeeID: employeeId,
        ReviewID: `REV-${Date.now()}`,
        AttendanceRate: attendanceRate,
        AvgHoursWorked: avgHoursWorked,
        CompentencyScore: avgCompetencyScore,
      });

      return await newHrAnalytics.save();
    }
  }

  async generateAllHrAnalytics() {
    const employees = await employeeModel.find({});
    const results = [];

    for (const employee of employees) {
      try {
        const analytics = await this.generateHrAnalytics(employee._id);
        results.push(analytics);
      } catch (error) {
        console.error(
          `Error generating analytics for employee ${employee._id}:`,
          error
        );
      }
    }

    return results;
  }

  async getEmployeePerformanceMetrics() {
    const analytics = await hrAnalyticsModel.find({});

    // Map employee IDs to get employee details
    const employeeIds = analytics.map((a) => a.EmployeeID);
    const employees = await employeeModel.find({ _id: { $in: employeeIds } });

    // Create a map of employee ID to employee details
    const employeeMap = {};
    employees.forEach((emp) => {
      employeeMap[emp._id.toString()] = emp;
    });

    // Combine analytics with employee details
    const performanceMetrics = analytics.map((a) => {
      const employee = employeeMap[a.EmployeeID];
      return {
        employeeId: a.EmployeeID,
        employeeName: employee
          ? `${employee.FirstName} ${employee.LastName}`
          : "Unknown Employee",
        department: employee ? employee.DepartmentId : "Unknown",
        attendanceRate: Number.parseFloat(a.AttendanceRate || 0),
        avgHoursWorked: Number.parseFloat(a.AvgHoursWorked || 0),
        competencyScore: Number.parseFloat(a.CompentencyScore || 0),
        overallScore:
          (Number.parseFloat(a.AttendanceRate || 0) * 0.3 +
            Number.parseFloat(a.AvgHoursWorked || 0) * 0.3 +
            Number.parseFloat(a.CompentencyScore || 0) * 25) /
          3,
      };
    });

    return performanceMetrics;
  }

  async getDepartmentPerformanceMetrics() {
    const performanceMetrics = await this.getEmployeePerformanceMetrics();

    // Group by department
    const departmentMap = {};

    performanceMetrics.forEach((metric) => {
      if (!departmentMap[metric.department]) {
        departmentMap[metric.department] = {
          department: metric.department,
          employeeCount: 0,
          totalAttendanceRate: 0,
          totalAvgHoursWorked: 0,
          totalCompetencyScore: 0,
        };
      }

      departmentMap[metric.department].employeeCount++;
      departmentMap[metric.department].totalAttendanceRate +=
        metric.attendanceRate;
      departmentMap[metric.department].totalAvgHoursWorked +=
        metric.avgHoursWorked;
      departmentMap[metric.department].totalCompetencyScore +=
        metric.competencyScore;
    });

    // Calculate averages
    const departmentMetrics = Object.values(departmentMap).map((dept) => {
      return {
        department: dept.department,
        employeeCount: dept.employeeCount,
        avgAttendanceRate:
          dept.employeeCount > 0
            ? (dept.totalAttendanceRate / dept.employeeCount).toFixed(2)
            : "0",
        avgHoursWorked:
          dept.employeeCount > 0
            ? (dept.totalAvgHoursWorked / dept.employeeCount).toFixed(2)
            : "0",
        avgCompetencyScore:
          dept.employeeCount > 0
            ? (dept.totalCompetencyScore / dept.employeeCount).toFixed(2)
            : "0",
      };
    });

    return departmentMetrics;
  }

  async getTopPerformers(limit = 5) {
    const performanceMetrics = await this.getEmployeePerformanceMetrics();

    // Sort by overall score
    const sortedMetrics = performanceMetrics.sort(
      (a, b) => b.overallScore - a.overallScore
    );

    return sortedMetrics.slice(0, limit);
  }
}

export default new HrAnalyticsService(); // Export an instance
