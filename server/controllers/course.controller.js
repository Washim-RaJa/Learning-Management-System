import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";

// TODO: - this route has not been tested yet
const getAllCourses = async function (req, res, next) {
    try {
        // Fetch everything except lectures array
        const courses = await Course.find({}).select("-lectures");
        if (!courses) {
            return next(new AppError("Courses not found", 400))
        }
        res.status(200).json({
            success: true,
            message: "All courses",
            courses
        })
    } catch (error) {
        next(new AppError(error.message, 500))
    }
}

// TODO: - this route has not been tested yet
const getLecturesByCourseId = async function (req, res, next) {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) {
            return next(new AppError("Invalid course id", 400))
        }
        res.status(200).json({
            success: true,
            message: "Course lectures fetched successfully!",
            lectures: course.lectures
        })
    } catch (error) {
        next(new AppError(error.message, 500))
    }
}

export {
    getAllCourses,
    getLecturesByCourseId,
}