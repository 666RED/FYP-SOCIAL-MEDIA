import React from "react";
import { FaSearch } from "react-icons/fa/index.js";

const SearchBar = ({ text, func, placeholderText, isDisabled }) => {
	const handleFocus = () => {
		const searchInput = document.querySelector("#search-input");
		searchInput.focus();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<form
			className="flex border-2 border-gray-600 rounded-xl w-7/12 items-center max-w-72"
			onClick={handleFocus}
			autoComplete="off"
			onSubmit={handleSubmit}
		>
			<input
				disabled={isDisabled}
				type="text"
				onChange={(e) => func(e.target.value)}
				value={text}
				placeholder={placeholderText}
				className="border-none outline-none w-full p-2"
				maxLength={50}
				id="search-input"
			/>
			<FaSearch className="mr-3 text-lg" />
		</form>
	);
};

export default SearchBar;
