import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router";

const NotFound = () => {
	const navigate = useNavigate();
	document.title = "404 - Page not found";
	return (
		<Container
			maxWidth="md"
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "80vh",
				textAlign: "center",
			}}
		>
			<Box
				component="div"
				sx={{
					width: "100%",
					maxWidth: "350px",
					mb: 3,
				}}
			/>
			<img height={200} width={250} src="/404NotFound.jpg" alt="404" />

			<Typography variant="body1" color="textSecondary" mb={3}>
				The page you're looking for doesn't exist or has been moved.
			</Typography>

			<Button
				variant="contained"
				color="primary"
				size="small"
				onClick={() => navigate("/")}
				sx={{ textTransform: "none" }}
			>
				Go Home
			</Button>
		</Container>
	);
};

export default NotFound;
