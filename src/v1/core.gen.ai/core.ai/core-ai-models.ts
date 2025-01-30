import { getResponse as geminiGetResponse } from "../core.gemini.ai/core-gemini-ai";
import { GetAIQueryResponseProps } from "./CoreAI/CoreAI";

export interface CoreAIModelProps {
	aiName: string;
	aiModel: string | null | undefined;
	label: string;
	getResponse: (props: GetAIQueryResponseProps) => Promise<any>;
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

export const CoreAIModel = {
	aiName: "gemini",
	aiModel: "gemini-1.5-flash",
	provider: "google",
};
