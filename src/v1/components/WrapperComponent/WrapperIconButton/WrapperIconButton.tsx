import React, { useRef, useState } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import WrapperSnackbar from "v1/components/WrapperComponent/WrapperSnackbar/WrapperSnackbar";
import CopiedContentIcon from "./CopiedContentIcon";
import TimedComponent from "v1/components/TimedComponent/TimedComponent";

interface CustomIconButtonProps extends IconButtonProps {
	hasSnackbar?: boolean;
	onClickWrapperIconButton?: () => void;
}

const WrapperIconButton: React.FC<CustomIconButtonProps> = (props) => {
	const [isCopied, setIsCopied] = useState(false);
	const onTimeout = () => {
		setIsCopied(false);
	};
	const onClickIconButton = () => {
		setIsCopied(true);
		props.onClickWrapperIconButton?.();
	};
	return (
		<>
			{isCopied && props.hasSnackbar ? (
				<TimedComponent onTimeout={onTimeout} duration={1}>
					<CopiedContentIcon />
				</TimedComponent>
			) : (
				<IconButton onClick={onClickIconButton} {...props} />
			)}
		</>
	);
};

export default WrapperIconButton;
