import React from "react";
import "./App.css";
import { Route, Routes } from "react-router";
import AppRouter from "v1/components/AppRouter/AppRouter";
import { Provider } from "react-redux";
import rootStore from "v1/appReduxStore/rootStore/rootStore";

function App() {
	return (
		<Provider store={rootStore}>
			<div className="App">
				<Routes>
					<Route path="*" element={<AppRouter />} />
				</Routes>
			</div>
		</Provider>
	);
}

export default App;
