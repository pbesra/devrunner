import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { WrapperCopyContentButton } from "v1/components/WrapperComponent/index";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import copyContent from "v1/utils/copyContent/copyContent";
import WrapperLinearProgress from "@wrapper/WrapperLinearProgress/WrapperLinearProgress";

interface BoxWrapperProps {
	children: React.ReactNode;
	leftNode?: React.ReactNode;
	rightNode?: React.ReactNode;
	value?: string;
	onClickShowResult?: () => void;
	isLoading?: boolean;
}

const BoxWrapper: React.FC<BoxWrapperProps> = (props) => {
	const onClickWrapperIconButton = () => {
		copyContent({ source: "text", content: props.value });
	};
	return (
		<Box
			sx={{
				border: "1px solid black",
				padding: 0.3,
				borderRadius: 1,
				borderColor: "#006101",
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "0.5rem",
				}}
			>
				<Box
					sx={{
						fontWeight: "bold",
						color: "#5d5d5d",
					}}
				>
					XSLT Result
				</Box>

				<Box
					sx={{
						display: "flex",
						gap: "0.5rem",
						alignItems: "center",
					}}
				>
					<WrapperCopyContentButton
						onClickWrapperIconButton={onClickWrapperIconButton}
						hasCopiedIcon={true}
					>
						<Tooltip placement="bottom" title="Copy content">
							<ContentCopyIcon sx={{ fontSize: "16px" }} />
						</Tooltip>
					</WrapperCopyContentButton>
					<Button
						sx={{
							color: "#3c3c3c",
							fontSize: 10,
							borderColor: "#3c3c3c",
						}}
						variant="outlined"
						size="small"
						onClick={props.onClickShowResult}
					>
						Show Result
					</Button>
				</Box>
			</Box>

			<Box>
				{props.isLoading ? (
					<WrapperLinearProgress width="59.5vw" />
				) : (
					props.children
				)}
			</Box>
		</Box>
	);
};

export default BoxWrapper;
