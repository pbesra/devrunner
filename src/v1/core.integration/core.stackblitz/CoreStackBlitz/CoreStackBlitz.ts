import stackBlitz, { ProjectTemplate } from "@stackblitz/sdk";
import { ICoreCodeEditor } from "v1/core.integration/core-code-editor/CoreCodeEditor/CoreCodeEditor";

class CoreStackBlitz implements ICoreCodeEditor {
	title: string;
	description: string;
	template: ProjectTemplate;
	constructor(
		_title: string = "Content viewer",
		_description: string = "Open XML file in StackBlitz",
		_template: ProjectTemplate = "javascript"
	) {
		this.title = _title;
		this.description = _description;
		this.template = _template;
	}
	handleOpenInCodeEditor(
		content: string,
		fileExtention: string = "txt",
		contentName: string = "my_content"
	): void {
		this.handleOpenInStackBlitz(content, fileExtention, contentName);
	}
	handleOpenInStackBlitz(
		content: string,
		fileExtention = "txt",
		contentName = "my_content"
	) {
		const xmlContent = content;

		stackBlitz.openProject({
			files: {
				[`${contentName}.${fileExtention}`]: xmlContent,
				"index.html": `Open "${contentName}.${fileExtention}" in StackBlitz`,
			},
			title: this.title,
			description: this.description,
			template: this.template,
		});
	}
}
export default CoreStackBlitz;
