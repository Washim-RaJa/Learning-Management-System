import express from 'express';
import { addLectureToCourseById, createCourse, getAllCourses, getLecturesByCourseId, removeCourse, removeLectureFromCourse, updateCourse } from '../controllers/course.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

router.route("/")
    .get(getAllCourses)
    .post(isLoggedIn, authorizeRoles('ADMIN'), upload.single("thumbnail"), createCourse)
    .delete(isLoggedIn, authorizeRoles('ADMIN'), removeLectureFromCourse)
    

router.route("/:id")
    .get(isLoggedIn, getLecturesByCourseId)
    .put(isLoggedIn, authorizeRoles('ADMIN'), updateCourse)
    .delete(isLoggedIn, authorizeRoles('ADMIN'), removeCourse)
    .post(isLoggedIn, authorizeRoles('ADMIN'), upload.single("lecture"), addLectureToCourseById)

export default router;