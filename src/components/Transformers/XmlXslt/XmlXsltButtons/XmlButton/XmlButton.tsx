import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { WrapperIconButton } from "@wrapper/index";
import Tooltip from "@mui/material/Tooltip";

const XmlButton = () => {
	return (
		<Box>
			<Box>
				<WrapperIconButton hasSnackbar={true}>
					<Tooltip title="Copy content">
						<ContentCopyIcon sx={{ fontSize: "16px" }} />
					</Tooltip>
				</WrapperIconButton>
			</Box>
			<Box>
				<IconButton>
					<ZoomOutMapIcon sx={{ fontSize: "16px" }} />
				</IconButton>
			</Box>
		</Box>
	);
};
export default XmlButton;
