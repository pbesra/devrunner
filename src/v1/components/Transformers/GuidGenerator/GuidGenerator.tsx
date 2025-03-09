import { v4 as uuidv4 } from "uuid";
import { Box } from "@mui/material";
import TopBoxComponent from "v1/components/SquaredBoxWrapper/TopBoxComponent/TopBoxComponent";
import SquaredBoxWrapper from "v1/components/SquaredBoxWrapper/SquaredBoxWrapper";

const GuidGenerator = () => {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "80vh",
				width: "99vw",
			}}
		>
			<Box>
				<Box sx={{ padding: 0.5 }}>Guid Generator</Box>
				<SquaredBoxWrapper
					sx={{
						width: "50vw",
						height: "75vh",
					}}
					TopComponent={<TopBoxComponent />}
				/>
			</Box>
		</Box>
	);
};

export default GuidGenerator;
