import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import fs from "fs";
import authRoute from "./routes/authRoute.js";
import recoverPasswordRoute from "./routes/recoverPasswordRoute.js";
import profileRoute from "./routes/profileRoute.js";
import postRoute from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoute.js";
import { verifyToken } from "./middleware/auth.js";
import { editProfile } from "./controllers/profile.js";
import { addNewPost } from "./controllers/post.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(cors());

// IMAGE MANAGEMENT
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// STORAGE CONFIGURATION
const profileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/profile");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

const postStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/post");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

// UPLOAD CONFIGURATION
const profileUpload = multer({
	storage: profileStorage,
});

const postUpload = multer({
	storage: postStorage,
});

app.use(
	"/public/images/profile",
	express.static(path.join(__dirname, "public/images/profile"))
);

app.use(
	"/public/images/post",
	express.static(path.join(__dirname, "public/images/post"))
);

// DIRECT PATH
app.post(
	"/profile/edit-profile",
	verifyToken,
	profileUpload.fields([{ name: "profileImage" }, { name: "coverImage" }]),
	editProfile
);
app.post(
	"/post/add-new-post",
	verifyToken,
	postUpload.single("image"),
	addNewPost
);

// ROUTES
app.use("/auth", authRoute);
app.use("/recover-password", recoverPasswordRoute);
app.use("/profile", profileRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);

// DATABASE CONFIGURATION
const databaseUrl = process.env.MONGO_URL;
const PORT = process.env.PORT || 6001;

mongoose
	.connect(databaseUrl)
	.then(() => {
		console.log("Connected to database.");
		app.listen(PORT, () => {
			console.log(`App is listening to port: ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
