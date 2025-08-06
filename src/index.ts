import express, { urlencoded } from "express";
import sequelize from "./config/database";
import GlobalErrorHandler from "./controller/error.controller";
import app_routes from "./routes";
import cookieParser from "cookie-parser";
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cookieParser());
app.use(
  urlencoded({
    extended: true,
  })
);
app.use("/api/v1", app_routes);

app.use(GlobalErrorHandler);

// syncing database

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

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("database synced");
  } catch (error) {
    console.error("error syncing database file", error);
  }
})();

export default app;
