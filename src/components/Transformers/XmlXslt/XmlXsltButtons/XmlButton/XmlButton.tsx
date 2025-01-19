import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { WrapperIconButton } from "@wrapper/index";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import copyContent from "@utils/copyContent/copyContent";

interface XmlButtonProps {
	xmlContent?: string;
}

const XmlButton = (props: XmlButtonProps) => {
	const onClickWrapperIconButton = () => {
		copyContent({ source: "text", content: props.xmlContent });
	};
	return (
		<Box>
			<Box>
				<WrapperIconButton
					onClickWrapperIconButton={onClickWrapperIconButton}
					hasSnackbar={true}
				>
					<Tooltip placement="right" title="Copy content">
						<ContentCopyIcon sx={{ fontSize: "16px" }} />
					</Tooltip>
				</WrapperIconButton>
			</Box>
			<Box>
				<Tooltip placement="right" title="Expand">
					<IconButton>
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
					/>
				</Tooltip>
			</Box>
		</Box>
	);
};
export default XmlButton;
