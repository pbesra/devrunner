import IconButton from "@mui/material/IconButton";
import CopiedContentIcon from "@wrapper/WrapperIconButton/CopiedContentIcon";
import TimedComponent from "components/TimedComponent/TimedComponent";
import { useState } from "react";
import WrapperIconButton from "@wrapper/WrapperIconButton/WrapperIconButton";

interface WrapperCopyContentButtonProps {}

const WrapperCopyContentButton: React.FC<
	WrapperCopyContentButtonProps
> = () => {
	const [isCopied, setIsCopied] = useState(false);
	const onTimeout = () => {
		setIsCopied(false);
	};
	const onClickIconButton = () => {
		setIsCopied(true);
	};
	return (
		<>
			<WrapperIconButton>
				{isCopied ? (
					<TimedComponent onTimeout={onTimeout} duration={1}>
						<CopiedContentIcon />
					</TimedComponent>
				) : (
					<IconButton onClick={onClickIconButton} />
				)}
			</WrapperIconButton>
		</>
	);
};
export default WrapperCopyContentButton;
