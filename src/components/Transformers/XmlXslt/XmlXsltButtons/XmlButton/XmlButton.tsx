import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { WrapperCopyContentButton } from "@wrapper/index";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import copyContent from "@utils/copyContent/copyContent";

interface XmlButtonProps {
	xmlContent?: string;
	onChangeXmlInstant?: (isChecked: boolean) => void;
	onClickExpand?: () => void;
}

const XmlButton = (props: XmlButtonProps) => {
	const onClickWrapperIconButton = () => {
		copyContent({ source: "text", content: props.xmlContent });
	};
	const _onChangeXmlInstant = (isChecked: boolean) => {
		props.onChangeXmlInstant?.(isChecked);
	};
	const _onClickExpand = () => {
		props.onClickExpand?.();
	};
	return (
		<Box>
			<Box>
				<WrapperCopyContentButton
					onClickWrapperIconButton={onClickWrapperIconButton}
					hasCopiedIcon={true}
				>
					<Tooltip placement="right" title="Copy content">
						<ContentCopyIcon sx={{ fontSize: "16px" }} />
					</Tooltip>
				</WrapperCopyContentButton>
			</Box>
			<Box>
				<Tooltip placement="right" title="Expand">
					<IconButton onClick={_onClickExpand}>
						<ZoomOutMapIcon sx={{ fontSize: "16px" }} />
					</IconButton>
				</Tooltip>
			</Box>
			<Box>
				<Tooltip placement="right" title="xslt instant">
					<Checkbox
						sx={{
							"& .MuiSvgIcon-root": {
								fontSize: 18,
								width: 18,
								height: 18,
							},
						}}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							_onChangeXmlInstant(e.target.checked)
						}
					/>
				</Tooltip>
			</Box>
		</Box>
	);
};
export default XmlButton;
