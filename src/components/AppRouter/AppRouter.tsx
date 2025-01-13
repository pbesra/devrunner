import { Route, Routes } from "react-router";
import AppHeader from "components/AppHeader/AppHeader";
import DefaultHome from "components/Home/DefaultHome";
import transformers from "resources/transformers/transfomers";
import Box from "@mui/material/Box";
const AppRouter = () => {
	return (
		<>
			<AppHeader />
			<Box sx={{ margin: 1 }}>
				<Routes>
					<Route path="/" element={<DefaultHome />} />
					{/* <Route path="*" element={<Home />} /> */}
					{transformers.map((x) => (
						<Route
							key={x.name}
							path={`/${x.endpoint}`}
							element={<x.component />}
						/>
					))}
				</Routes>
			</Box>
		</>
	);
};

export default AppRouter;
