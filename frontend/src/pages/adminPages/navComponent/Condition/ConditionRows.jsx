import { React, useContext } from "react";
import Loader from "../../../../components/Spinner/Loader.jsx";
import ConditionRow from "./ConditionRow.jsx";
import NoResult from "../../components/NoResult.jsx";
import { conditionContext } from "./ConditionPage.jsx";

const ConditionRows = () => {
	const { loading, currentConditions, indexOfFirstCondition } =
		useContext(conditionContext);

	return loading ? (
		<Loader />
	) : currentConditions.length > 0 ? (
		currentConditions.map((condition, index) => (
			<ConditionRow
				condition={condition}
				key={condition._id}
				count={indexOfFirstCondition + index + 1}
			/>
		))
	) : (
		<NoResult />
	);
};

export default ConditionRows;
