import React, { useState } from "react";

const FAQsElement = ({ element }) => {
	const [showAnswer, setShowAnswer] = useState(false);

	return (
		<div
			className={`mb-3 border border-gray-400 p-2 rounded-xl setting-transition overflow-hidden ${
				showAnswer ? "max-h-[13rem] md:max-h-[7rem]" : "max-h-[2.5rem]"
			}`}
		>
			{/* QUESTION */}
			<h3
				className="font-semibold text-base cursor-pointer hover:opacity-70"
				onClick={() => setShowAnswer((prev) => !prev)}
			>
				{element.question}
			</h3>
			{/* ANSWR */}
			<p className={"mt-2 bg-gray-200 rounded-xl p-2"}>{element.answer}</p>
		</div>
	);
};

export default FAQsElement;
