import MonacoEditor from "../MonacoEditor/MonacoEditor";
import MuiTextEditor from "../MuiTextEditor/MuiTextEditor";
import { NextGenEditorProps } from "../NextGenEditor/NextGenEditor";
import CoreAceEditor from "../CoreAceEditor/CoreAceEditor";

interface EditorMapperProps {
	[key: string]: React.ComponentType<NextGenEditorProps>;
}

export const EditorMapper: EditorMapperProps = {
	monaco: MonacoEditor,
	mui: MuiTextEditor,
	ace: CoreAceEditor,
};
