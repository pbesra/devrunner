import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

interface HomeLogoProps {
	onClickHome: () => void;
}
const HomeLogo = ({ onClickHome }: HomeLogoProps) => {
	const navigate = useNavigate();
	const onClickHomeLogo = () => {
		onClickHome();
		navigate("/");
	};
	return (
		<Typography
			variant="h6"
			noWrap
			component="span"
			sx={{
				display: {
					xs: "none",
					sm: "inline-block",
					fontWeight: "bold",
					margin: 12,
				},
				cursor: "pointer",
			}}
			className="home-icon"
			onClick={onClickHomeLogo}
		>
			Devrunner
		</Typography>
	);
};
export default HomeLogo;
