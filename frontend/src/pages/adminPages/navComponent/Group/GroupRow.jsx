import { React, useState, useContext } from "react";
import FocusImage from "../../components/FocusImage.jsx";
import ImageRow from "../../components/ImageRow.jsx";
import { ServerContext } from "../../../../App.js";
import StatusText from "../../components/StatusText.jsx";

const GroupRow = ({ group, count }) => {
	const [showImage, setShowImage] = useState(false);
	const [showCoverImage, setShowCoverImage] = useState(false);
	const serverURL = useContext(ServerContext);

	return (
		<tr className="hover:bg-gray-200">
			<td className="text-center">{count}</td>
			<td>{group.groupName}</td>
			<td>
				<ImageRow imagePath={group.imagePath} setShowImage={setShowImage} />
			</td>
			<td>
				<ImageRow
					imagePath={group.coverImagePath}
					setShowImage={setShowCoverImage}
				/>
			</td>
			<td>{group.groupAdminName}</td>
			<td className="text-center">{group.postCount}</td>
			<td className="text-center">{group.members}</td>
			<td className="text-center">{group.created}</td>
			{<StatusText isRemoved={group.removed} />}
			{showImage && (
				<FocusImage
					imagePath={group.imagePath}
					setShowImage={setShowImage}
					isProfileImage={true}
				/>
			)}
			{showCoverImage && (
				<FocusImage
					imagePath={group.coverImagePath}
					setShowImage={setShowCoverImage}
				/>
			)}
		</tr>
	);
};

export default GroupRow;
