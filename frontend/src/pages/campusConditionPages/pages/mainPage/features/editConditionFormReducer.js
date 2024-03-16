export const INITIAL_STATE = {
	loading: false,
	hasConditionTitleChanged: false,
	hasConditionDescriptionChanged: false,
	hasConditionImagePathChanged: false,
	conditionTitle: "",
	conditionDescription: "",
	conditionImagePath: "",
	conditionImage: {},
};

export const editConditionFormReducer = (state, action) => {
	switch (action.type) {
		case "FIRST_RENDER": {
			const { conditionTitle, conditionDescription, conditionImagePath } =
				action.payload;
			return {
				...state,
				conditionTitle,
				conditionDescription,
				conditionImagePath,
			};
		}
		case "SET_CONDITION_TITLE": {
			return {
				...state,
				conditionTitle: action.payload,
				hasConditionTitleChanged: true,
			};
		}
		case "SET_CONDITION_DESCRIPTION": {
			return {
				...state,
				conditionDescription: action.payload,
				hasConditionDescriptionChanged: true,
			};
		}
		case "UPLOAD_IMAGE": {
			const { imagePath, image, hasChanged } = action.payload;
			return {
				...state,
				conditionImagePath: imagePath,
				conditionImage: image,
				hasConditionImagePathChanged: hasChanged,
			};
		}
		case "REMOVE_IMAGE": {
			return {
				...state,
				conditionImagePath: "",
				conditionImage: {},
				hasConditionImagePathChanged: true,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		default: {
			return state;
		}
	}
};
