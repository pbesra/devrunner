import { useAppDrawer } from "v1/apphooks/index";
import Box from "@mui/material/Box";
import AppDrawer from "v1/components/AppDrawer/AppDrawer";
import Header from "v1/components/Header/Header";
import Main from "v1/components/Main/Main";
import { useCallback } from "react";
import transformers from "v1/resources/transformers/transfomers";

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
