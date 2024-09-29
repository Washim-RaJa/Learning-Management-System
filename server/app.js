import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { config } from "dotenv";
import morgan from "morgan";
import userRoutes from './routes/user.routes.js'
import errorMiddleware from "./middlewares/error.middleware.js";


// config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))  // helps parse encoded urls

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true
}));

app.use(cookieParser());    // To parse incoming cookie when user register or logged in 
app.use(morgan('dev'));     // a logger middleware which logs url end points when accessed

app.use('/ping', (req, res)=> {
    res.send('Pong')
})

// routes of 3 modules
app.use('/api/v1/user', userRoutes)

app.all('*', (req, res)=>{
    res.status(404).send("Oops!! 404 page not found!")
})

app.use(errorMiddleware); // A generic/global error middleware which will send error to the user.

export default app;