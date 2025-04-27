import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import authRoutes from "./routes/authRoutes.js";
import connectToDB from "./lib/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectToDB();
  console.log(chalk.yellow.bgGreen.bold(`server is running on port : ${PORT}`));
});
