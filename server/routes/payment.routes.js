import { Router } from 'express';
import { allPayments, buySubscription, cancelSubscription, getRazorpayApiKey, verifySubscription } from '../controllers/payment.controller.js';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/").get(isLoggedIn, authorizeRoles('ADMIN'), allPayments); // Todo: Untested

router.route("/razorpay-key").get(isLoggedIn, getRazorpayApiKey);

router.route("/subscribe").post(isLoggedIn, buySubscription);   // Todo: Untested

router.route("/verify").post(isLoggedIn, verifySubscription);   // Todo: Untested

router.route("/unsubscribe").post(isLoggedIn, cancelSubscription);  // Todo: Untested

export default router;