
import sequelize from "../config/database";
import userModel from "./user.model";

const User = userModel(sequelize);




export { User };