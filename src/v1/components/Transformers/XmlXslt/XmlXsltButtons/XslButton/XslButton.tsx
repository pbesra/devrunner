import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import { WrapperCopyContentButton } from "v1/components/WrapperComponent/index";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LaunchIcon from "@mui/icons-material/Launch";
import XML_INSTANT from "@utils/constants/XmlInstants/XmlInstants";

interface XslButtonProps {
	xslContent?: string;
	onChangeXslInstant?: (isChecked: boolean) => void;
	onClickExpand?: () => void;
	defaultChecked?: boolean;
	checked?: boolean;
	onClickDownload?: (indentifier: string, textContent?: string) => void;
	onClickOpenInStackBlitz?: (identifier: string) => void;
	onClickUpload?: (
		id: string,
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
}

const XslButton = (props: XslButtonProps) => {
	const _onChangeXmlInstant = (isChecked: boolean) => {
		props.onChangeXslInstant?.(isChecked);
	};
	return (
		<Box>
			<Box>
				<Tooltip placement="right" title="Open in stackblitz">
					<IconButton
						onClick={() =>
							props.onClickOpenInStackBlitz?.(XML_INSTANT.XSL)
						}
					>
						<LaunchIcon sx={{ fontSize: "16px" }} />
					</IconButton>
				</Tooltip>
			</Box>
			<Box>
				<WrapperCopyContentButton hasCopiedIcon={true}>
					<Tooltip placement="right" title="Copy content">
						<ContentCopyIcon sx={{ fontSize: "16px" }} />
					</Tooltip>
				</WrapperCopyContentButton>
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
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							_onChangeXmlInstant(e.target.checked)
						}
						checked={props.checked}
					/>
				</Tooltip>
			</Box>
			<Box>
				<Tooltip placement="right" title="Download">
					<IconButton
						onClick={() => props.onClickDownload?.(XML_INSTANT.XSL)}
					>
						<FileDownloadIcon sx={{ fontSize: "18px" }} />
					</IconButton>
				</Tooltip>
			</Box>
			<Box>
				<Tooltip placement="right" title="Download">
					<span>
						<input
							type="file"
							accept=".xml"
							style={{ display: "none" }}
							id={`file-upload-${XML_INSTANT.XSL}`}
							onChange={(
								e: React.ChangeEvent<HTMLInputElement>
							) => props.onClickUpload?.(XML_INSTANT.XSL, e)}
						/>
						<label htmlFor={`file-upload-${XML_INSTANT.XSL}`}>
							<IconButton component="span">
								<FileUploadIcon sx={{ fontSize: "18px" }} />
							</IconButton>
						</label>
					</span>
				</Tooltip>
			</Box>
		</Box>
	);
};
export default XslButton;
