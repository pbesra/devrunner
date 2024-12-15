import { useAppDrawer } from "@hooks/index";
import Box from "@mui/material/Box";
import AppDrawer from "components/AppDrawer/AppDrawer";
import Header from "components/Header/Header";
import Main from "components/Main/Main";
import { useCallback } from "react";
import transformers from "resources/transformers/transfomers";

const MainBody = () => {
	return (
		<>
			<Box>
				<Main />
			</Box>
		</>
	);
};
export default MainBody;
