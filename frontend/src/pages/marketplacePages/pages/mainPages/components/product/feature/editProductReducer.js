export const INITIAL_STATE = {
	loading: false,
	productName: "",
	productDescription: "",
	productPrice: 0,
	productQuantity: 0,
	contactNumber: "",
	productImagePath: "",
	image: [],
	madeChanges: false,
	hasImagePathChanged: false,
};

export const editProductReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "FIRST_RENDER": {
			const {
				productName,
				productDescription,
				productPrice,
				productQuantity,
				contactNumber,
				productImagePath,
			} = action.payload;

			return {
				...state,
				productName,
				productDescription,
				productPrice: Number(productPrice).toFixed(2),
				productQuantity,
				contactNumber,
				productImagePath,
			};
		}
		case "SET_PRODUCT_NAME": {
			return {
				...state,
				productName: action.payload,
				madeChanges: true,
			};
		}
		case "SET_PRODUCT_DESCRIPTION": {
			return {
				...state,
				productDescription: action.payload,
				madeChanges: true,
			};
		}
		case "SET_PRODUCT_PRICE": {
			return {
				...state,
				productPrice: action.payload,
				madeChanges: true,
			};
		}
		case "SET_PRODUCT_QUANTITY": {
			return {
				...state,
				productQuantity: action.payload,
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
				productImagePath: imagePath,
				image: image,
				hasImagePathChanged: true,
			};
		}
		default: {
			return state;
		}
	}
};
