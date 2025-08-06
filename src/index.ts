import express from "express";
import sequelize from "./config/database";
const app = express();
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database successfully");
  } catch (error) {
    console.log("database connection error", error);
  }
};
connectDB();
