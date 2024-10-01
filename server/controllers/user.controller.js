import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

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
          folder: "lms", // Save files in a folder named lms
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
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Email is required", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("Email is not registered", 400));
  }
  const resetToken = await user.generatePasswordResetToken();

  await user.save(); // saving forgotPassowordToken & forgotPassowordExpiry in userSchema

  console.log(resetToken);
  
  // constructing a url to send the correct data
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  // We here need to send an email to the user with the token
  const subject = "Reset Password";
  const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      message: `Reset password token has been sent to ${email} successfully!`,
    });
  } catch (error) {
    // If some error happened we need to clear the forgotPassword* fields in our DB
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();
    return next(new AppError(error.message, 500));
  }
};
const resetPassword = async (req, res, next) => {
  // Extracting resetToken from req.params object
  const { resetToken } = req.params;
  // new password which user will send in req.body
  const { password } = req.body;

  // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
  const forgotPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Check if password is not there then send response saying password is required
  if (!password) {
    return next(new AppError("Password is required", 400));
  }

  console.log(forgotPasswordToken);

  // Checking if token matches in DB and if it is still valid(Not expired)
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
  });
  // If not found or expired send the response
  if (!user) {
    return next(
      new AppError("Token is invalid or expired, please try again", 400)
    );
  }
  // Update the password if token is valid and not expired
  user.password = password;

  // making forgotPassword* valus undefined in the DB
  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  // Saving the updated user values
  await user.save();
  // Sending the response when everything goes good
  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
};
const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.user;    // already defined in isLoggedIn middleware
  if (!oldPassword || !newPassword) {
    return next(new AppError("All fields are mandatory",400))
  }
  const user = await User.findById(id).select("+password"); // specifically selecting password from db
  if (!user) {
    return next(new AppError("User doesn't exist",400))
  }
  const isPasswordValid = await user.comparePassword(oldPassword)
  if (!isPasswordValid) {
    return next(new AppError("Invalid old password",400))
  }
  user.password = newPassword;
  await user.save();
  user.password = undefined;
  res.status(200).json({
    success: true,
    message: "Password changed successfully!"
  })
}
const updateUser = async (req, res, next) => {
  const { fullName } = req.body;
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(
      new AppError("User doesn't exist", 400)
    )
  }
  if (fullName) {
    user.fullName = fullName
  }
  // Run only if user uploaded any profile image
  if (req.file) {
    // Deletes the old image uploaded by the user
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);

    // Then uploads the new image sent by the user
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "lms", // Save files in a folder named lms
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
  res.status(200).json({
    success: true,
    message: 'User details updated successfully',
  })
}
export { register, login, logout, getProfile, forgotPassword, resetPassword, changePassword, updateUser};
