export const SERVICE_INITIAL_STATE = {
	name: "",
	description: "",
	image: {},
	imagePath: "",
	madeChanges: false,
	contactNumber: "",
	category: "tutoring",
};

export const createServiceReducer = (state, action) => {
	switch (action.type) {
		case "SET_NAME": {
			return {
				...state,
				name: action.payload,
				madeChanges: true,
			};
		}
		case "SET_DESCRIPTION": {
			return {
				...state,
				description: action.payload,
				madeChanges: true,
			};
		}
		case "SET_CONTACT_NUMBER": {
			return {
				...state,
				contactNumber: action.payload,
			};
		}
		case "SET_MADE_CHANGES": {
			return {
				...state,
				madeChanges: action.payload,
			};
		}
		case "SET_CATEGORY": {
			return {
				...state,
				category: action.payload,
				madeChanges: true,
			};
		}
		case "UPLOAD_IMAGE": {
			const { image, imagePath } = action.payload;
			return {
				...state,
				image,
				imagePath,
				madeChanges: true,
			};
		}
		case "REMOVE_IMAGE": {
			return {
				...state,
				image: {},
				imagePath: "",
				madeChanges: true,
			};
		}
		case "RESET_STATE": {
			return {
				...state,
				name: "",
				description: "",
				image: {},
				imagePath: "",
				madeChanges: false,
				contactNumber: "",
				category: "",
			};
		}
		default: {
			return state;
		}
	}
};
