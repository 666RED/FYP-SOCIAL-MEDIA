import mongoose from "mongoose";
import { Service } from "../models/serviceModel.js";
import { User } from "../models/userModel.js";
import path from "path";
import fs from "fs";
import { __dirname } from "../index.js";

export const createNewService = async (req, res) => {
	try {
		const { name, description, userId, contactNumber, category } = req.body;

		const image = req.file;

		const newService = new Service({
			serviceName: name,
			serviceDescription: description,
			servicePosterImagePath: image.filename,
			userId,
			serviceCategory: category,
			contactNumber,
		});

		const savedService = await newService.save();

		if (!savedService) {
			return res.status(400).json({ msg: "Fail to create new service" });
		}

		res.status(201).json({ msg: "Success" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ error: err.message });
	}
};

export const getServices = async (req, res) => {
	try {
		const { userId, servicesArr, category } = req.query;

		const servicesArray = JSON.parse(servicesArr);

		let services;

		if (category === "all") {
			services = await Service.aggregate([
				{
					$match: {
						$and: [
							// not equal to userId
							{ userId: { $ne: new mongoose.Types.ObjectId(userId) } },
							{ removed: false },
							{
								_id: {
									$nin: servicesArray.map(
										(service) => new mongoose.Types.ObjectId(service._id)
									),
								},
							},
						],
					},
				},
				{
					$sample: { size: 15 },
				},
			]);
		} else {
			services = await Service.aggregate([
				{
					$match: {
						$and: [
							// not equal to userId
							{ userId: { $ne: new mongoose.Types.ObjectId(userId) } },
							{ removed: false },
							{ serviceCategory: category },
							{
								_id: {
									$nin: servicesArray.map(
										(service) => new mongoose.Types.ObjectId(service._id)
									),
								},
							},
						],
					},
				},
				{
					$sample: { size: 15 },
				},
			]);
		}

		if (!services) {
			return res.status(404).json({ msg: "Services not found" });
		}

		const returnServices = services.map((service) => {
			const { serviceDescription, __v, removed, ...rest } = service;

			return rest;
		});

		res.status(200).json({ msg: "Success", returnServices });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getMyServices = async (req, res) => {
	try {
		const { userId, servicesArr, category } = req.query;

		const servicesArray = JSON.parse(servicesArr);

		let services;

		if (category === "all") {
			services = await Service.aggregate([
				{
					$match: {
						$and: [
							{ userId: new mongoose.Types.ObjectId(userId) },
							{ removed: false },
							{
								_id: {
									$nin: servicesArray.map(
										(service) => new mongoose.Types.ObjectId(service._id)
									),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
			]);
		} else {
			services = await Service.aggregate([
				{
					$match: {
						$and: [
							{ userId: new mongoose.Types.ObjectId(userId) },
							{ serviceCategory: category },
							{ removed: false },
							{
								_id: {
									$nin: servicesArray.map(
										(service) => new mongoose.Types.ObjectId(service._id)
									),
								},
							},
						],
					},
				},
				{
					$limit: 15,
				},
			]);
		}

		if (!services) {
			return res.status(404).json({ msg: "Services not found" });
		}

		const returnServices = services.map((service) => {
			const { serviceDescription, __v, removed, ...rest } = service;
			return rest;
		});

		res.status(200).json({ msg: "Success", returnServices });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getService = async (req, res) => {
	try {
		const { id } = req.query;
		const service = await Service.findById(id);

		if (!service) {
			return res.status(404).json({ msg: "Service not found" });
		}

		const user = await User.findById(service.userId);

		let userName = "";
		let userProfileImagePath = "";
		let frameColor = "";

		if (user) {
			userName = user.userName;
			userProfileImagePath = user.userProfile.profileImagePath;
			frameColor = user.userProfile.profileFrameColor;
		}

		const { __v, ...rest } = service._doc;

		res.status(200).json({
			msg: "Success",
			service: { ...rest, userName, userProfileImagePath, frameColor },
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedServices = async (req, res) => {
	try {
		const { userId, searchText, servicesArr, category } = req.query;
		const limit = 15;
		const servicesArray = JSON.parse(servicesArr);

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const excludedServices = servicesArray.map(
			(service) => new mongoose.Types.ObjectId(service._id)
		);

		let services;

		if (category === "all") {
			services = await Service.aggregate([
				{
					$match: {
						_id: { $nin: excludedServices },
						userId: { $ne: new mongoose.Types.ObjectId(userId) },
						removed: false,
						serviceName: { $regex: searchText, $options: "i" },
					},
				},
				{
					$limit: limit,
				},
			]);
		} else {
			services = await Service.aggregate([
				{
					$match: {
						_id: { $nin: excludedServices },
						removed: false,
						serviceCategory: category,
						userId: { $ne: new mongoose.Types.ObjectId(userId) },
						serviceName: { $regex: searchText, $options: "i" },
					},
				},
				{
					$limit: limit,
				},
			]);
		}

		if (!services) {
			return res.status(400).json({ msg: "Fail to retrieve services" });
		}

		const returnServices = services.map((service) => {
			const { serviceDescription, __v, removed, ...rest } = service;

			return rest;
		});

		if (!returnServices) {
			return res.status(400).json({ msg: "Fail to retrieve services" });
		}

		res.status(200).json({ msg: "Success", returnServices });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const getSearchedMyServices = async (req, res) => {
	try {
		const { userId, searchText, servicesArr, category } = req.query;
		const limit = 15;
		const servicesArray = JSON.parse(servicesArr);

		// STOP SEARCHING
		if (searchText === "") {
			return res.status(200).json({ msg: "Stop searching" });
		}

		const excludedServices = servicesArray.map(
			(service) => new mongoose.Types.ObjectId(service._id)
		);

		let services;

		if (category === "all") {
			services = await Service.aggregate([
				{
					$match: {
						_id: { $nin: excludedServices },
						removed: false,
						userId: new mongoose.Types.ObjectId(userId),
						serviceName: { $regex: searchText, $options: "i" },
					},
				},
				{
					$limit: limit,
				},
			]);
		} else {
			services = await Service.aggregate([
				{
					$match: {
						_id: { $nin: excludedServices },
						removed: false,
						serviceCategory: category,
						userId: new mongoose.Types.ObjectId(userId),
						serviceName: { $regex: searchText, $options: "i" },
					},
				},
				{
					$limit: limit,
				},
			]);
		}

		const returnServices = services.map((service) => {
			const { serviceDescription, __v, removed, ...rest } = service;

			return rest;
		});

		if (!returnServices) {
			return res.status(400).json({ msg: "Fail to retrieve services" });
		}

		res.status(200).json({ msg: "Success", returnServices });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const removeService = async (req, res) => {
	try {
		const { serviceId } = req.body;

		const removedService = await Service.findByIdAndUpdate(serviceId, {
			$set: { removed: true },
		});

		if (!removedService) {
			return res.status(400).json({ msg: "Fail to remove service" });
		}

		// remove image
		const servicePosterImagePath = path.join(
			__dirname,
			"public/images/service",
			removedService.servicePosterImagePath
		);
		fs.unlinkSync(servicePosterImagePath);

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

export const editService = async (req, res) => {
	try {
		const { serviceId, name, description, category, contactNumber } = req.body;

		const image = req.file;

		const originalService = await Service.findById(serviceId);
		const originalServiceImagePath = originalService.servicePosterImagePath;

		let updatedService;

		//update image
		if (image) {
			updatedService = await Service.findByIdAndUpdate(serviceId, {
				$set: {
					serviceName: name,
					serviceDescription: description,
					serviceCategory: category,
					servicePosterImagePath: image.filename,
					contactNumber,
				},
			});
		} else {
			// do not update image
			updatedService = await Service.findByIdAndUpdate(serviceId, {
				$set: {
					serviceName: name,
					serviceDescription: description,
					serviceCategory: category,
					contactNumber,
				},
			});
		}

		if (!updatedService) {
			return res.status(400).json({ msg: "Fail to edit service" });
		}

		// remove original image
		if (image) {
			const imagePath = path.join(
				__dirname,
				"public/images/service",
				originalServiceImagePath
			);
			fs.unlinkSync(imagePath);
		}

		res.status(200).json({ msg: "Success" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
