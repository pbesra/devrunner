import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CopiedContentIcon from "@wrapper/WrapperIconButton/CopiedContentIcon";
import TimedComponent from "components/TimedComponent/TimedComponent";
import { useState } from "react";

interface WrapperCopyContentButtonProps extends IconButtonProps {
	hasSnackbar?: boolean;
	onClickWrapperIconButton?: () => void;
}

const WrapperCopyContentButton: React.FC<WrapperCopyContentButtonProps> = (
	props
) => {
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
export default WrapperCopyContentButton;
