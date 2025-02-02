import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import CoreAI from "v1/core.gen.ai/core.ai/CoreAI/CoreAI";
import {
	SET_CORE_AI,
	SET_CORE_AI_ON,
} from "../coreAIActionType/CoreAIActionType";
import { CORE_AI } from "v1/appReduxStore/reduxSliceNames/reduxSliceNames";

const DEFAULT_CORE_AI_ON = process.env.REACT_APP_DEFAULT_CORE_AI_ON === "true";

// Define the user state
interface CoreAIState {
	coreAI: CoreAI | null;
	setCoreAI: string;
	isCoreAIOn?: boolean;
	setCoreAIOn?: string;
}

const initialState: CoreAIState = {
	coreAI: DEFAULT_CORE_AI_ON ? new CoreAI() : null,
	setCoreAI: SET_CORE_AI,
	isCoreAIOn: DEFAULT_CORE_AI_ON,
	setCoreAIOn: SET_CORE_AI_ON,
};

const coreAISlice = createSlice({
	name: CORE_AI,
	initialState,
	reducers: {
		setCoreAIInstance: (
			state,
			action: PayloadAction<{
				coreAI: CoreAI;
				isCoreAIOn: true;
			}>
		) => {
			return {
				...state,
				coreAI: action.payload.coreAI,
			};
		},
		setCoreAIOn: (
			state,
			action: PayloadAction<{
				isCoreAIOn: boolean;
			}>
		) => {
			return {
				...state,
				coreAI: !action.payload.isCoreAIOn ? null : new CoreAI(),
				isCoreAIOn: action.payload.isCoreAIOn,
			};
		},
	},
});

export const { setCoreAIInstance, setCoreAIOn } = coreAISlice.actions;
const coreAIReducer = coreAISlice.reducer;
export default coreAIReducer;
