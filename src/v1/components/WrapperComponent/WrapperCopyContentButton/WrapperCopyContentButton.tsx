import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import CopiedContentIcon from "v1/components/WrapperComponent/WrapperIconButton/CopiedContentIcon";
import TimedComponent from "v1/components/TimedComponent/TimedComponent";
import { useState } from "react";

interface WrapperCopyContentButtonProps extends IconButtonProps {
	hasCopiedIcon?: boolean;
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
			{isCopied && props.hasCopiedIcon ? (
				<TimedComponent onTimeout={onTimeout} duration={1}>
					<CopiedContentIcon />
				</TimedComponent>
			) : (
				<IconButton onClick={onClickIconButton}>
					{props.children}
				</IconButton>
			)}
		</>
	);
};
export default WrapperCopyContentButton;
