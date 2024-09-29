import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true,
  // secure: process.env.NODE_ENV === 'production' ? true : false,
};

const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return next(new AppError("All fields are required", 400)); // AppError handles errors wherever it's called.
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError("Email already taken", 400));
    }

    const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_id: email,
        secure_url:
          "https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg",
      },
    });
    if (!user) {
      return next(
        new AppError("User registration falied, please try again!", 400)
      );
    }

    console.log("File Details", req.file);
    // Run only if user sends a file
    if (req.file) {
      try {
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "lms",    // Save files in a folder named lms
          width: 250,
          height: 250,
          gravity: "faces", // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
          crop: "fill",
        });
        if (result) {
          // Set the public_id and secure_url in DB
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          // After successful upload remove the file from local storage(from uploads folder)
          fs.rm(`uploads/${req.file.filename}`);
        }
      } catch (error) {
        return next(
          new AppError(error || "File not uploaded, please try again", 400)
        );
      }
    }

    await user.save();

    // Generating/Creating a JWT token
    const token = await user.generateJWTToken(); // Defined in userSchema.methods in user.model.js

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;

    // setting the generated token in res.cookie which will result login automatically after registration
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("All fields are required", 400));
    }
    const user = await User.findOne({ email }).select("+password"); // If exists then give password to the user too

    if (!user || !user.comparePassword(password)) {
      return next(
        new AppError(
          "Email or Password do not match or user does not exist",
          401
        )
      );
    }

    const token = await user.generateJWTToken();
    user.password = undefined;

    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};
const logout = async (req, res) => {
  res.cookie("token", null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "User logged out successfully!",
  });
};
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    res.status(200).json({
      success: true,
      message: "User details",
      user,
    });
  } catch (error) {
    return next(new AppError("Failed to fetch profile details", 500));
  }
};

export { register, login, logout, getProfile };
