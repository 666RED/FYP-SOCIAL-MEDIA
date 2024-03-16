export const INITIAL_STATE = {
	userName: "",
	profileImagePath: "",
	conditionPosterId: "",
	updateTimeDuration: "",
	conditionTitle: "",
	conditionDescription: "",
	conditionImagePath: "",
	conditionResolved: false,
	showOptionDiv: false,
	showEditConditionForm: false,
	showReportConditionForm: false,
	isProcessing: false,
	isUp: false,
	isDown: false,
	conditionUp: 0,
	conditionDown: 0,
	locationLatitude: 0,
	locationLongitude: 0,
	viewLocation: false,
	loading: false,
};

export const CampusConditionReducer = (state, action) => {
	switch (action.type) {
		case "FIRST_RENDER": {
			const { userId, userName, profileImagePath, duration, condition } =
				action.payload;

			const {
				conditionTitle,
				conditionDescription,
				conditionImagePath,
				conditionUp,
				conditionDown,
				conditionUpMaps,
				conditionDownMaps,
				conditionLocation,
				conditionResolved,
			} = condition;

			const { locationLatitude, locationLongitude } = conditionLocation;

			const durationString = duration === 0 ? "Within 1h" : duration + "h";

			return {
				...state,
				userName,
				conditionPosterId: condition.userId,
				profileImagePath,
				conditionTitle,
				updateTimeDuration: durationString,
				conditionDescription,
				conditionImagePath,
				conditionResolved,
				conditionUp,
				conditionDown,
				isUp: conditionUpMaps.hasOwnProperty(userId),
				isDown: conditionDownMaps.hasOwnProperty(userId),
				locationLatitude,
				locationLongitude,
			};
		}
		case "TOGGLE_SHOW_OPTION_DIV": {
			return {
				...state,
				showOptionDiv: !state.showOptionDiv,
			};
		}
		case "SET_IS_PROCESSING": {
			return {
				...state,
				isProcessing: action.payload,
			};
		}
		case "UP_POST": {
			return {
				...state,
				isUp: true,
				isDown: false,
				conditionUp: state.conditionUp + 1,
			};
		}
		case "UP_POST_AND_CANCEL_DOWN": {
			return {
				...state,
				isUp: true,
				isDown: false,
				conditionUp: state.conditionUp + 1,
				conditionDown: state.conditionDown - 1,
			};
		}
		case "CANCEL_UP": {
			return {
				...state,
				isUp: false,
				isDown: false,
				conditionUp: state.conditionUp - 1,
			};
		}
		case "DOWN_POST": {
			return {
				...state,
				isUp: false,
				isDown: true,
				conditionDown: state.conditionDown + 1,
			};
		}
		case "DOWN_POST_AND_CANCEL_UP": {
			return {
				...state,
				isUp: false,
				isDown: true,
				conditionUp: state.conditionUp - 1,
				conditionDown: state.conditionDown + 1,
			};
		}
		case "CANCEL_DOWN": {
			return {
				...state,
				isUp: false,
				isDown: false,
				conditionDown: state.conditionDown - 1,
			};
		}
		case "TOGGLE_VIEW_LOCATION": {
			return {
				...state,
				viewLocation: !state.viewLocation,
			};
		}
		case "TOGGLE_SHOW_EDIT_CONDITION_FORM": {
			return {
				...state,
				showEditConditionForm: !state.showEditConditionForm,
			};
		}
		case "TOGGLE_SHOW_REPORT_CONDITION_FORM": {
			return {
				...state,
				showReportConditionForm: !state.showReportConditionForm,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "TOGGLE_CONDITION_RESOLVED": {
			return {
				...state,
				conditionResolved: !state.conditionResolved,
			};
		}
		case "FINISH_MARKING": {
			return {
				...state,
				conditionResolved: !state.conditionResolved,
				showOptionDiv: !state.showOptionDiv,
			};
		}
		default: {
			return state;
		}
	}
};
