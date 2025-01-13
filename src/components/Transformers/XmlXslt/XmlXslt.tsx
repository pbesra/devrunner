import Box from "@mui/material/Box";
import NextGenEditor from "components/NextGenEditor/NextGenEditor/NextGenEditor";
import TransformerWrapper from "../TransformerWrapper/TransformerWrapper";
import { useMUIXSLTTransformation } from "@hooks/index"; // Import the hook
import { useState } from "react";

const XmlXslt = () => {
	const { result, xmlText, xslText, onChangeXmlValue, onChangeXslValue } =
		useMUIXSLTTransformation(); // Destructure values from the hook

	return (
		<TransformerWrapper
			title="XSLT Transformation"
			components={[
				<NextGenEditor
					handleOnChangeInputText={onChangeXmlValue}
					label="xml"
					name="mui"
					value={xmlText}
				/>,
				<NextGenEditor
					handleOnChangeInputText={onChangeXslValue}
					label="xsl"
					name="mui"
					value={xslText}
				/>,
				<NextGenEditor
					readonly={true}
					label="result"
					name="mui"
					value={result}
				/>,
			]}
		/>
	);
};

export default XmlXslt;
