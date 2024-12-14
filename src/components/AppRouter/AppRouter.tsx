import Home from "components/Home/Home";
import { Route, Routes } from "react-router";
import AppHeader from "components/AppHeader/AppHeader";
const AppRouter = () => {
	return (
		<>
			<AppHeader />
			<Routes>
				<Route path="*" element={<Home />} />
			</Routes>
		</>
	);
};

export default AppRouter;
