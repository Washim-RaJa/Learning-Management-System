import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true 
}


const register = async (req, res, next) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return next(new AppError("All fields are required", 400))  // AppError handles errors wherever it's called.
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new AppError("Email already taken", 400))
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
        }
    })
    if (!user) {
        return next(new AppError("User registration falied, please try again!", 400))
    }
    // TODO: File Upload

    await user.save();

    // Generating/Creating a JWT token
    const token = await user.generateJWTToken()     // Defined in userSchema.methods in user.model.js

    // Setting the password to undefined so it does not get sent in the response
    user.password = undefined;
    
    // setting the generated token in res.cookie which will result login automatically after registration
    res.cookie('token', token, cookieOptions)
    
    
    res.status(201).json({
        success: true,
        message: "User registered successfully!",
        user
    })
}
const login = async (req, res) => {

}
const logout = async (req, res) => {

}
const getProfile = async (req, res) => {

}

export {
    register,
    login,
    logout,
    getProfile
}