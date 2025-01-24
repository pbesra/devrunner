import React, { useState } from "react";
import { Button, Snackbar } from "@mui/material";

interface WrapperSnackbarProps {
	message: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	buttonRefCurrent?: any;
}

const WrapperSnackbar = (props: WrapperSnackbarProps) => {
	const handleClose = () => {
		props.setOpen(false);
	};

	// Calculate the position based on the button's ref
	const buttonPosition = props.buttonRefCurrent?.getBoundingClientRect();

	// Custom styling for Snackbar
	const customStyle: React.CSSProperties = buttonPosition
		? {
				position: "fixed",
				top: buttonPosition.bottom + 8, // Adjust below the button
				left: buttonPosition.left, // Align with the button's left
				transform: "translateX(0)",
		  }
		: {};

	return (
		<div>
			<Snackbar
				open={props.open}
				autoHideDuration={20000}
				onClose={handleClose}
				message={props.message}
				// anchorOrigin={{
				// 	vertical: "bottom",
				// 	horizontal: "left", // position it to the left of the button
				// }}

				ContentProps={{
					style: customStyle,
					sx: {
						width: "10px",
						backgroundColor: "green",
					},
				}}
			/>
		</div>
	);
};

export default WrapperSnackbar;
