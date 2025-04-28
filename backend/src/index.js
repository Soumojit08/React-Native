import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import authRoutes from "./routes/auth.route.js";
import bookRoutes from "./routes/book.route.js"
import connectToDB from "./lib/db.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(PORT, () => {
  connectToDB();
  console.log(chalk.yellow.bgGreen.bold(`server is running on port : ${PORT}`));
});
