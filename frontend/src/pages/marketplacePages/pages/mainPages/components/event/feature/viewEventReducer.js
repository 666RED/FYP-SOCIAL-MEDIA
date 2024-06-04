export const INITIAL_STATE = {
	loading: true,
	eventName: "",
	eventDescription: "",
	contactNumbers: [],
	eventPosterImagePath: "",
	eventVenue: "",
	eventOrganizer: "",
	isOneDayEvent: false,
	eventStartDate: "",
	eventEndDate: "",
	eventOneDate: "",
	eventStartTime: "",
	eventEndTime: "",
	userName: "",
	userProfileImagePath: "",
	frameColor: "",
	userId: "",
	showReportForm: false,
};

export const viewEventReducer = (state, action) => {
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
				eventVenue,
				eventOrganizer,
				isOneDayEvent,
				eventStartDate,
				eventEndDate,
				eventOneDate,
				eventStartTime,
				eventEndTime,
				userName,
				userProfileImagePath,
				userId,
				frameColor,
			} = action.payload;

			return {
				...state,
				eventName,
				eventDescription,
				contactNumbers,
				eventPosterImagePath,
				eventVenue,
				eventOrganizer,
				isOneDayEvent,
				eventStartDate,
				eventEndDate,
				eventOneDate,
				eventStartTime,
				eventEndTime,
				userName,
				userProfileImagePath,
				userId,
				frameColor,
			};
		}
		case "TOGGLE_SHOW_REPORT_FORM": {
			return {
				...state,
				showReportForm: !state.showReportForm,
			};
		}
		default: {
			return state;
		}
	}
};
