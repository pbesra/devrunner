import Home from "components/Home/Home";
import { Route, Routes } from "react-router";
import AppHeader from "components/AppHeader/AppHeader";
import DefaultHome from "components/Home/DefaultHome";
import transformers from "resources/transformers/transfomers";
const AppRouter = () => {
	return (
		<>
			<AppHeader />
			<Routes>
				<Route path="/" element={<DefaultHome />} />
				{/* <Route path="*" element={<Home />} /> */}
				{transformers.map((x) => (
					<Route
						key={x.name}
						path={x.endpoint}
						element={<x.component />}
					/>
				))}
			</Routes>
		</>
	);
};

export default AppRouter;
