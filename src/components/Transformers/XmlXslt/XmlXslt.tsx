import Box from "@mui/material/Box";
import NextGenEditor from "components/NextGenEditor/NextGenEditor/NextGenEditor";
import TransformerWrapper from "../TransformerWrapper/TransformerWrapper";
const XmlXslt = () => {
	const components = [
		<NextGenEditor label="xml" name="mui" />,
		<NextGenEditor label="xsl" name="mui" />,
		<NextGenEditor label="result" name="mui" />,
	];
	return (
		<>
			<TransformerWrapper
				title="XSLT Transformation"
				components={components}
			/>
		</>
	);
};
export default XmlXslt;
