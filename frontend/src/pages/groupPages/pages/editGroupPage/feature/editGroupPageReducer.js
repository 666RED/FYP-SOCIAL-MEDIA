export const INITIAL_STATE = {
	loading: false,
	groupImagePath: "",
	groupCoverImagePath: "",
	groupName: "",
	groupBio: "",
	isNameEdit: false,
	ieBioEdit: false,
	makeChanges: false,
};

export const editGroupPageReducer = (state, action) => {
	switch (action.type) {
		case "FIRST_RENDER": {
			const { groupImagePath, groupCoverImagePath, groupName, groupBio } =
				action.payload.returnedGroup;
			return {
				...state,
				groupImagePath: groupImagePath,
				groupCoverImagePath: groupCoverImagePath,
				groupName,
				groupBio,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_MAKE_CHANGES": {
			return {
				...state,
				makeChanges: action.payload,
			};
		}
		case "UPDATE_GROUP_IMAGE": {
			const { imagePath, image } = action.payload;
			return {
				...state,
				groupImagePath: imagePath,
				groupImage: image,
				makeChanges: true,
			};
		}
		case "UPDATE_GROUP_COVER_IMAGE": {
			const { imagePath, image } = action.payload;
			return {
				...state,
				groupCoverImagePath: imagePath,
				groupCoverImage: image,
				makeChanges: true,
			};
		}
		case "TOGGLE_IS_NAME_EDIT": {
			return {
				...state,
				isNameEdit: !state.isNameEdit,
			};
		}
		case "TOGGLE_IS_BIO_EDIT": {
			return {
				...state,
				isBioEdit: !state.isBioEdit,
			};
		}
		case "SET_GROUP_NAME": {
			return {
				...state,
				groupName: action.payload,
				makeChanges: true,
			};
		}
		case "SET_GROUP_BIO": {
			return {
				...state,
				groupBio: action.payload,
				makeChanges: true,
			};
		}
		default: {
			return state;
		}
	}
};
