import Home from "components/Home/Home";
import { Route, Routes } from "react-router";
const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route path="*" element={<Home />} />
			</Routes>
		</>
	);
};

export default AppRouter;
