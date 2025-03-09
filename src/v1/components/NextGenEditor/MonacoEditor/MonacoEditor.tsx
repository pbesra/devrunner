import Box from "@mui/material/Box";
import { nanoid } from "nanoid";
import { useState, useRef } from "react";
import { NextGenEditorProps } from "../NextGenEditor/NextGenEditor";
import { Editor } from "@monaco-editor/react";

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
	width = "60vw",
}: NextGenEditorProps) => {
	const handleOnChange = (editorValue: string) => {
		if (handleOnChangeInputText) {
			handleOnChangeInputText(editorValue);
		}
	};

	return (
		<Editor
			height={height}
			language={language}
			width={width}
			value={value}
			theme="vs-dark"
			options={{
				minimap: { enabled: false },
				fontSize: 16,
				wordWrap: "on",
				readOnly: readonly,
			}}
			onChange={(value: any) => handleOnChange(value)}
		/>
	);
};

export default MonacoEditor;
