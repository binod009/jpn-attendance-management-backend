import sequelize from "../config/database";
import tokenModel from "./token.model";
import userModel from "./user.model";

const User = userModel(sequelize);
const Token = tokenModel(sequelize);

// relationship
User.hasMany(Token, {
  foreignKey: "userId",
});

Token.belongsTo(User, {
  foreignKey: "userId",
});

export { User, Token };
