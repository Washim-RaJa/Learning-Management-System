import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
import userRoutes from './routes/user.routes.js'
import courseRoutes from './routes/course.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import miscRoutes from './routes/miscellaneous.routes.js'
import errorMiddleware from "./middlewares/error.middleware.js";


config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))  // helps parse encoded urls

app.use(cors({
    // origin: [process.env.FRONTEND_URL],
    origin: ["https://skillify-q9pn.onrender.com"],
    credentials: true
}));

app.use(cookieParser());    // To parse incoming cookie when user register or logged in 
app.use(morgan('dev'));     // a logger middleware which logs url end points when accessed

app.use('/ping', (req, res)=> {
    res.send('Pong')
})

// routes of 4 modules
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1', miscRoutes);

app.all('/api/*', (req, res)=>{
    res.status(404).send("Oops!! 404 page not found!")
})

app.use(errorMiddleware); // A generic/global error middleware which will send error to the user.

export default app;
