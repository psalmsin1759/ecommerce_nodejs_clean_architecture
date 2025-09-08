import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { config } from "@/config/env";
import cors from "cors"; 
import { connectDB } from "@/config/db";
import { setupSwagger } from "@/presentation/config/swagger";
import categoryRouter from "@/presentation/http/routes/categoryRoutes"
import productRouter from "@/presentation/http/routes/productRoutes"

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000"], 
  credentials: true
}));

setupSwagger(app);

connectDB().catch((err) => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

app.use(express.json());
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server running...");
});

httpServer.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", reason);
  httpServer.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  httpServer.close(() => process.exit(1));
});
