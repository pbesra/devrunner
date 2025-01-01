import { useAppDrawer } from "@hooks/index";
import AppDrawer from "components/AppDrawer/AppDrawer";
import Header from "components/Header/Header";
import { useCallback } from "react";
import transformers from "resources/transformers/transfomers";

const AppHeader = () => {
	const { state, toggleDrawer, setState } = useAppDrawer({ anchor: "left" });
	const onClickHomeIcon = useCallback(() => {
		setState({ ...state, left: true });
	}, []);
	var items = ["XSLT", "Text Compare", "XML to JSON"];
	return (
		<>
			<Header onClickHomeIcon={onClickHomeIcon} />
			<AppDrawer
				drawerItems={transformers}
				state={state}
				toggleDrawer={toggleDrawer}
			/>
		</>
	);
};
export default AppHeader;
