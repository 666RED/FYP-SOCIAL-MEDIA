export const formatDateTime = (createdAt) => {
	const currentDate = new Date();
	const createdDate = new Date(
		createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
	);

	const timeDifference = currentDate.getTime() - createdDate.getTime();
	const secondsDifference = Math.floor(timeDifference / 1000);
	const minutesDifference = Math.floor(secondsDifference / 60);
	const hoursDifference = Math.floor(minutesDifference / 60);
	const daysDifference = Math.floor(hoursDifference / 24);

	if (hoursDifference < 24) {
		if (hoursDifference === 0) {
			return "within 1h";
		} else {
			return `${hoursDifference}h ago`;
		}
	} else if (daysDifference < 31) {
		return `${daysDifference}d ago`;
	} else {
		const monthsDifference = Math.floor(daysDifference / 31);

		if (monthsDifference < 12) {
			return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
		} else {
			const yearsDifference = Math.floor(monthsDifference / 12);
			return `${yearsDifference} year${yearsDifference > 1 ? "s" : ""} ago`;
		}
	}
};

export const capitalize = (category) => {
	return category === ""
		? ""
		: category
				.split("-")
				.map((word, index) =>
					index === 0 ? word[0].toUpperCase() + word.slice(1) : word
				)
				.join(" ");
};

export const formatDateTimeForFirebaseDoc = (createdAt) => {
	const currentDate = new Date();
	const createdDate = new Date(
		createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
	);

	const timeDifference = currentDate.getTime() - createdDate.getTime();
	const secondsDifference = Math.floor(timeDifference / 1000);
	const minutesDifference = Math.floor(secondsDifference / 60);
	const hoursDifference = Math.floor(minutesDifference / 60);
	const daysDifference = Math.floor(hoursDifference / 24);

	if (hoursDifference < 24) {
		if (hoursDifference === 0) {
			return "within 1h";
		} else {
			return `${hoursDifference}h ago`;
		}
	} else if (daysDifference < 31) {
		return `${daysDifference}d ago`;
	} else {
		const monthsDifference = Math.floor(daysDifference / 31);

		if (monthsDifference < 12) {
			return `${monthsDifference} month${monthsDifference > 1 ? "s" : ""} ago`;
		} else {
			const yearsDifference = Math.floor(monthsDifference / 12);
			return `${yearsDifference} year${yearsDifference > 1 ? "s" : ""} ago`;
		}
	}
};

export const formatTimeForFirebaseDoc = (createdAt) => {
	const date = new Date(
		createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
	);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");

	return `${hours}:${minutes}`;
};

export const formatDateForFirebaseDoc = (createdAt) => {
	const date = new Date(
		createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
	);
	const year = date.getFullYear().toString();
	const month = (date.getMonth() + 1).toString().padStart(2, "0");
	const day = date.getDate().toString().padStart(2, "0");

	return `${year}-${month}-${day}`;
};
