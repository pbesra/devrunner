import Box from "@mui/material/Box";
import { WrapperBoxProps } from "v1/wrapper-props/WrapperProps";

const SquaredBoxWrapper: React.FC<WrapperBoxProps> = (props) => {
	return (
		<Box className="box-border-style" component="div" sx={{ ...props.sx }}>
			{props.TopComponent && <Box>{props.TopComponent}</Box>}
			<Box sx={{ display: "flex" }}>
				{props.LeftComponent && <Box>{props.LeftComponent}</Box>}
				<Box>{props.children}</Box>
				{props.RightComponent && <Box>{props.RightComponent}</Box>}
			</Box>
			{props.BottomComponent && <Box>{props.BottomComponent}</Box>}
		</Box>
	);
};

export default SquaredBoxWrapper;
