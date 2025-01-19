import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { WrapperIconButton } from "@wrapper/index";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";

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
			<Box>
				<Checkbox
					sx={{
						"& .MuiSvgIcon-root": {
							fontSize: 18,
							width: 18,
							height: 18,
						},
					}}
				/>
			</Box>
		</Box>
	);
};
export default XmlButton;
