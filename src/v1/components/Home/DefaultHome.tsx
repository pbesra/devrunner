import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const DefaultHome = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
				textAlign: "center",
				padding: 4,
				boxSizing: "border-box",
			}}
		>
			{/* Main Heading */}
			<Typography
				variant="h4"
				sx={{
					fontWeight: "bold",
					letterSpacing: "1px",
					marginBottom: 2,
					color: "#333",
					textTransform: "uppercase",
					opacity: 0,
					animation: "fadeIn 1s ease-out forwards",
					animationDelay: "0.5s",
				}}
			>
				🚀 Welcome to DevRunner – The Ultimate Toolbox!
			</Typography>

			{/* Description */}
			<Typography
				variant="body1"
				sx={{
					maxWidth: "750px",
					fontSize: "1.1rem",
					lineHeight: 1.7,
					fontWeight: "400",
					color: "#555",
					opacity: 0,
					padding: 2,
					animation: "fadeIn 2s ease-out forwards",
					animationDelay: "1s",
				}}
			>
				DevRunner is your go-to hub for powerful developer utilities,
				built to streamline your workflow and boost productivity.
				Whether you're transforming XML to JSON, running XSLT
				transformations, comparing text, or handling data
				conversions—DevRunner has you covered.
			</Typography>

			{/* Footer */}
			<Box
				sx={{
					position: "absolute",
					bottom: "10px",
					width: "100%",
					textAlign: "center",
					fontSize: "0.9rem",
					color: "#666",
				}}
			>
				&copy; {new Date().getFullYear()} DevRunner. All rights
				reserved.
			</Box>
		</Box>
	);
};

export default DefaultHome;
