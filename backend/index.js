import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
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
import amdinRoute from "./routes/adminRoute.js";
import noteRoute from "./routes/noteRoute.js";
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

// change here before publish
const isPublish = true;

const app = express();
dotenv.config();

app.use(express.json({ limit: "50mb", extended: true }));
app.use(cors());

// IMAGE MANAGEMENT
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

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

const campusConditionStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/campus-condition");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

const groupStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/group");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

const groupPostStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/group-post");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.originalname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

const productStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/product");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

const serviceStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/service");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

const eventStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/event");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.fieldname + "_" + Date.now() + path.extname(file.originalname)
		);
	},
});

const noteStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/images/note");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			file.originalname + "_" + Date.now() + path.extname(file.originalname)
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

const campusConditionUpload = multer({
	storage: campusConditionStorage,
});

const groupUpload = multer({
	storage: groupStorage,
});

const groupPostUpload = multer({
	storage: groupPostStorage,
});

const productUpload = multer({
	storage: productStorage,
});

const serviceUpload = multer({
	storage: serviceStorage,
});

const eventUpload = multer({
	storage: eventStorage,
});

const noteUpload = multer({
	storage: noteStorage,
});

// GET THE IMAGE IN CLIENT SIDE

app.use(
	"/public/images/profile",
	express.static(path.join(__dirname, "public/images/profile"))
);

app.use(
	"/public/images/post",
	express.static(path.join(__dirname, "public/images/post"))
);

app.use(
	"/public/images/campus-condition",
	express.static(path.join(__dirname, "public/images/campus-condition"))
);

app.use(
	"/public/images/group",
	express.static(path.join(__dirname, "public/images/group"))
);

app.use(
	"/public/images/group-post",
	express.static(path.join(__dirname, "public/images/group-post"))
);

app.use(
	"/public/images/product",
	express.static(path.join(__dirname, "public/images/product"))
);

app.use(
	"/public/images/service",
	express.static(path.join(__dirname, "public/images/service"))
);

app.use(
	"/public/images/event",
	express.static(path.join(__dirname, "public/images/event"))
);

app.use(
	"/public/images/note",
	express.static(path.join(__dirname, "public/images/note"))
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
app.post(
	"/post/edit-post",
	verifyToken,
	postUpload.single("postImage"),
	editPost
);
app.post(
	"/campus-condition/add-new-campus-condition",
	verifyToken,
	campusConditionUpload.single("image"),
	addNewCampusCondition
);
app.post(
	"/campus-condition/edit-condition",
	verifyToken,
	campusConditionUpload.single("conditionImage"),
	editCondition
);
app.post(
	"/group/create-new-group",
	verifyToken,
	groupUpload.fields([{ name: "groupImage" }, { name: "groupCoverImage" }]),
	createNewGroup
);
app.post(
	"/group/edit-group",
	verifyToken,
	groupUpload.fields([{ name: "groupImage" }, { name: "groupCoverImage" }]),
	editGroup
);
app.post(
	"/group-post/add-new-group-post",
	verifyToken,
	groupPostUpload.fields([{ name: "image" }, { name: "file" }]),
	addNewGroupPost
);
app.post(
	"/group-post/edit-group-post",
	verifyToken,
	groupPostUpload.fields([{ name: "image" }, { name: "file" }]),
	editGroupPost
);
app.post(
	"/product/create-new-product",
	verifyToken,
	productUpload.single("image"),
	createNewProduct
);
app.post(
	"/product/edit-product",
	verifyToken,
	productUpload.single("image"),
	editProduct
);
app.post(
	"/service/create-new-service",
	verifyToken,
	serviceUpload.single("image"),
	createNewService
);
app.post(
	"/service/edit-service",
	verifyToken,
	serviceUpload.single("image"),
	editService
);
app.post(
	"/event/create-new-event",
	verifyToken,
	eventUpload.single("image"),
	createNewEvent
);
app.post(
	"/event/edit-event",
	verifyToken,
	eventUpload.single("image"),
	editEvent
);
app.post(
	"/note/create-new-note",
	verifyToken,
	noteUpload.single("file"),
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
app.use("/admin", amdinRoute);
app.use("/note", noteRoute);

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
