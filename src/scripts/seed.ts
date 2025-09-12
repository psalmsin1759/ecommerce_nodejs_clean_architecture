import mongoose from "mongoose";
import { seedOrders } from "../infrastructure/database/seed/order.seed";
import { config } from "../config/env";

async function run() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(" Connected to MongoDB");

    await seedOrders(50);

    await mongoose.disconnect();
    console.log(" Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error(" Seeding failed", err);
    process.exit(1);
  }
}

run();
