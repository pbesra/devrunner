import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { WrapperBoxProps } from "v1/wrapper-props/WrapperProps";

const WrapperLinearProgress: React.FC<WrapperBoxProps> = (props) => {
	return (
		<Box sx={{ ...props }}>
			<LinearProgress />
		</Box>
	);
};

export default WrapperLinearProgress;
