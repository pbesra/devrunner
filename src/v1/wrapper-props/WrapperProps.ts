import React, { ComponentProps } from "react";
import Box from "@mui/material/Box";
export type WrapperBoxProps = ComponentProps<typeof Box> & {
	TopComponent?: React.ReactNode;
	BottomComponent?: React.ReactNode;
	RightComponent?: React.ReactNode;
	LeftComponent?: React.ReactNode;
	boxLabel?: string;
	hasClassName?: boolean;
};
