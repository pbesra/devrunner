import { CoreProjectTemplate } from "./CoreProjectTemplate";
import CoreStackBlitz from "v1/core.integration/core.stackblitz/CoreStackBlitz/CoreStackBlitz";
export interface ICoreCodeEditor {
	handleOpenInCodeEditor(
		content: string,
		fileExtention: string,
		contentName: string
	): void;
}
class CoreCodeEditor implements ICoreCodeEditor {
	instance: ICoreCodeEditor;
	constructor(_instance: ICoreCodeEditor) {
		this.instance = _instance;
	}
	handleOpenInCodeEditor(
		content: string,
		fileExtention: string = "txt",
		contentName: string = "my_content"
	): void {
		this.instance.handleOpenInCodeEditor(
			content,
			fileExtention,
			contentName
		);
	}
}
export default CoreCodeEditor;
