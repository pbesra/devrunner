import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { WrapperCopyContentButton } from "v1/components/WrapperComponent/index";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import copyContent from "v1/utils/copyContent/copyContent";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LaunchIcon from "@mui/icons-material/Launch";

interface XmlButtonProps {
	xmlContent?: string;
	onChangeXmlInstant?: (isChecked: boolean) => void;
	onClickExpand?: () => void;
	defaultChecked?: boolean;
	checked?: boolean;
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
				<Tooltip placement="right" title="Open in stackblitz">
					<IconButton>
						<LaunchIcon sx={{ fontSize: "16px" }} />
					</IconButton>
				</Tooltip>
			</Box>
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
						checked={props.checked}
					/>
				</Tooltip>
			</Box>
			<Box>
				<Tooltip placement="right" title="Download">
					<IconButton>
						<FileDownloadIcon sx={{ fontSize: "18px" }} />
					</IconButton>
				</Tooltip>
			</Box>
			<Box>
				<Tooltip placement="right" title="Download">
					<IconButton>
						<FileUploadIcon sx={{ fontSize: "18px" }} />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
};
export default XmlButton;
