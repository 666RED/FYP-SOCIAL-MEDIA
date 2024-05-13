export const PRODUCT_INITIAL_STATE = {
	name: "",
	description: "",
	image: {},
	imagePath: "",
	madeChanges: false,
	price: 1,
	quantity: 1,
	contactNumber: "",
};

export const createProductReducer = (state, action) => {
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
		case "SET_PRICE": {
			return {
				...state,
				price: action.payload,
				madeChanges: true,
			};
		}
		case "SET_MADE_CHANGES": {
			return {
				...state,
				madeChanges: action.payload,
			};
		}
		case "SET_QUANTITY": {
			return {
				...state,
				quantity: action.payload,
				madeChanges: true,
			};
		}
		case "SET_CONTACT_NUMBER": {
			return {
				...state,
				contactNumber: action.payload,
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
				price: 0,
			};
		}
		default: {
			return state;
		}
	}
};
