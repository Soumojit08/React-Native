import express from "express";
const router = express.Router();
import Models from "../models/index.model.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middlewares/auth.middleware.js";

//create
router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //upload image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newBook = new Models.BookModel({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    return res.status(201).json({ message: "Book created successfully." });
  } catch (error) {
    console.log("Error upload book : ", error);
    return res.status(500).json({ message: "Error creating the book." });
  }
});

//get
//pagination => infinite loading
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = req.query.limit || 1;
    const limit = req.query.limit || 5;
    const skip = (page - 1) * limit;

    const books = await Models.BookModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileimage"); //desc order

      
    res.send(books);
  } catch (error) {
    console.log("Error fetching books: ", error);
    return res.status(500).json({ message: "Error fetching books." });
  }
});

//delete

//update

export default router;
