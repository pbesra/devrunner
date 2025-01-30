import { coreAIModels } from "./core-ai-models";
import { CoreAIModelProps } from "./core-ai-models";
export interface GetAIResponseProps {
	aiName?: string;
	aiModel?: string;
}
export interface GetAIQueryResponse {
	query?: string;
	aiModel?: string;
}
class CoreAI {
	aiName?: string;
	aiModel?: string;
	aiInstance?: CoreAIModelProps;

	constructor(_aiName?: string, _aiModel?: string) {
		this.aiName = _aiName;
		this.aiModel = _aiModel;
		this.aiInstance = this._getAiInstance();
	}
	private _getAiInstance() {
		const aiInstances = coreAIModels.filter(
			(x) => x.aiName === this.aiName
		);
		if (this.aiModel) {
			return aiInstances.find((x) => x.aiModel === this.aiModel);
		}
		return aiInstances.find((x) => !x.aiModel);
	}
	async getResponse(query: string) {
		return this.aiInstance?.getResponse({
			query: query,
			aiModel: this.aiModel,
		});
	}
}
