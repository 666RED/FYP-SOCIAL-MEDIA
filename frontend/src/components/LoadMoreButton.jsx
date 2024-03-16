import React from "react";
import Loader from "./Spinner/Loader.jsx";

const LoadMoreButton = ({
	hasComponent,
	loadMore,
	isLoadingComponent,
	handleLoadMore,
}) => {
	return (
		<div>
			{/* LOAD MORE BUTTON */}
			<button
				className={`btn-gray block mx-auto w-1/3 md:w-1/4 lg:col-span-5 mt-5 ${
					(!hasComponent || loadMore) && "hidden"
				}`}
				disabled={isLoadingComponent}
				onClick={handleLoadMore}
			>
				Load More
			</button>
			{/* LOADER */}
			{loadMore && (
				<div className="col-span-5 block mx-auto">
					<Loader />
				</div>
			)}
		</div>
	);
};

export default LoadMoreButton;
