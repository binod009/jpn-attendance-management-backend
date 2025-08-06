import dotenv from "dotenv";
dotenv.config();

const config = {
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
};

export default config;
