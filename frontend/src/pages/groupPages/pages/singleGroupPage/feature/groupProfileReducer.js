export const INITIAL_STATE = {
	groupName: "",
	groupImagePath: "",
	groupCoverImagePath: "",
	groupBio: "",
	groupAdminId: "",
	numOfMembers: 0,
	loading: false,
	loadJoinGroupStatus: true,
	joinGroupStatus: "",
	joinGroupRequest: [],
	numberJoinGroupRequests: 0,
	showReportForm: false,
};

export const groupProfileReducer = (state, action) => {
	switch (action.type) {
		case "FIRST_RENDER": {
			const {
				groupName,
				groupImagePath,
				groupCoverImagePath,
				groupBio,
				groupAdminId,
				members,
			} = action.payload.returnGroup;
			return {
				...state,
				groupName,
				groupImagePath: groupImagePath,
				groupCoverImagePath: groupCoverImagePath,
				groupBio,
				groupAdminId,
				numOfMembers: Object.keys(members).length,
			};
		}
		case "SET_LOADING": {
			return {
				...state,
				loading: action.payload,
			};
		}
		case "SET_JOIN_GROUP_REQUEST_AND_STATUS": {
			const { joinGroupRequest, joinGroupStatus } = action.payload;
			return {
				...state,
				joinGroupRequest,
				joinGroupStatus,
			};
		}
		case "SET_LOAD_JOIN_GROUP_STATUS": {
			return {
				...state,
				loadJoinGroupStatus: action.payload,
			};
		}
		case "SET_NUMBER_JOIN_GROUP_REQUESTS": {
			return {
				...state,
				numberJoinGroupRequests: action.payload,
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
