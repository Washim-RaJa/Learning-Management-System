import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'


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
                fs.rm(`server/uploads/${req.file.filename}`)
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
        const course = await Course.findByIdAndUpdate(id, { $set: req.body }, { runValidators: true }); // {runValidators: true} validates the incoming data acc. to defined schema.
        if (!course) {
            return next(new AppError("Course with given Id doesn't exist", 500))
        }
        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            // course
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

const addLectureToCourseById = async function (req, res, next) {
    try {
        const { title, description } = req.body;
        const { id } = req.params;

        if (!title || !description) {
            return next(new AppError('Title and Description are required', 400));
        }
        const course = await Course.findById(id);

        if (!course) {
            return next(new AppError('Invalid course id or course not found.', 400));
        }
        const lectureData = {
            title,
            description,
            lecture: {}
        }
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'lms',
                    chunk_size: 50000000, // 50 mb size
                    resource_type: 'video'
                })
                if (result) {
                    lectureData.lecture.public_id = result.public_id;
                    lectureData.lecture.secure_url = result.secure_url
                }
                fs.rm(`server/uploads/${req.file.filename}`)
            } catch (error) {
                next(
                    new AppError(
                        JSON.stringify(error) || 'File not uploaded, please try again', 400
                    )
                )
            }
        }
        course.lectures.push(lectureData)
        course.numberOfLectures = course.lectures.length
        await course.save()
        res.status(200).json({
            success: true,
            message: "Lectures added to the course successfully",
            course
        })
    } catch (error) {
        return next(error.message, 500)
    }
}

const removeLectureFromCourse = async function name(req, res, next) {
    try {
        // Grabbing the courseId and lectureId from req.query
        const { courseId, lectureId } = req.query;
        // Checking if both courseId and lectureId are present
        if (!courseId) {
            return next(new AppError('Course ID is required', 400));
        }
        if (!lectureId) {
            return next(new AppError('Lecture ID is required', 400));
        }
        // Find the course having the courseId
        const course = await Course.findById(courseId);
        // If no course send custom message
        if (!course) {
            return next(new AppError('Invalid ID or Course does not exist.', 404));
        }
        // Find the index of the lecture using the lectureId
        const lectureIndex = course.lectures.findIndex(
            (lecture) => lecture._id.toString() === lectureId.toString()
        );
        // If returned index is -1 then send error as mentioned below
        if (lectureIndex === -1) {
            return next(new AppError('Lecture does not exist.', 404));
        }
         // Delete the lecture from cloudinary
        await cloudinary.v2.uploader.destroy(
            course.lectures[lectureIndex].lecture.public_id,{ resource_type: 'video',}
        );
          // Remove the lecture from the array
        course.lectures.splice(lectureIndex, 1);

        // update the number of lectures based on lectres array length
        course.numberOfLectures = course.lectures.length;

        // Save the course object
        await course.save();

        // Return response
        res.status(200).json({
            success: true,
            message: 'Course lecture removed successfully',
        });
    } catch (error) {
        next(
            new AppError(
                JSON.stringify(error) || 'Failed to remove Course lecture, please try again', 400
            )
        )
    }
}
export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    removeLectureFromCourse
}