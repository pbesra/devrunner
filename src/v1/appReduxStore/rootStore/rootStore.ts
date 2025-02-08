import { configureStore } from "@reduxjs/toolkit";
import coreAIReducer from "../coreAIRedux/coreAISlice/coreAISlice";
import coreCodeEditorReducer from "../coreCodeEditorRedux/coreCodeEditorSlice/coreCodeEditorSlice";

const rootStore = configureStore({
	reducer: {
		coreAI: coreAIReducer,
		coreCodeEditor: coreCodeEditorReducer,
	},
});

export type AppDispatch = typeof rootStore.dispatch;
export type RootState = ReturnType<typeof rootStore.getState>;
export default rootStore;
