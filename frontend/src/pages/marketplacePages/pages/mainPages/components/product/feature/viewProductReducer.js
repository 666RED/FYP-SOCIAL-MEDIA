export const INITIAL_STATE = {
	loading: false,
	productName: "",
	productDescription: "",
	productPrice: 0,
	productQuantity: 0,
	contactNumber: "",
	productImagePath: "",
	userName: "",
	userProfileImagePath: "",
	userId: "",
};

export const viewProductReducer = (state, action) => {
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
				userName,
				userProfileImagePath,
				userId,
			} = action.payload;

			return {
				...state,
				productName,
				productDescription,
				productPrice,
				productQuantity,
				contactNumber,
				productImagePath,
				userName,
				userProfileImagePath,
				userId,
			};
		}
		default: {
			return state;
		}
	}
};
