import { StatusCodes } from "http-status-codes";
import Models from "../../models/index.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const signup = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(StatusCodes.EXPECTATION_FAILED).json({
        status: "failed",
        message: "All fields are required.",
      });
    }

    if (password.length < 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "failed",
        message: "Password must be at least 6 characters long.",
      });
    }

    const existingUsername = await Models.UserModel.findOne({ username });

    if (existingUsername) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "failed",
        message: "Username already in use.",
      });
    }

    const existingEmail = await Models.UserModel.findOne({ email });

    if (existingEmail) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "failed",
        message: "Email already in use.",
      });
    }

    //get random avtar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await Models.UserModel.create({
      email,
      username,
      password: hashedPassword,
      profileImage,
    });

    const token = generateToken(user._id);

    return res.status(StatusCodes.CREATED).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
      },
      message: "User signed up successfully.",
    });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export default signup;
