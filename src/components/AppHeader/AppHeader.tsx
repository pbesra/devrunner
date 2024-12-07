import { useAppDrawer } from "@hooks/index";
import AppDrawer from "components/AppDrawer/AppDrawer";
import Header from "components/Header/Header";
import { useCallback } from "react";

const AppHeader = () => {
	const { state, toggleDrawer, setState } = useAppDrawer({ anchor: "left" });
	const onClickHomeIcon = useCallback(() => {
		setState({ ...state, left: true });
	}, []);
	return (
		<>
			<Header onClickHomeIcon={onClickHomeIcon} />
			<AppDrawer state={state} toggleDrawer={toggleDrawer} />
		</>
	);
};
export default AppHeader;
