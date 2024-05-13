export const INITIAL_STATE = {
	loading: false,
	eventName: "",
	eventDescription: "",
	contactNumbers: [],
	eventPosterImagePath: "",
	image: [],
	madeChanges: false,
	hasImagePathChanged: false,
	eventStartDate: "",
	eventEndDate: "",
	minEndDate: "",
	eventVenue: "",
	eventOrganizer: "",
	isOneDayEvent: false,
	eventOneDate: "",
	eventStartTime: "",
	eventEndTime: "",
	count: 0,
};

export const editEventReducer = (state, action) => {
	switch (action.type) {
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "FIRST_RENDER": {
			const {
				eventName,
				eventDescription,
				contactNumbers,
				eventPosterImagePath,
				eventStartDate,
				eventEndDate,
				eventVenue,
				eventOrganizer,
				isOneDayEvent,
				eventOneDate,
				eventStartTime,
				eventEndTime,
			} = action.payload;
			let numberCount = 0;

			return {
				...state,
				eventName,
				eventDescription,
				contactNumbers: contactNumbers.map((contactNumber) => {
					const numberObj = { id: numberCount, number: contactNumber };
					numberCount++;
					return numberObj;
				}),
				eventPosterImagePath,
				eventStartDate,
				eventEndDate,
				eventVenue,
				eventOrganizer,
				isOneDayEvent,
				eventOneDate,
				eventStartTime,
				eventEndTime,
				count: numberCount,
			};
		}
		case "SET_NAME": {
			return {
				...state,
				eventName: action.payload,
				madeChanges: true,
			};
		}
		case "SET_DESCRIPTION": {
			return {
				...state,
				eventDescription: action.payload,
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
				madeChanges: action.payload,
			};
		}
		case "ADD_CONTACT_NUMBER": {
			const { id, number } = action.payload;

			return {
				...state,
				contactNumbers: [...state.contactNumbers, { id, number }],
				count: state.count + 1,
				madeChanges: true,
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
				eventStartDate: action.payload,
				madeChanges: true,
			};
		}
		case "SET_END_DATE": {
			return {
				...state,
				eventEndDate: action.payload,
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
				eventVenue: action.payload,
				madeChanges: true,
			};
		}
		case "UPLOAD_IMAGE": {
			const { image, imagePath } = action.payload;
			return {
				...state,
				eventPosterImagePath: imagePath,
				image: image,
				hasImagePathChanged: true,
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
				eventOneDate: action.payload,
				madeChanges: true,
			};
		}
		case "SET_START_TIME": {
			return {
				...state,
				eventStartTime: action.payload,
				madeChanges: true,
			};
		}
		case "SET_END_TIME": {
			return {
				...state,
				eventEndTime: action.payload,
				madeChanges: true,
			};
		}
		case "SET_ORGANIZER": {
			return {
				...state,
				eventOrganizer: action.payload,
				madeChanges: true,
			};
		}
		case "RESET_STATE": {
			return {
				...state,
				loading: false,
				eventName: "",
				eventDescription: "",
				contactNumbers: [],
				eventPosterImagePath: "",
				image: [],
				madeChanges: false,
				hasImagePathChanged: false,
				eventStartDate: "",
				eventEndDate: "",
				minEndDate: "",
				eventVenue: "",
				eventOrganizer: "",
				isOneDayEvent: false,
				eventOneDate: "",
				eventStartTime: "",
				eventEndTime: "",
				count: 0,
			};
		}
	}
};
