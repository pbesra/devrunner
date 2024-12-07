import Box from "@mui/material/Box";
import Header from "../Header/Header";
import Main from "../Main/Main";
import AppDrawer from "components/AppDrawer/AppDrawer";
const Home = () => {
	return (
		<>
			<Header />
			<Box>
				<Main />
				<AppDrawer />
			</Box>
		</>
	);
};
export default Home;
