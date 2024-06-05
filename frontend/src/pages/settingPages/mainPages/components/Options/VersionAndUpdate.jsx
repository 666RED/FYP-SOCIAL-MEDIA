import React from "react";
import Title from "../smallComponents//Title.jsx";

const VersionAndUpdate = () => {
	return (
		<div>
			{/* TITLE */}
			<Title title="Version and Update" />
			{/* CONTENT */}
			<p className="mb-3 font-semibold inline">Current Version:</p>{" "}
			<span>1.0.0</span>
			<br /> <br />
			<p className="my-3 font-semibold inline">Last Updated:</p>{" "}
			<span>06 June 2024</span>
			<br /> <br />
			<p className="my-3 font-semibold inline">Updates:</p>{" "}
			<span>
				We are committed to improving FSKTMConnect and may release updates
				periodically to enhance functionality and security. We encourage you to
				keep your app up to date to access the latest features and improvements.
			</span>
		</div>
	);
};

export default VersionAndUpdate;
