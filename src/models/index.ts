import sequelize from "../config/database";
import attendanceModel from "./attendance.model";
import tokenModel from "./token.model";
import userModel from "./user.model";

const User = userModel(sequelize);
const Token = tokenModel(sequelize);
const Attendance = attendanceModel(sequelize);
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

export { User, Token, Attendance };
