import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";
import { User } from "../models/userModel.js";
import { Group } from "../models/groupModel.js";
import { CampusCondition } from "../models/campusConditionModel.js";
import { Product } from "../models/productModel.js";
import { Service } from "../models/serviceModel.js";
import { Event } from "../models/eventModel.js";
import { Report } from "../models/reportModel.js";
import { GroupPost } from "../models/groupPostModel.js";
import { Post } from "../models/postModel.js";
import { formatDateTime } from "../usefulFunction.js";
import { GroupPostComment } from "../models/groupPostCommentModel.js";

export const makeReport = async (req, res) => {
	try {
		const { reporterId, targetId, reportType, reason } = req.body;

		const existedReport = await Report.findOne({
			reporterId: reporterId,
			targetId: targetId,
		});

		if (existedReport) {
			return res.status(400).json({ msg: "Already made report" });
		}

		const newReport = new Report({
			reporterId,
			targetId,
			reportType,
			reason,
		});

		const savedReport = await newReport.save();

		if (!savedReport) {
			return res.status(400).json({ msg: "Fail to make report" });
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const login = async (req, res) => {
	try {
		const { userId, password } = req.body;

		const user = await Admin.findOne({
			userId: userId,
		});

		if (!user) {
			return res.status(400).json({ msg: "Fail to login" });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(400).json({ msg: "Fail to login" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

		user.password = undefined;

		res.status(200).json({ msg: "Success", token, user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const register = async (req, res) => {
	try {
		const { userId, password } = req.body;

		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		const newAdmin = new Admin({
			userId,
			password: passwordHash,
		});

		const savedAdmin = await newAdmin.save();

		if (!savedAdmin) {
			return res.status(400).json({ msg: "Fail to register new admin" });
		}

		res.status(201).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const retriveData = async (req, res) => {
	try {
		const countUser = await User.countDocuments();

		const countGroup = await Group.countDocuments();

		const countCampusCondition = await CampusCondition.countDocuments();

		const countProduct = await Product.countDocuments();

		const countService = await Service.countDocuments();

		const countEvent = await Event.countDocuments();

		const countReport = await Report.countDocuments();

		return res.status(200).json({
			msg: "Success",
			data: {
				countUser,
				countGroup,
				countCampusCondition,
				countProduct,
				countService,
				countEvent,
				countReport,
			},
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const retrieveUsers = async (req, res) => {
	try {
		let users = await User.find();

		users = users.map((user) => {
			const numOfFriends = user.userFriendsMap.size;
			const numOfGroups = user.groups.size;

			return {
				_id: user._id,
				userName: user.userName,
				imagePath: user.userProfile.profileImagePath,
				coverImagePath: user.userProfile.profileCoverImagePath,
				groups: numOfGroups,
				friends: numOfFriends,
				email: user.userEmailAddress,
				phoneNumber: user.userPhoneNumber,
				registered: user.createdAt.toLocaleDateString(),
			};
		});

		if (!users) {
			return res.status(400).json({ msg: "Fail to retreive users" });
		}

		res.status(200).json({ msg: "Success", users });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const searchUsers = async (req, res) => {
	try {
		const { searchText } = req.query;

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const users = await User.find({
			userName: { $regex: new RegExp(searchText, "i") },
		}).select("-userPassword -verificationCode -__v");

		if (!users) {
			return res.status(400).json({ msg: "Users not found" });
		}

		const formattedUsers = users.map((user) => ({
			_id: user._id,
			userName: user.userName,
			imagePath: user.userProfile.profileImagePath,
			coverImagePath: user.userProfile.profileCoverImagePath,
			groups: user.groups.size,
			friends: user.userFriendsMap.size,
			email: user.userEmailAddress,
			phoneNumber: user.userPhoneNumber,
			registered: user.createdAt.toLocaleDateString(),
		}));

		res.status(200).json({ msg: "Success", users: formattedUsers });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
};

export const retrieveGroups = async (req, res) => {
	try {
		let groups = await Group.find()
			.populate({
				path: "groupAdminId",
				select: "userName",
			})
			.sort({ createdAt: -1 });

		groups = await Promise.all(
			groups.map(async (group) => {
				let postCount = await GroupPost.countDocuments({ groupId: group._id });

				return {
					...group.toObject(),
					postCount: postCount,
				};
			})
		);

		groups = groups.map((group) => ({
			_id: group._id,
			groupName: group.groupName,
			imagePath: group.groupImagePath,
			coverImagePath: group.groupCoverImagePath,
			groupAdminName: group.groupAdminId.userName,
			members: group.members.size,
			postCount: group.postCount,
			created: group.createdAt.toLocaleDateString(),
			removed: group.removed,
		}));

		if (!groups) {
			return res.status(400).json({ msg: "Fail to retrieve groups" });
		}

		res.status(200).json({ msg: "Success", groups });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const searchGroups = async (req, res) => {
	try {
		const { searchText } = req.query;

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		let groups = await Group.find({
			groupName: { $regex: new RegExp(searchText, "i") },
		}).populate({
			path: "groupAdminId",
			select: "userName",
		});

		if (!groups) {
			return res.status(400).json({ msg: "Groups not found" });
		}

		groups = await Promise.all(
			groups.map(async (group) => {
				let postCount = await GroupPost.countDocuments({
					groupId: group._id,
				});

				return {
					...group.toObject(),
					postCount: postCount,
				};
			})
		);

		const formattedGroups = groups.map((group) => ({
			_id: group._id,
			groupName: group.groupName,
			imagePath: group.groupImagePath,
			coverImagePath: group.groupCoverImagePath,
			postCount: group.postCount,
			groupAdminName: group.groupAdminId.userName,
			members: group.members.size,
			created: group.createdAt.toLocaleDateString(),
			removed: group.removed,
		}));

		res.status(200).json({ msg: "Success", groups: formattedGroups });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const retrieveConditions = async (req, res) => {
	try {
		let conditions = await CampusCondition.find()
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		conditions = conditions.map((condition) => ({
			_id: condition._id,
			title: condition.conditionTitle,
			description: condition.conditionDescription,
			poster: condition.userId.userName,
			imagePath: condition.conditionImagePath,
			resolved: condition.conditionResolved,
			uploaded: condition.createdAt.toLocaleDateString(),
			removed: condition.removed,
		}));

		if (!conditions) {
			return res.status(400).json({ msg: "Fail to retrieve conditions" });
		}

		res.status(200).json({ msg: "Success", conditions });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const searchConditions = async (req, res) => {
	try {
		const { searchText } = req.query;

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		let conditions = await CampusCondition.find({
			conditionTitle: { $regex: new RegExp(searchText, "i") },
		})
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		if (!conditions) {
			return res.status(400).json({ msg: "Conditions not found" });
		}

		conditions = conditions.map((condition) => ({
			_id: condition._id,
			title: condition.conditionTitle,
			description: condition.conditionDescription,
			poster: condition.userId.userName,
			imagePath: condition.conditionImagePath,
			resolved: condition.conditionResolved,
			uploaded: condition.createdAt.toLocaleDateString(),
			removed: condition.removed,
		}));

		res.status(200).json({ msg: "Success", conditions });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const retrieveProducts = async (req, res) => {
	try {
		let products = await Product.find()
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		products = products.map((product) => ({
			_id: product._id,
			poster: product.userId.userName,
			name: product.productName,
			description: product.productDescription,
			imagePath: product.productImagePath,
			price: product.productPrice,
			contactNumber: product.contactNumber,
			uploaded: product.createdAt.toLocaleDateString(),
			removed: product.removed,
		}));

		if (!products) {
			return res.status(400).json({ msg: "Fail to retrieve products" });
		}

		res.status(200).json({ msg: "Success", products });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const searchProducts = async (req, res) => {
	try {
		const { searchText } = req.query;

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		let products = await Product.find({
			productName: { $regex: new RegExp(searchText, "i") },
		})
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		if (!products) {
			res.status(400).json({ msg: "Products not found" });
		}

		products = products.map((product) => ({
			_id: product._id,
			poster: product.userId.userName,
			name: product.productName,
			description: product.productDescription,
			imagePath: product.productImagePath,
			price: product.productPrice,
			contactNumber: product.contactNumber,
			uploaded: product.createdAt.toLocaleDateString(),
			removed: product.removed,
		}));

		res.status(200).json({ msg: "Success", products });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const retrieveServices = async (req, res) => {
	try {
		let services = await Service.find()
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		services = services.map((service) => ({
			_id: service._id,
			poster: service.userId.userName,
			name: service.serviceName,
			description: service.serviceDescription,
			imagePath: service.servicePosterImagePath,
			category: service.serviceCategory,
			contactNumber: service.contactNumber,
			uploaded: service.createdAt.toLocaleDateString(),
			removed: service.removed,
		}));

		if (!services) {
			return res.status(400).json({ msg: "Fail to retrieve services" });
		}

		res.status(200).json({ msg: "Success", services });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const searchServices = async (req, res) => {
	try {
		const { searchText } = req.query;

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		let services = await Service.find({
			serviceName: { $regex: new RegExp(searchText, "i") },
		})
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		if (!services) {
			res.status(400).json({ msg: "Services not found" });
		}

		services = services.map((service) => ({
			_id: service._id,
			poster: service.userId.userName,
			name: service.serviceName,
			description: service.serviceDescription,
			imagePath: service.servicePosterImagePath,
			category: service.serviceCategory,
			contactNumber: service.contactNumber,
			uploaded: service.createdAt.toLocaleDateString(),
			removed: service.removed,
		}));

		res.status(200).json({ msg: "Success", services });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const retrieveEvents = async (req, res) => {
	try {
		let events = await Event.find()
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		events = events.map((event) => ({
			_id: event._id,
			poster: event.userId.userName,
			name: event.eventName,
			description: event.eventDescription,
			imagePath: event.eventPosterImagePath,
			venue: event.eventVenue,
			organizer: event.eventOrganizer,
			contactNumbers: event.contactNumbers,
			uploaded: event.createdAt.toLocaleDateString(),
			removed: event.removed,
		}));

		if (!events) {
			return res.status(400).json({ msg: "Fail to retrieve events" });
		}

		res.status(200).json({ msg: "Success", events });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const searchEvents = async (req, res) => {
	try {
		const { searchText } = req.query;

		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		let events = await Event.find({
			eventName: { $regex: new RegExp(searchText, "i") },
		})
			.populate({
				path: "userId",
				select: "userName",
			})
			.sort({
				removed: 1,
				createdAt: -1,
			});

		if (!events) {
			res.status(400).json({ msg: "Events not found" });
		}

		events = events.map((event) => ({
			_id: event._id,
			poster: event.userId.userName,
			name: event.eventName,
			description: event.eventDescription,
			imagePath: event.eventPosterImagePath,
			venue: event.eventVenue,
			organizer: event.eventOrganizer,
			contactNumbers: event.contactNumbers,
			uploaded: event.createdAt.toLocaleDateString(),
			removed: event.removed,
		}));

		res.status(200).json({ msg: "Success", events });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const retrieveReports = async (req, res) => {
	try {
		let reports = await Report.find()
			.populate({
				path: "reporterId",
				select: "userName",
			})
			.sort({
				status: 1,
				createdAt: -1,
			});

		const statusOrder = {
			Pending: 1,
			Dismissed: 2,
			Removed: 3,
		};

		const fetchTarget = async (report) => {
			switch (report.reportType) {
				case "Group": {
					const group = await Group.findById(report.targetId).populate(
						"groupAdminId",
						"userName"
					);
					return group;
				}

				case "Group Post": {
					let groupPost = await GroupPost.findById(report.targetId).populate(
						"userId",
						"userName userProfile profileImagePath"
					);

					if (groupPost) {
						const { createdAt, updatedAt, __v, userId, ...rest } =
							groupPost._doc;
						return {
							...rest,
							time: formatDateTime(createdAt),
							userName: groupPost.userId.userName,
							profileImagePath: groupPost.userId.userProfile.profileImagePath,
						};
					}

					break;
				}

				case "Post": {
					let post = await Post.findById(report.targetId).populate(
						"userId",
						"userName userProfile profileImagePath"
					);

					if (post) {
						const { createdAt, updatedAt, __v, userId, ...rest } = post._doc;

						return {
							...rest,
							time: formatDateTime(createdAt),
							userName: post.userId.userName,
							profileImagePath: post.userId.userProfile.profileImagePath,
						};
					}

					break;
				}

				case "Condition": {
					const condition = await CampusCondition.findById(
						report.targetId
					).populate("userId", "userName userProfile profileImagePath");

					if (condition) {
						const { createdAt, updatedAt, __v, userId, ...rest } =
							condition._doc;

						return {
							...rest,
							time: formatDateTime(createdAt),
							userName: condition.userId.userName,
							profileImagePath: condition.userId.userProfile.profileImagePath,
						};
					}

					break;
				}

				case "Product": {
					const product = await Product.findById(report.targetId).populate(
						"userId",
						"userName userProfile profileImagePath"
					);

					if (product) {
						const { createdAt, updatedAt, __v, userId, ...rest } = product._doc;
						return {
							...rest,
							userProfileImagePath: product.userId.userProfile.profileImagePath,
							userName: product.userId.userName,
						};
					}

					break;
				}

				case "Service": {
					const service = await Service.findById(report.targetId).populate(
						"userId",
						"userName userProfile profileImagePath"
					);

					if (service) {
						const { createdAt, updatedAt, __v, userId, ...rest } = service._doc;
						return {
							...rest,
							userProfileImagePath: service.userId.userProfile.profileImagePath,
							userName: service.userId.userName,
						};
					}

					break;
				}

				case "Event": {
					const event = await Event.findById(report.targetId).populate(
						"userId",
						"userName userProfile profileImagePath"
					);

					if (event) {
						const { createdAt, updatedAt, __v, userId, ...rest } = event._doc;
						return {
							...rest,
							userProfileImagePath: event.userId.userProfile.profileImagePath,
							userName: event.userId.userName,
						};
					}

					break;
				}

				default: {
					throw new Error(`Unsupported reportType: ${report.reportType}`);
				}
			}
		};

		reports = await Promise.all(
			reports.map(async (report) => {
				try {
					const target = await fetchTarget(report);

					return {
						_id: report._id,
						reporterId: report.reporterId._id,
						targetId: report.targetId,
						reporter: report.reporterId.userName,
						target,
						type: report.reportType,
						reason: report.reason,
						status: report.status,
						reported: new Date(report.createdAt).toLocaleString(),
					};
				} catch (err) {
					console.log("Error fetching target:", err);
					return {
						_id: report._id,
						reporterId: report.reporterId._id,
						targetId: report.targetId,
						reporter: report.reporterId.userName,
						target: null,
						type: report.reportType,
						reason: report.reason,
						status: report.status,
						reported: new Date(report.createdAt).toLocaleString(),
					};
				}
			})
		);

		reports.sort((a, b) => {
			const rankA = statusOrder[a.status] || 999;
			const rankB = statusOrder[b.status] || 999;

			if (rankA !== rankB) {
				return rankA - rankB;
			} else {
				return b.createdAt - a.createdAt;
			}
		});

		if (!reports) {
			return res.status(400).json({ msg: "Fail to retrieve reports" });
		}

		res.status(200).json({ msg: "Success", reports });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const dismissReport = async (req, res) => {
	try {
		const { id } = req.body;

		const returnedReport = await Report.findByIdAndUpdate(id, {
			$set: { status: "Dismissed" },
		});

		if (!returnedReport) {
			return res.status(400).json({ msg: "Fail to dismiss report" });
		}

		res.status(200).json({ msg: "Success", returnedReport });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const removeReport = async (req, res) => {
	try {
		const { id, type, targetId } = req.body;

		const returnedReport = await Report.findByIdAndUpdate(id, {
			$set: { status: "Removed" },
		});

		if (!returnedReport) {
			return res.status(400).json({ msg: "Fail to remove report" });
		}

		switch (type) {
			case "Group": {
				const group = await Group.findByIdAndUpdate(targetId, {
					$set: { removed: 1 },
				});

				if (!group) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}

				const promises = Array.from(group.members).map(([userId, value]) =>
					User.findByIdAndUpdate(
						userId,
						{
							$unset: { [`groups.${group._id}`]: 1 },
						},
						{ new: true }
					)
				);

				const updatedUsers = await Promise.all(promises);

				if (!updatedUsers) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}

				break;
			}
			case "Group Post": {
				const groupPost = await GroupPost.findByIdAndUpdate(targetId, {
					$set: { removed: 1 },
				});

				if (!groupPost) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}

				await GroupPostComment.deleteMany({ groupPostId: targetId });

				break;
			}
			case "Post": {
				const post = await Post.findByIdAndUpdate(targetId, {
					$set: { removed: 1 },
				});
				if (!post) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}
				await Comment.deleteMany({ postId: targetId });
				break;
			}
			case "Condition": {
				const condition = await CampusCondition.findByIdAndUpdate(targetId, {
					$set: { removed: 1 },
				});
				if (!condition) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}
				break;
			}
			case "Product": {
				const product = await Product.findByIdAndUpdate(targetId, {
					$set: { removed: 1 },
				});
				if (!product) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}
				break;
			}
			case "Service": {
				const service = await Service.findByIdAndUpdate(targetId, {
					$set: { removed: 1 },
				});
				if (!service) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}
				break;
			}
			case "Event": {
				const event = await Event.findByIdAndUpdate(targetId, {
					$set: { removed: 1 },
				});
				if (!event) {
					return res.status(400).json({ msg: "Fail to remove report" });
				}
				break;
			}
			default: {
				console.log(`Unsupported type: ${type}`);
				break;
			}
		}

		res.status(200).json({ msg: "Success", returnedReport });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
