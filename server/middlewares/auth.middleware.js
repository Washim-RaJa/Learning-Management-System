import AppError from "../utils/error.util.js";
import jwt from 'jsonwebtoken'

const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new AppError("Unauthenticated, please login again", 401));
    }
    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails

    next();
}

// This is a closure which checks if user is admin or not
const authorizeRoles = (...roles) => async (req, res, next) => {
    const currentUserRoles = req.user.role;
    // If given array of roles doesn't include role which requested user have
    if (!roles.includes(currentUserRoles)) {
        return next(
            new AppError("You do not have permission to access this route", 403)
        );
    }
    next();
}


export {
    isLoggedIn,
    authorizeRoles
}