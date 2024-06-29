import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
// ROUTES
import authRoute from "./routes/authRoute.js";
import recoverPasswordRoute from "./routes/recoverPasswordRoute.js";
import profileRoute from "./routes/profileRoute.js";
import postRoute from "./routes/postRoute.js";
import commentRoute from "./routes/commentRoute.js";
import campusConditionRoute from "./routes/campusConditionRoute.js";
import friendRequestRoute from "./routes/friendRequestRoute.js";
import friendRoute from "./routes/friendRoute.js";
import groupRoute from "./routes/groupRoute.js";
import joinGroupRequestRoute from "./routes/joinGroupRequestRoute.js";
import groupPostRoute from "./routes/groupPostRoute.js";
import groupPostCommentRoute from "./routes/groupPostCommentRoute.js";
import productRoute from "./routes/productRoute.js";
import serviceRoute from "./routes/serviceRoute.js";
import eventRoute from "./routes/eventRoute.js";
import settingRoute from "./routes/settingRoute.js";
import adminRoute from "./routes/adminRoute.js";
import noteRoute from "./routes/noteRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import chatRoute from "./routes/chatRoute.js";
// MIDDLEWARE & DIRECT PATH
import { verifyToken } from "./middleware/auth.js";
import { editProfile } from "./controllers/profile.js";
import { addNewPost, editPost } from "./controllers/post.js";
import {
	addNewCampusCondition,
	editCondition,
} from "./controllers/campusCondition.js";
import { createNewGroup, editGroup } from "./controllers/group.js";
import { addNewGroupPost, editGroupPost } from "./controllers/groupPost.js";
import { createNewProduct, editProduct } from "./controllers/product.js";
import { createNewService, editService } from "./controllers/service.js";
import { createNewEvent, editEvent } from "./controllers/event.js";
import { createNewNote } from "./controllers/note.js";
import { confirmation } from "./controllers/auth.js";

// change here before publish
const isPublish = false;

export const backendServer = isPublish
	? "https://fyp-fsktm-connect.onrender.com"
	: "http://localhost:3001";
export const frontendServer = isPublish
	? "https://master--famous-flan-85b8f1.netlify.app/"
	: "http://localhost:3000";

const app = express();
dotenv.config();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(cors());

// MULTER CONFIGURATION
const storage = multer.memoryStorage();
const upload = multer({ storage });

// DIRECT PATH
app.get("/confirmation/:token", confirmation);

app.post(
	"/profile/edit-profile",
	verifyToken,
	upload.fields([{ name: "profileImage" }, { name: "coverImage" }]),
	editProfile
);
app.post("/post/add-new-post", verifyToken, upload.single("image"), addNewPost);
app.post("/post/edit-post", verifyToken, upload.single("postImage"), editPost);
app.post(
	"/campus-condition/add-new-campus-condition",
	verifyToken,
	upload.single("image"),
	addNewCampusCondition
);
app.post(
	"/campus-condition/edit-condition",
	verifyToken,
	upload.single("conditionImage"),
	editCondition
);
app.post(
	"/group/create-new-group",
	verifyToken,
	upload.fields([{ name: "groupImage" }, { name: "groupCoverImage" }]),
	createNewGroup
);
app.post(
	"/group/edit-group",
	verifyToken,
	upload.fields([{ name: "groupImage" }, { name: "groupCoverImage" }]),
	editGroup
);
app.post(
	"/group-post/add-new-group-post",
	verifyToken,
	upload.fields([{ name: "image" }, { name: "file" }]),
	addNewGroupPost
);
app.post(
	"/group-post/edit-group-post",
	verifyToken,
	upload.fields([{ name: "image" }, { name: "file" }]),
	editGroupPost
);
app.post(
	"/product/create-new-product",
	verifyToken,
	upload.single("image"),
	createNewProduct
);
app.post(
	"/product/edit-product",
	verifyToken,
	upload.single("image"),
	editProduct
);
app.post(
	"/service/create-new-service",
	verifyToken,
	upload.single("image"),
	createNewService
);
app.post(
	"/service/edit-service",
	verifyToken,
	upload.single("image"),
	editService
);
app.post(
	"/event/create-new-event",
	verifyToken,
	upload.single("image"),
	createNewEvent
);
app.post("/event/edit-event", verifyToken, upload.single("image"), editEvent);
app.post(
	"/note/create-new-note",
	verifyToken,
	upload.single("file"),
	createNewNote
);

// ROUTES
app.use("/auth", authRoute);
app.use("/recover-password", recoverPasswordRoute);
app.use("/profile", profileRoute);
app.use("/post", postRoute);
app.use("/comment", commentRoute);
app.use("/campus-condition", campusConditionRoute);
app.use("/friend-request", friendRequestRoute);
app.use("/friend", friendRoute);
app.use("/group", groupRoute);
app.use("/join-group-request", joinGroupRequestRoute);
app.use("/group-post", groupPostRoute);
app.use("/group-post-comment", groupPostCommentRoute);
app.use("/product", productRoute);
app.use("/service", serviceRoute);
app.use("/event", eventRoute);
app.use("/setting", settingRoute);
app.use("/admin", adminRoute);
app.use("/note", noteRoute);
app.use("/notification", notificationRoute);
app.use("/chat", chatRoute);

// DATABASE CONFIGURATION
let databaseUrl;
if (isPublish) {
	databaseUrl = process.env.MONGO_URL_PUBLISH;
} else {
	databaseUrl = process.env.MONGO_URL;
}

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
