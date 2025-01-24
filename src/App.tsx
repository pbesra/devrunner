import React from "react";
import "./App.css";
import Home from "./v1/components/Home/Home";
import { Route, Routes } from "react-router";
import AppRouter from "v1/components/AppRouter/AppRouter";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="*" element={<AppRouter />} />
			</Routes>
		</div>
	);
}

export default App;
