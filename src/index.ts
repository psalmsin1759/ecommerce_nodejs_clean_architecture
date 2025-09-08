import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import cors from "cors"; 

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000"], 
  credentials: true
}));

app.get("/", (req: Request, res: Response) => {
  res.send("Server running...");
});

httpServer.listen(3001, () => {
  console.log(`Server listening on port 3001`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  httpServer.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  httpServer.close(() => process.exit(1));
});
