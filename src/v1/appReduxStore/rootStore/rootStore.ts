import { configureStore } from "@reduxjs/toolkit";
import coreAIReducer from "../coreAIRedux/coreAISlice/coreAISlice";

const rootStore = configureStore({
	reducer: {
		coreAI: coreAIReducer,
	},
});

export type AppDispatch = typeof rootStore.dispatch;
export type RootState = ReturnType<typeof rootStore.getState>;
export default rootStore;
