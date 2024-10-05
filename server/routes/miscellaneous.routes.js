import express from 'express';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';
import { contactUs, userStats } from '../controllers/miscellaneous.controller.js';



const router = express.Router();

router.route('/contact').post(contactUs);

router.route("/admin/stats/users").get(isLoggedIn, authorizeRoles('ADMIN'), userStats);

export default router;