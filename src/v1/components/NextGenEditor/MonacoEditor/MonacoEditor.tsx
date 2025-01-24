import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import Box from "@mui/material/Box";
import { nanoid } from "nanoid";
import { useState, useRef } from "react";
import * as monaco from "monaco-editor";
import { NextGenEditorProps } from "../NextGenEditor/NextGenEditor";

const MonacoEditor = ({
	label = "// Comment here",
	language = "javascript",
	height = "75vh",
	readonly = false,
	handleOnChangeInputText,
	value = "",
	identifier = nanoid(8),
	handleEditorDidMount,
	name,
	border,
}: NextGenEditorProps) => {
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
	const onChangeValue = (value: string | undefined, event: any) => {
		handleOnChangeInputText?.(editorRef?.current?.getValue() ?? "");
	};

	function onEditorDidMount(
		editor: monaco.editor.IStandaloneCodeEditor,
		monaco: any
	) {
		handleEditorDidMount?.(editor);
	}
	return (
		<Box sx={{ p: 2, border: border ?? "1px solid #e0e0e0", margin: 2 }}>
			<Editor
				height={height}
				defaultLanguage={language}
				onChange={onChangeValue}
				options={{
					readOnly: readonly, // Set the editor to read-only
					minimap: { enabled: false }, // Hide the minimap
					// parameterHints: { enabled: true }, // Disable parameter hints
					// suggestOnTriggerCharacters: true, // Disable suggestions on typing
					// wordBasedSuggestions: true, // Disable word-based suggestions
					// inlineHints: { enabled: true }, // Remove inline hints
				}}
				key={identifier}
				value={value}
				onMount={onEditorDidMount}
			/>
		</Box>
	);
};

export default MonacoEditor;
