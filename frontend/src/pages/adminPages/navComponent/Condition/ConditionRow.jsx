import { React, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import Spinner from "../../../../components/Spinner/Spinner.jsx";
import FocusImage from "../../components/FocusImage.jsx";
import ImageRow from "../../components/ImageRow.jsx";
import StatusText from "../../components/StatusText.jsx";
import { ServerContext } from "../../../../App.js";

const ConditionRow = ({ condition, count }) => {
	const { enqueueSnackbar } = useSnackbar();
	const serverURL = useContext(ServerContext);
	const { token } = useSelector((store) => store.admin);
	const [loading, setLoading] = useState(false);
	const [conditionResolved, setConditionResolved] = useState(
		condition.resolved
	);
	const [showImage, setShowImage] = useState(false);
	const conditionImagePath = `${serverURL}/public/images/campus-condition/`;

	const handleMarkResolved = async () => {
		try {
			const ans = window.confirm("Mark resolved?");
			if (ans) {
				setLoading(true);
				const res = await fetch(
					`${serverURL}/campus-condition/update-condition-resolved`,
					{
						method: "PATCH",
						body: JSON.stringify({
							campusConditionId: condition._id,
							isConditionResolved: conditionResolved,
						}),
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					}
				);

				if (!res.ok && res.status === 403) {
					setLoading(true);
					enqueueSnackbar("Access Denied", { variant: "error" });
					return;
				}

				const { msg } = await res.json();

				if (msg === "Success") {
					setConditionResolved(true);
					enqueueSnackbar("Condition is marked resolved", {
						variant: "success",
					});
				} else if (msg === "Condition not found") {
					enqueueSnackbar("Condition not found", {
						variant: "error",
					});
				} else if (msg === "Fail to update condition") {
					enqueueSnackbar("Fail to update condition", {
						variant: "error",
					});
				} else {
					enqueueSnackbar("An error occurred", {
						variant: "error",
					});
				}

				setLoading(false);
			}
		} catch (err) {
			enqueueSnackbar("Could not connect to the server", {
				variant: "error",
			});
			setLoading(false);
		}
	};

	return (
		<tr className="hover:bg-gray-200">
			<td className="text-center">{count}</td>
			<td>{condition.title}</td>
			<td>{condition.description}</td>
			<td>
				<ImageRow
					imagePath={condition.imagePath}
					setShowImage={setShowImage}
					imageRemoved={condition.removed}
				/>
			</td>
			<td>{condition.poster}</td>
			<td>
				{conditionResolved ? (
					<TiTick className="text-xl bg-green-600 rounded-full text-white mx-auto" />
				) : (
					<RxCross2 className="bg-red-600 rounded-full text-xl text-white mx-auto" />
				)}
			</td>
			<td className="text-center">{condition.uploaded}</td>
			<StatusText isRemoved={condition.removed} />
			<td className="text-center py-0">
				{!condition.removed && !conditionResolved ? (
					<button
						className="btn-green operation-btn"
						onClick={handleMarkResolved}
					>
						Mark resolved
					</button>
				) : null}
			</td>
			{loading && <Spinner />}
			{showImage && (
				<FocusImage
					imagePath={`${conditionImagePath}${condition.imagePath}`}
					setShowImage={setShowImage}
				/>
			)}
		</tr>
	);
};

export default ConditionRow;
