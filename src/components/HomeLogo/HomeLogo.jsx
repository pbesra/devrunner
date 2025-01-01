import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router";

const HomeLogo = () => {
	const navigate = useNavigate();
	const onClickHomeLogo = () => {
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
