export const INITIAL_STATE = {
	loading: true,
	serviceName: "",
	serviceDescription: "",
	serviceCategory: "",
	contactNumber: "",
	servicePosterImagePath: "",
	image: [],
	madeChanges: false,
	hasImagePathChanged: false,
};

export const editServiceReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "FIRST_RENDER": {
			const {
				serviceName,
				serviceDescription,
				serviceCategory,
				contactNumber,
				servicePosterImagePath,
			} = action.payload;

			return {
				...state,
				serviceName,
				serviceDescription,
				serviceCategory,
				contactNumber,
				servicePosterImagePath,
			};
		}
		case "SET_SERVICE_NAME": {
			return {
				...state,
				serviceName: action.payload,
				madeChanges: true,
			};
		}
		case "SET_SERVICE_DESCRIPTION": {
			return {
				...state,
				serviceDescription: action.payload,
				madeChanges: true,
			};
		}
		case "SET_SERVICE_CATEGORY": {
			return {
				...state,
				serviceCategory: action.payload,
				madeChanges: true,
			};
		}
		case "SET_CONTACT_NUMBER": {
			return {
				...state,
				contactNumber: action.payload,
				madeChanges: true,
			};
		}
		case "UPLOAD_IMAGE": {
			const { imagePath, image } = action.payload;
			return {
				...state,
				servicePosterImagePath: imagePath,
				image: image,
				hasImagePathChanged: true,
			};
		}
		default: {
			return state;
		}
	}
};
