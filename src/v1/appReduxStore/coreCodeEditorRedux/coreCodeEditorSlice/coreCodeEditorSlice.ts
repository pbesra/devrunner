import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICoreCodeEditor } from "v1/core.integration/core-code-editor/CoreCodeEditor/CoreCodeEditor";
import CoreStackBlitz from "v1/core.integration/core.stackblitz/CoreStackBlitz/CoreStackBlitz";
import CoreCodeEditor from "v1/core.integration/core-code-editor/CoreCodeEditor/CoreCodeEditor";
import { CORE_CODE_EDITOR } from "v1/appReduxStore/reduxSliceNames/reduxSliceNames";

interface CoreCodeEditorState {
	instance: ICoreCodeEditor;
}

const initialState: CoreCodeEditorState = {
	instance: new CoreCodeEditor(new CoreStackBlitz()),
};

const coreCodeEditorSlice = createSlice({
	name: CORE_CODE_EDITOR,
	initialState: initialState,
	reducers: {
		setInstance: (
			state,
			action: PayloadAction<{
				_instance: ICoreCodeEditor;
			}>
		) => {
			return {
				...state,
				instance: action.payload._instance,
			};
		},
	},
});

export const { setInstance } = coreCodeEditorSlice.actions;
const coreCodeEditorReducer = coreCodeEditorSlice.reducer;
export default coreCodeEditorReducer;
