import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto'

// Defining Schema
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      lowercase: true,
      trim: true, // Removes unnecessary spaces
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name should be less than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill a valid email address",
      ], // Matches email against regex
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Will not select password upon looking up a document
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // Possible types of users
      default: "USER", // Upon registration client will be created as normal user.
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
      id: String,
      status: String
    }
  },
  { timestamps: true }
);

// If user changes the password then Hash it before saving to the database.
userSchema.pre("save", async function (next) {
  // Here "this" refers to the user document being saved

  //  If the password field has not been modified, then do not hash it and the function will return false.
  if (!this.isModified("password")) {
    return next();
  }
  // If user changes the password then hash the new password
  this.password = await bcrypt.hash(this.password, 10);
});

// Defining method in userSchema
userSchema.methods = {
  // method which will help us compare plain password with hashed password and returns true or false
  comparePassword: async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
  },
  // Will generate a JWT token with user id as payload
  generateJWTToken: async function () {
    return await jwt.sign(
      {
        id: this._id,
        email: this.email,
        subscription: this.subscription,
        role: this.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
  },
  // This will generate a token for password reset
  generatePasswordResetToken: async function () {
    // creating a random token using node's built-in crypto module
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Again using crypto module to hash the generated resetToken with sha256 algorithm and storing it in database
    this.forgotPasswordToken = crypto // forgotPasswordToken is defined in userSchema
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Adding forgot password expiry to 15 minutes from current time
    this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;

    return resetToken;  // returning unencrypted token to user

  },

};
const User = model("User", userSchema);

export default User;
