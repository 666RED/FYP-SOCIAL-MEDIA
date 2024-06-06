import {
	doc,
	deleteDoc,
	updateDoc,
	setDoc,
	collection,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase-config.js";

const notificationRef = collection(db, "notifications");

/* POST AND COMMENT */
export const likePost = async (
	userId,
	userName,
	profileImagePath,
	postId,
	postUserId
) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${postId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			profileImagePath,
			receivers: [postUserId],
			postId: postId,
			action: "Like post",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to like post");
	}
};

export const cancelPostLike = async (postId, userId) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${postId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		throw new Error("Failed to cancel post like");
	}
};

export const deletePostLikesAndComments = async (
	postId,
	userIds,
	commentIds
) => {
	try {
		for (const userId of userIds) {
			const docToNotifyPost = doc(notificationRef, `${userId}_${postId}`);
			for (const commentId of commentIds) {
				const docToNotifyComment = doc(
					notificationRef,
					`${userId}_${commentId}`
				);

				await deleteDoc(docToNotifyPost);
				await deleteDoc(docToNotifyComment);
			}
		}
	} catch (err) {
		throw new Error("Failed to delete post");
	}
};

export const commentPost = async (
	userId,
	userName,
	profileImagePath,
	postId,
	commentId,
	postUserId
) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${commentId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			profileImagePath,
			receivers: [postUserId],
			postId: postId,
			action: "Comment post",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		throw new Error("Failed to leave comment");
	}
};

export const deletePostComment = async (commentId, userId) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${commentId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete comment");
	}
};

/* CAMPUS CONDITION */

export const rateCondition = async (
	userId,
	conditionId,
	postUserId,
	isEdit,
	rateUp,
	userName,
	profileImagePath
) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${conditionId}`);

		if (isEdit) {
			await updateDoc(docToNotify, {
				action: rateUp ? "Rate up" : "Rate down",
			});
		} else {
			const notificationData = {
				createdAt: serverTimestamp(),
				sender: userId,
				userName,
				profileImagePath,
				receivers: [postUserId],
				conditionId: conditionId,
				action: rateUp ? "Rate up" : "Rate down",
				viewed: false,
			};

			await setDoc(docToNotify, notificationData);
		}
	} catch (err) {
		console.error("Error rating condition:", err);
		throw new Error("Failed to rate condition");
	}
};

export const deleteRate = async (userId, conditionId) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${conditionId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete rate");
	}
};

export const deleteRates = async (userIds, conditionId) => {
	try {
		for (const userId of userIds) {
			const docToNotify = doc(notificationRef, `${userId}_${conditionId}`);

			await deleteDoc(docToNotify);
		}
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete rates");
	}
};

export const markCondition = async (userId, conditionId, postUserId) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${conditionId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName: "Admin",
			profileImagePath: "",
			receivers: [postUserId],
			conditionId: conditionId,
			action: "Mark resolved",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to mark condition");
	}
};

/* FRIEND REQUEST */
export const addFriendRequest = async ({
	userId,
	requestId,
	userName,
	profileImagePath,
	receiverId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			profileImagePath,
			receivers: [receiverId],
			action: "Add friend",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to add friend request");
	}
};

export const removeFriendRequest = async ({ userId, requestId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to remove friend request");
	}
};

export const updateFriendRequest = async ({
	userId,
	requestId,
	userName,
	profileImagePath,
	receiverId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: receiverId,
			userName,
			profileImagePath,
			receivers: [userId],
			action: "Accept friend request",
			acceptUserId: receiverId,
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to update friend request");
	}
};

/* GROUP REQUEST */
export const addJoinGroupRequest = async ({
	userId,
	requestId,
	userName,
	profileImagePath,
	groupAdminId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			profileImagePath,
			receivers: [groupAdminId],
			action: "Join group",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to add join group request");
	}
};

export const removeJoinGroupRequest = async ({ userId, requestId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to remove join group request");
	}
};
