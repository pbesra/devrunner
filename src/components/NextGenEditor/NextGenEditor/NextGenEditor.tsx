import { EditorMapper } from "../EditorMapper/EditorMapper";
import * as monaco from "monaco-editor";

export interface NextGenEditorProps {
	label?: string;
	language?: string;
	height?: string;
	readonly?: boolean;
	handleOnChangeInputText?: (value: string) => void;
	value?: string | undefined;
	identifier?: string | number | undefined;
	handleEditorDidMount?: (
		editor: monaco.editor.IStandaloneCodeEditor
	) => void;
	name: string;
	border?: string;
	width?: number;
}

const NextGenEditor = (props: NextGenEditorProps) => {
	const AppEditor = EditorMapper[props.name];
	return <AppEditor {...props} />;
};
export default NextGenEditor;
