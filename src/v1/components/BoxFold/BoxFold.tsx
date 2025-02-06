import Box from "@mui/material/Box";
import React from "react";
import { WrapperBoxProps } from "v1/wrapper-props/WrapperProps";

const BoxFold: React.FC<WrapperBoxProps> = (props) => {
	return (
		<Box sx={{ ...props.sx }} component="div" className="box-border-style">
			{props.boxTitle}
		</Box>
	);
};

export default BoxFold;
