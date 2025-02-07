import stackBlitz, { ProjectTemplate } from "@stackblitz/sdk";

class CoreStackBlitz {
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
	handleOpenInStackBlitz(
		content: string,
		fileExtention = "txt",
		contentName = "your_content"
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
