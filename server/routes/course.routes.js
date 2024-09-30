import express from 'express';
import { getAllCourses, getLecturesByCourseId } from '../controllers/course.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route("/").get(getAllCourses);

router.route("/:id").get(isLoggedIn ,getLecturesByCourseId);

export default router;