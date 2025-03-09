import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { LiaWindowMinimize } from "react-icons/lia";
import { VscClearAll } from "react-icons/vsc";
interface TopBoxComponentProps {
	title?: string;
	onClickMinimize?: (_isMinimise: boolean) => void;
	onClickClear?: () => void;
}
const TopBoxComponent = (props: TopBoxComponentProps) => {
	const onClockLiaWindowMinimize = () => {
		if (props.onClickMinimize) {
			props.onClickMinimize(true);
		}
	};
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "0.5rem",
			}}
		>
			{props.title && (
				<Box
					sx={{
						fontWeight: "bold",
						color: "#5d5d5d",
					}}
				>
					{props.title}
				</Box>
			)}

			<Box
				sx={{
					display: "flex",
					gap: "0.5rem",
					alignItems: "center",
				}}
			>
				{props.onClickClear && (
					<Tooltip placement="top" title="Clear all content">
						<span>
							<VscClearAll
								style={{
									width: "18px",
									height: "18px",
									cursor: "pointer",
									color: "#676767",
								}}
								onClick={props.onClickClear}
							/>
						</span>
					</Tooltip>
				)}

				{props.onClickMinimize && (
					<Tooltip placement="top" title="Minimize">
						<span>
							<LiaWindowMinimize
								style={{
									width: "18px",
									height: "18px",
									cursor: "pointer",
									color: "#676767",
								}}
								onClick={onClockLiaWindowMinimize}
							/>
						</span>
					</Tooltip>
				)}
			</Box>
		</Box>
	);
};

export default TopBoxComponent;
