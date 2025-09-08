import dotenv from "dotenv";

dotenv.config();

export const config = {
  host: process.env.HOST || "http://localhost",
  port: process.env.SERVER_PORT || 3000,
  env: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mydb",
  jwtSecret: process.env.JWT_SECRET || "secret112222",
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
