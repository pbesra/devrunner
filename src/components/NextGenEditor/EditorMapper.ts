import MonacoEditor from "./MonacoEditor"
import { NextGenEditorProps } from "./NextGenEditor";

interface EditorMapperProps{
    [key: string]: React.ComponentType<NextGenEditorProps>;
}

export const EditorMapper: EditorMapperProps={
    monaco: MonacoEditor
}