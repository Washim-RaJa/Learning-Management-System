import app from "./app.js";
import { config } from "dotenv";
import connectionToDB from "./config/dbConnection.js";
import cloudinary from 'cloudinary';
import Razorpay from 'razorpay';
import path from 'path';
import express from "express";

config();

const PORT = process.env.PORT || 5000;

// Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
// Razorpay configuration
export const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

app.listen(PORT, async () => {
    await connectionToDB();
    console.log(`App is running at port : ${PORT}`);
})