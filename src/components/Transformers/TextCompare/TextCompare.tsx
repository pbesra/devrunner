import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import NextGenEditor from "components/NextGenEditor/NextGenEditor/NextGenEditor";

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
	...theme.applyStyles("dark", {
		backgroundColor: "#1A2027",
	}),
}));

const TextCompare = () => {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<Box>
				<span
					style={{
						fontFamily: "monospace",
						color: "#4e4e4e",
					}}
				>
					Text Compare
				</span>
			</Box>
			<Box sx={{ margin: 2 }}>
				<Grid container spacing={2}>
					<Grid size={6}>
						<NextGenEditor
							width={"100%"}
							name="mui"
							label="Left Text"
						/>
					</Grid>
					<Grid size={6}>
						<NextGenEditor
							width={"100%"}
							name="mui"
							label="Right Text"
						/>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
};

export default TextCompare;
