import TextField from "@mui/material/TextField";
import { NextGenEditorProps } from "../NextGenEditor/NextGenEditor";
const MuiTextEditor = (props: NextGenEditorProps) => {
	return (
		<TextField
			multiline
			sx={{
				width: "60vw",
				"& .MuiInputBase-root": {
					fontFamily:
						"'Fira Code', 'Consolas', 'Courier New', monospace", // Custom font family
					fontSize: "14px", // Custom font size
					color: "#454545",
				},
			}}
			rows={18}
			maxRows={36}
			label={props.label}
			defaultValue={`<?xml version="1.0"?>
<catalog>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are 
      integrated into a comprehensive development 
      environment.</description>
   </book>
</catalog>`}
		/>
	);
};
export default MuiTextEditor;
