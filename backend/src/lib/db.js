import mongoose from "mongoose";
import chalk from "chalk";

const connectToDB = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGO_URI);
    console.log(chalk.bgBlack.white.bold("Database connected successfully:"));
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectToDB;
