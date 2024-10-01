import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'

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

const createCourse = async function (req, res, next) {
    try {
        const { title, description, category, createdBy } = req.body;
        if (!title || !description || !category || !createdBy) {
            return next(new AppError("All fields are required", 400))
        }
        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: title,
                secure_url: createdBy
            }
        });
        if (!course) {
            return next(new AppError("Failed to create course", 500))
        }
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms'
                })
                if (result) {
                    course.thumbnail.public_id = result.public_id;
                    course.thumbnail.secure_url = result.secure_url
                }
                fs.rm(`uploads/${req.file.filename}`)
            } catch (error) {
                next(new AppError(error.message, 400))
            }
        }
        await course.save();
        res.status(201).json({
            success: true,
            message: "Course created successfully!",
            course
        })
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

const updateCourse = async function (req, res, next) {
    try {
        const { id } = req.params;
        // take whatever req.body brings, override & update it.
        const course = await Course.findByIdAndUpdate(id, {$set: req.body}, {runValidators: true}); // {runValidators: true} validates the incoming data acc. to defined schema.
        if (!course) {
            return next(new AppError("Course with given Id doesn't exist", 500))
        }
        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            course
        })
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

const removeCourse = async function (req, res, next) {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return next(new AppError("Course with given Id doesn't exist", 500))
        }
        res.status(200).json({
            success: true,
            message: "Course deleted successfully!",
        })
    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
}