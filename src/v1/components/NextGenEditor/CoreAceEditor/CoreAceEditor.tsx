import { NextGenEditorProps } from "../NextGenEditor/NextGenEditor";
import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const CoreAceEditor = (props: NextGenEditorProps) => {
	const onChange = (newValue: string) => {
		console.log("change", newValue);
	};
	return (
		<>
			<AceEditor
				mode="java"
				theme="github"
				onChange={onChange}
				name="UNIQUE_ID_OF_DIV"
				editorProps={{ $blockScrolling: true }}
			/>
		</>
	);
};
export default CoreAceEditor;
