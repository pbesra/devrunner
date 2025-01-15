import TextField from "@mui/material/TextField";
import { NextGenEditorProps } from "../NextGenEditor/NextGenEditor";
import { useState, useEffect } from "react";

const MuiTextEditor = (props: NextGenEditorProps) => {
	const [textValue, setTextValue] = useState(props.value);

	useEffect(() => {
		setTextValue(props.value);
	}, [props.value]);

	const changeTextValue = (inputValue: string) => {
		setTextValue(inputValue); // Update local state
		if (props?.handleOnChangeInputText) {
			props?.handleOnChangeInputText(inputValue);
		}
	};

	return (
		<TextField
			multiline
			sx={{
				width: props.width ?? "60vw",
				"& .MuiInputBase-root": {
					fontFamily:
						"'Fira Code', 'Consolas', 'Courier New', monospace", // Custom font family
					fontSize: "14px", // Custom font size
					color: "#454545",
				},
			}}
			rows={18}
			label={props.label}
			value={textValue} // Reflect the current state in TextField
			onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
				changeTextValue(event.target.value)
			}
			slotProps={{
				input: {
					readOnly: props.readonly,
				},
			}}
		/>
	);
};

export default MuiTextEditor;
