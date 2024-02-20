import { React, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi/index.js";
import { GoBellFill } from "react-icons/go/index.js";
import { FaSearch } from "react-icons/fa/index.js";
import { setExtendSideBar } from "./features/homepage.js";
import { ServerContext } from "../../App.js";
import SideBar from "../../components/SideBar.jsx";

const Homepage = () => {
	const serverURL = useContext(ServerContext);

	const dispatch = useDispatch();
	const { extendSideBar } = useSelector((store) => store.homepage);
	const auth = useSelector((store) => store.auth);

	const navigate = useNavigate();

	return (
		<div className="mx-3 mt-2">
			{extendSideBar && <SideBar />}
			{/* HEADER */}
			<div className="grid grid-cols-12 grid-rows-1 ">
				<div className="col-start-1 col-span-3 flex items-center">
					<GiHamburgerMenu
						onClick={() => dispatch(setExtendSideBar(!extendSideBar))}
						className="mr-3 icon"
					/>
					<p>Logo</p>
				</div>

				<div className="col-start-8 col-span-5 flex justify-end items-center">
					<div className="mr-3">
						<GoBellFill className="icon " />
					</div>
					<div>
						<FaSearch className="icon " />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Homepage;
