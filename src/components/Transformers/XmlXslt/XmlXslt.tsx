import { Box } from "@mui/material";
import MonacoEditor from "components/NextGenEditor/MonacoEditor";
import NextGenEditor from "components/NextGenEditor/NextGenEditor";
const XmlXslt = () => {
	return (
		<>
			<Box>
				XSLT Transformation
				<Box>
					<NextGenEditor name="monaco" />
				</Box>
			</Box>
		</>
	);
};
export default XmlXslt;
