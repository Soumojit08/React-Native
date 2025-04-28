import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Models from "../models/index.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await Models.UserModel.findById(decoded.userId).select(
      "-password"
    );

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in auth middleware : ", error);
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Invalid or expired token." });
  }
};

export default protectRoute;
