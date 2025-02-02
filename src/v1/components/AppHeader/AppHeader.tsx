import { useAppDrawer } from "v1/apphooks/index";
import AppDrawer from "v1/components/AppDrawer/AppDrawer";
import Header from "v1/components/Header/Header";
import { useCallback } from "react";
import transformers from "v1/resources/transformers/transfomers";
import HomeLogo from "v1/components/HomeLogo/HomeLogo";

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
				DrawerLogo={(props) => {
					return <HomeLogo {...props} />;
				}}
			/>
		</>
	);
};
export default AppHeader;
