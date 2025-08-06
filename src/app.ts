import express, { application, urlencoded } from "express";
import sequelize from "./config/database";
const PORT = 3000;

const app = express();

app.use(express.json());
// syncing database
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("database synced");
  } catch (error) {
    console.error("error syncing database file", error);
  }
})();

export default app;
