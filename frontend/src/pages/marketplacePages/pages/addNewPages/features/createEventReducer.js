export const EVENT_INITIAL_STATE = {
	name: "",
	description: "",
	image: {},
	imagePath: "",
	madeChanges: false,
	contactNumbers: [],
	startDate: "",
	endDate: "",
	minEndDate: "",
	venue: "",
	isOneDayEvent: false,
	oneDate: "",
	startTime: "",
	endTime: "",
	count: 0,
	orgnizer: "",
};

export const createEventReducer = (state, action) => {
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
		case "SET_MADE_CHANGES": {
			return {
				...state,
				madeChanges: action.payload,
			};
		}
		case "SET_CONTACT_NUMBER": {
			const { id, number } = action.payload;

			const newContactNumbers = state.contactNumbers.map((obj) =>
				obj.id == id ? { id, number } : obj
			);
			return {
				...state,
				contactNumbers: newContactNumbers,
			};
		}
		case "ADD_CONTACT_NUMBER": {
			const { id, number } = action.payload;

			return {
				...state,
				contactNumbers: [...state.contactNumbers, { id, number }],
				count: state.count + 1,
			};
		}
		case "REMOVE_CONTACT_NUMBER": {
			const { id, number } = action.payload;

			if (number !== "") {
				const ans = window.confirm("Remove contact number?");
				if (ans) {
					const newContactNumbers = state.contactNumbers.filter(
						(obj) => obj.id !== id
					);

					return {
						...state,
						contactNumbers: newContactNumbers,
						count: state.count - 1,
						madeChanges: true,
					};
				} else {
					return state;
				}
			} else {
				const newContactNumbers = state.contactNumbers.filter(
					(obj) => obj.id !== id
				);

				return {
					...state,
					contactNumbers: newContactNumbers,
					count: state.count - 1,
					madeChanges: true,
				};
			}
		}
		case "SET_START_DATE": {
			return {
				...state,
				startDate: action.payload,
				madeChanges: true,
			};
		}
		case "SET_END_DATE": {
			return {
				...state,
				endDate: action.payload,
				madeChanges: true,
			};
		}
		case "SET_MIN_END_DATE": {
			return {
				...state,
				minEndDate: action.payload,
			};
		}
		case "SET_VENUE": {
			return {
				...state,
				venue: action.payload,
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
		case "TOGGLE_IS_ONE_DAY_EVENT": {
			return {
				...state,
				isOneDayEvent: !state.isOneDayEvent,
				madeChanges: true,
			};
		}
		case "SET_ONE_DATE": {
			return {
				...state,
				oneDate: action.payload,
				madeChanges: true,
			};
		}
		case "SET_START_TIME": {
			return {
				...state,
				startTime: action.payload,
				madeChanges: true,
			};
		}
		case "SET_END_TIME": {
			return {
				...state,
				endTime: action.payload,
				madeChanges: true,
			};
		}
		case "SET_ORGANIZER": {
			return {
				...state,
				organizer: action.payload,
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
				contactNumbers: [],
				startDate: "",
				endDate: "",
				minEndDate: "",
				venue: "",
				isOneDayEvent: false,
				oneDate: "",
				startTime: "",
				endTime: "",
				count: 0,
				orgnizer: "",
			};
		}
	}
};
