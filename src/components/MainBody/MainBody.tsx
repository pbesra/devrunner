import { useAppDrawer } from "@hooks/index";
import Box from "@mui/material/Box";
import AppDrawer from "components/AppDrawer/AppDrawer";
import Header from "components/Header/Header";
import Main from "components/Main/Main";
import { useCallback } from "react";

const MainBody = () => {
	const { state, toggleDrawer, setState } = useAppDrawer({ anchor: "left" });
	const onClickHomeIcon = useCallback(() => {
		setState({ ...state, left: true });
	}, []);
	return (
		<>
			<Header onClickHomeIcon={onClickHomeIcon} />
			<AppDrawer state={state} toggleDrawer={toggleDrawer} />
			<Box>
				<Main />
			</Box>
		</>
	);
};
export default MainBody;
