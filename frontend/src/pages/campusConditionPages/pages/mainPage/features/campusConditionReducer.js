export const INITIAL_STATE = {
	showOptionDiv: false,
	showEditConditionForm: false,
	showReportForm: false,
	isProcessing: false,
	isUp: false,
	isDown: false,
	conditionUp: 0,
	conditionDown: 0,
	viewLocation: false,
	conditionResolved: false,
	loading: false,
};

export const CampusConditionReducer = (state, action) => {
	switch (action.type) {
		case "FIRST_RENDER": {
			const {
				conditionUpMaps,
				conditionDownMaps,
				conditionUp,
				conditionDown,
				userId,
				conditionResolved,
			} = action.payload;

			return {
				...state,
				isUp: conditionUpMaps.hasOwnProperty(userId),
				isDown: conditionDownMaps.hasOwnProperty(userId),
				conditionUp,
				conditionDown,
				conditionResolved,
			};
		}
		case "TOGGLE_SHOW_OPTION_DIV": {
			return {
				...state,
				showOptionDiv: !state.showOptionDiv,
			};
		}
		case "TOGGLE_CONDITION_RESOLVED": {
			return {
				...state,
				conditionResolved: !state.conditionResolved,
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
		case "TOGGLE_SHOW_REPORT_FORM": {
			return {
				...state,
				showReportForm: !state.showReportForm,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "FINISH_MARKING": {
			return {
				...state,
				showOptionDiv: !state.showOptionDiv,
			};
		}
		default: {
			return state;
		}
	}
};
