import React from "react";
import { FaSearch } from "react-icons/fa/index.js";

const SearchBar = ({ text, func, placeholderText }) => {
	const handleFocus = () => {
		const searchInput = document.querySelector("#search-input");
		searchInput.focus();
	};

	return (
		<div
			className="flex border-2 border-gray-600 rounded-xl w-7/12 items-center max-w-72"
			onClick={handleFocus}
		>
			<input
				type="text"
				onChange={(e) => func(e.target.value)}
				value={text}
				placeholder={placeholderText}
				className="border-none outline-none w-full"
				maxLength={50} // maybe change later
				id="search-input"
			/>
			<FaSearch className="mr-3 text-lg" />
		</div>
	);
};

export default SearchBar;
