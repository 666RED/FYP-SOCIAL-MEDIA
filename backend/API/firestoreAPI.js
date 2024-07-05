import {
	doc,
	addDoc,
	deleteDoc,
	updateDoc,
	setDoc,
	collection,
	serverTimestamp,
	query,
	where,
	getDocs,
	writeBatch,
} from "firebase/firestore";
import { db } from "../firebase-config.js";

const notificationRef = collection(db, "notifications");
const messageRef = collection(db, "messages");

/* POST AND COMMENT */
export const likePost = async ({ userId, userName, postId, postUserId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${postId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			receiver: postUserId,
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

export const cancelPostLike = async ({ postId, userId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${postId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		throw new Error("Failed to cancel post like");
	}
};

export const deletePostLikesAndComments = async ({
	postId,
	userIds,
	comments,
}) => {
	try {
		for (const userId of userIds) {
			const docToNotifyPost = doc(notificationRef, `${userId}_${postId}`);
			await deleteDoc(docToNotifyPost);
		}

		for (const { commentId, userId } of comments) {
			const docToNotifyComment = doc(notificationRef, `${userId}_${commentId}`);

			await deleteDoc(docToNotifyComment);
		}
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete post");
	}
};

export const commentPost = async ({
	userId,
	userName,
	postId,
	commentId,
	postUserId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${commentId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			receiver: postUserId,
			postId: postId,
			action: "Comment post",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		throw new Error("Failed to leave comment");
	}
};

export const deletePostComment = async ({ commentId, userId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${commentId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete comment");
	}
};

/* CAMPUS CONDITION */
export const rateCondition = async ({
	userId,
	conditionId,
	postUserId,
	isEdit,
	rateUp,
	userName,
}) => {
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
				receiver: postUserId,
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

export const deleteRate = async ({ userId, conditionId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${conditionId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete rate");
	}
};

export const deleteRates = async ({ userIds, conditionId }) => {
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

export const markCondition = async ({ userId, conditionId, postUserId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${conditionId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName: "System admin",
			receiver: postUserId,
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
	receiverId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			receiver: receiverId,
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
	receiverId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: receiverId,
			userName,
			receiver: userId,
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
	groupAdminId,
	groupId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			receiver: groupAdminId,
			action: "Join group",
			groupId,
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

export const updateJoinGroupRequest = async ({
	userId,
	requestId,
	groupName,
	groupAdminId,
	groupId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${requestId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: groupAdminId,
			groupName,
			receiver: userId,
			action: "Accept join group",
			acceptGroupId: groupId,
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);
		throw new Error("Failed to update join group request");
	}
};

/* GROUP POST */
export const likeGroupPost = async ({
	userId,
	userName,
	postId,
	postUserId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${postId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			receiver: postUserId,
			postId: postId,
			action: "Like group post",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to like group post");
	}
};

export const cancelGroupPostLike = async ({ userId, postId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${postId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		throw new Error("Failed to cancel group post like");
	}
};

export const commentGroupPost = async ({
	userId,
	userName,
	postId,
	commentId,
	postUserId,
}) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${commentId}`);

		const notificationData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			receiver: postUserId,
			postId: postId,
			action: "Comment group post",
			viewed: false,
		};

		await setDoc(docToNotify, notificationData);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to leave comment");
	}
};

export const deleteGroupPostComment = async ({ commentId, userId }) => {
	try {
		const docToNotify = doc(notificationRef, `${userId}_${commentId}`);

		await deleteDoc(docToNotify);
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete comment");
	}
};

export const deleteGroupPostLikesAndComments = async ({
	postId,
	userIds,
	comments,
}) => {
	try {
		for (const userId of userIds) {
			const docToNotifyPost = doc(notificationRef, `${userId}_${postId}`);
			await deleteDoc(docToNotifyPost);
		}

		for (const { commentId, userId } of comments) {
			const docToNotifyComment = doc(notificationRef, `${userId}_${commentId}`);

			await deleteDoc(docToNotifyComment);
		}
	} catch (err) {
		console.log(err);

		throw new Error("Failed to delete group post");
	}
};

/* NOTE */
export const addNewNote = async ({
	noteId,
	groupAdminId,
	memberIds,
	groupName,
	folderId,
	groupId,
}) => {
	try {
		for (const memberId of memberIds) {
			const docToNotify = doc(notificationRef, `${memberId}_${noteId}`);
			const notificationData = {
				createdAt: serverTimestamp(),
				sender: groupAdminId,
				groupName,
				receiver: memberId,
				folderId: folderId,
				action: "Add note",
				viewed: false,
				acceptGroupId: groupId,
			};

			await setDoc(docToNotify, notificationData);
		}
	} catch (err) {
		throw new Error("Failed to add new notes");
	}
};

export const removeNoteNotification = async ({ memberIds, noteId }) => {
	try {
		for (const memberId of memberIds) {
			const docToNotify = doc(notificationRef, `${memberId}_${noteId}`);

			await deleteDoc(docToNotify);
		}
	} catch (err) {
		console.log(err);

		throw new Error("Failed to remove note");
	}
};

export const removeNoteNotifications = async ({ memberIds, noteIds }) => {
	try {
		for (const memberId of memberIds) {
			for (const noteId of noteIds) {
				const docToNotify = doc(notificationRef, `${memberId}_${noteId}`);
				await deleteDoc(docToNotify);
			}
		}
	} catch (err) {
		console.log(err);

		throw new Error("Failed to remove note notifications");
	}
};

export const updateViewedValue = async ({ id }) => {
	try {
		let docToNotify = doc(notificationRef, id);

		await updateDoc(docToNotify, { viewed: true });
	} catch (err) {
		throw new Error("Failed to update viewed values");
	}
};

/* CHAT */
export const addNewMessage = async ({
	userId,
	friendId,
	userName,
	message,
	imageURL,
	type,
}) => {
	try {
		const messageData = {
			createdAt: serverTimestamp(),
			sender: userId,
			userName,
			receiver: friendId,
			message,
			viewed: false,
			imageURL,
			type,
		};

		await addDoc(messageRef, messageData);
	} catch (err) {
		throw new Error("Failed to send message");
	}
};

export const updateChatsViewed = async ({ receiverId, senderId }) => {
	try {
		const messageRef = collection(db, "messages");
		const q = query(
			messageRef,
			where("sender", "==", senderId),
			where("receiver", "==", receiverId)
		);
		const querySnapshot = await getDocs(q);

		const batch = writeBatch(db);
		querySnapshot.forEach((document) => {
			const docRef = doc(db, "messages", document.id);
			batch.update(docRef, { viewed: true });
		});

		await batch.commit();
	} catch (err) {
		throw new Error("Failed to update viewed values");
	}
};
