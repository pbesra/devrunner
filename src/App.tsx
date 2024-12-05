import React from "react";
import "./App.css";
import Home from "./components/Home/Home";
import { Route, Routes } from "react-router";
import AppRouter from "components/AppRouter/AppRouter";

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
