import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Username and password are required." });
    }

    const user = await Models.UserModel.findOne({ username });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid username or password." });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid username or password." });
    }

    const token = generateToken(user._id);

    return res.status(StatusCodes.OK).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      },
      message: "User logged in successfully.",
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export default login;
