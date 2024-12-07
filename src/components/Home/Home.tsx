import Box from "@mui/material/Box";
import Header from "../Header/Header";
import Main from "../Main/Main";
import AppDrawer from "components/AppDrawer/AppDrawer";
import { useAppDrawer } from "@hooks/index";
const Home = () => {
	const { state, toggleDrawer } = useAppDrawer({ anchor: "left" });
	return (
		<>
			<Header />
			<Box>
				<Main />
				<AppDrawer state={state} toggleDrawer={toggleDrawer} />
			</Box>
		</>
	);
};
export default Home;
