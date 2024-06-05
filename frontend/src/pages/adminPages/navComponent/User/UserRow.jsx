import { React, useContext, useState } from "react";
import FocusImage from "../../components/FocusImage.jsx";
import ImageRow from "../../components/ImageRow.jsx";
import { ServerContext } from "../../../../App.js";

const UserRow = ({ user, count }) => {
	const serverURL = useContext(ServerContext);
	const [showImage, setShowImage] = useState(false);
	const [showCoverImage, setShowCoverImage] = useState(false);

	return (
		<tr className="hover:bg-gray-200">
			<td className="text-center">{count}</td>
			<td>{user.userName}</td>
			<td>
				<ImageRow imagePath={user.imagePath} setShowImage={setShowImage} />
			</td>
			<td>
				<ImageRow
					imagePath={user.coverImagePath}
					setShowImage={setShowCoverImage}
				/>
			</td>
			<td>{user.email}</td>
			<td>{user.phoneNumber}</td>
			<td className="text-center">{user.friends}</td>
			<td className="text-center">{user.groups}</td>
			<td className="text-center">{user.registered}</td>
			{showImage && (
				<FocusImage
					imagePath={user.imagePath}
					setShowImage={setShowImage}
					isProfileImage={true}
				/>
			)}
			{showCoverImage && (
				<FocusImage
					imagePath={user.coverImagePath}
					setShowImage={setShowCoverImage}
				/>
			)}
		</tr>
	);
};

export default UserRow;
