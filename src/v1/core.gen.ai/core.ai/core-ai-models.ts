import { getResponse as geminiGetResponse } from "../core.gemini.ai/core-gemini-ai";
import { GetAIQueryResponse } from "./core-ai";

export interface CoreAIModelProps {
	aiName: string;
	aiModel: string | null | undefined;
	label: string;
	getResponse: (props: GetAIQueryResponse) => void;
}
export const coreAIModels: CoreAIModelProps[] = [
	{
		aiName: "gemini",
		aiModel: null,
		label: "Gemini",
		getResponse: geminiGetResponse,
	},
	{
		aiName: "gemini",
		aiModel: "test",
		label: "Gemini",
		getResponse: geminiGetResponse,
	},
];
