import React, { useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const FAQsElement = ({ element }) => {
	const [showAnswer, setShowAnswer] = useState(false);

	return (
		<div
			className={`mb-3 border border-gray-400 p-2 rounded-xl setting-transition overflow-hidden ${
				showAnswer ? "max-h-[13rem] md:max-h-[7rem]" : "max-h-[2.5rem]"
			}`}
		>
			{/* QUESTION */}
			<div
				className="flex items-center justify-between cursor-pointer hover:opacity-70"
				onClick={() => setShowAnswer((prev) => !prev)}
			>
				<h3 className="font-semibold text-base">{element.question}</h3>
				{showAnswer ? <MdExpandLess /> : <MdExpandMore />}
			</div>
			{/* ANSWR */}
			<p className={"mt-2 bg-gray-200 rounded-xl p-2"}>{element.answer}</p>
		</div>
	);
};

export default FAQsElement;
