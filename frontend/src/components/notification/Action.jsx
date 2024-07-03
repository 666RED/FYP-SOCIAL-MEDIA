import React from "react";

const Action = ({ actor, action }) => {
	return (
		<p>
			<span className="font-semibold">{actor}</span> {action}
		</p>
	);
};

export default Action;
