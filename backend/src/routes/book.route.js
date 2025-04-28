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

//get : pagination => infinite loading
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

      const totalBooks = await Models.BookModel.countDocuments();

      res.send({
        books,
        currentPage: page,
        totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
      });
  } catch (error) {
    console.log("Error fetching books: ", error);
    return res.status(500).json({ message: "Error fetching books." });
  }
});

//get : recomended books for user 
router.get("/user", protectRoute, async(req, res)=>{
  try {
    const books = await Models.BookModel.find({user: req.user._id}).sort({ createdAt: -1 });
    res.json(books)
  } catch (error) {
    
    console.log("Error fetching user books: ", error);
    return res.status(500).json({ message: "Error fetching user books." });
  }
})

//delete
router.delete("/:id", protectRoute, async(req, res)=>{
  try {
    const id = req.params.id

    const book = await Models.BookModel.findById({id})

    if(!book){
      
      return res.status(404).json({ message: "Book not found." });
    }

    if(book.user.toString() !== req.user._id.toString()){
      return res.status(403).json({ message: "Unauthorized to delete this book." });
    }

    if(book.image && book.image.includes("cloudinary")){
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting image from cloudinary: ", error);
      }
    }

    await book.deleteOne();
    return res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    
    console.log("Error deleting book: ", error);
    return res.status(500).json({ message: "Error deleting the book." });
  }
})
//update


export default router;
