import sequelize from "../config/database";
import attendanceModel from "./attendance.model";
import LeaveRequestModel from "./leave_request.model";
import tokenModel from "./token.model";
import userModel from "./user.model";
import EmployeeLeaveSummaryModel from "./employee_leave_summary.model";
import PublicHolidayModel from "./public_holidays.model";
import EmployeeModel from "./employee.model";
import EmployeeSalaryModel from "./employee_salary.model";
const User = userModel(sequelize);
const Token = tokenModel(sequelize);
const Attendance = attendanceModel(sequelize);
const LeaveRequest = LeaveRequestModel(sequelize);
const EmployeeLeaveSummary = EmployeeLeaveSummaryModel(sequelize);
const PublicHoliday = PublicHolidayModel(sequelize);
const Employee = EmployeeModel(sequelize);
const EmployeeSalary = EmployeeSalaryModel(sequelize);
// relationship
// User.hasMany(Token, {
//   foreignKey: "userId",
// });

// Token.belongsTo(User, {
//   foreignKey: "userId",
// });

// Attendance.belongsTo(User, {
//   foreignKey: "employeeId",
//    as:"employee_details"
// });

// User.hasMany(Attendance, {
//   foreignKey: 'employeeId',

// })

export {
  User,
  Token,
  Attendance,
  LeaveRequest,
  EmployeeLeaveSummary,
  PublicHoliday,
  Employee,
  EmployeeSalary,
};
