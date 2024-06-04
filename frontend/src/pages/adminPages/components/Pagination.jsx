import { React, useState } from "react";

const Pagination = ({ rows, currentPage, setCurrentPage, loading }) => {
	const [rowsPerPage] = useState(10);
	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		!loading && (
			<ul className="mt-3 flex items-center justify-center bg-gray-200">
				{Array.from(
					{ length: Math.ceil(rows.length / rowsPerPage) },
					(_, index) => (
						<li key={index} className={`mx-1 hover:text-blue-600`}>
							<button
								onClick={() => paginate(index + 1)}
								className={`${
									currentPage == index + 1
										? "underline underline-offset-2 text-blue-500"
										: ""
								}`}
							>
								{index + 1}
							</button>
						</li>
					)
				)}
			</ul>
		)
	);
};

export default Pagination;
