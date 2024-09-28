import { Schema, model } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Name is required"],
    lowercase: true,
    trim: true,     // Removes unnecessary spaces
    minlength: [3, "Name must be at least 5 characters"],
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
        type: String
    },
    secure_url: {
        type: String
    }
  },
  roles: {
    type: String,
    enum: ['USER', 'ADMIN'],  // Possible types of users
    default: 'USER'     // Upon registration client will be created as normal user.
  },
  forgotPassowordToken: String,
  forgotPassowordExpiry: Date

}, {timestamps: true});

const User = model("User", userSchema);

export default User;
