import Box from "@mui/material/Box";
import React from "react";
import { WrapperBoxProps } from "v1/wrapper-props/WrapperProps";

const BoxFold: React.FC<WrapperBoxProps> = (props) => {
	return (
		<Box
			onClick={props.onClick}
			sx={{ ...props.sx, color: "#003178" }}
			component="div"
			className={!props.sx ? "box-border-style" : undefined}
		>
			{props.boxLabel}
		</Box>
	);
};

export default BoxFold;
