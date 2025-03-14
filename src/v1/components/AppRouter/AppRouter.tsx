import { Route, Routes } from "react-router";
import AppHeader from "v1/components/AppHeader/AppHeader";
import DefaultHome from "v1/components/Home/DefaultHome";
import transformers from "v1/resources/transformers/transfomers";
import Box from "@mui/material/Box";
import NotFound from "../NotFound/NotFound";
const AppRouter = () => {
	return (
		<>
			<AppHeader />
			<Box sx={{ margin: 1 }}>
				<Routes>
					<Route path="/" element={<DefaultHome />} />

					{transformers.map((x) => (
						<Route
							key={x.name}
							path={`/${x.endpoint}`}
							element={<x.component />}
						/>
					))}
					<Route path="*" element={<NotFound />} />
				</Routes>
			</Box>
		</>
	);
};

export default AppRouter;
