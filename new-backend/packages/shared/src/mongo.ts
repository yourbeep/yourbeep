import mongoose from "mongoose";
import { logger } from "./logger";

export const connectMongo = async (uri: string, serviceName: string) => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(uri);
  logger.info({ serviceName }, "MongoDB connected");
  return mongoose.connection;
};
