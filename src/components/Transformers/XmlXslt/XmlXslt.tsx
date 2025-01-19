import Box from "@mui/material/Box";
import NextGenEditor from "components/NextGenEditor/NextGenEditor/NextGenEditor";
import TransformerVWrapper from "../TransformerWrapper/TransformerVWrapper";
import { useMUIXSLTTransformation } from "@hooks/index"; // Import the hook
import { useState } from "react";
import XmlButton from "./XmlXsltButtons/XmlButton/XmlButton";
import XslButton from "./XmlXsltButtons/XslButton/XslButton";

const XmlXslt = () => {
	const { result, xmlText, xslText, onChangeXmlValue, onChangeXslValue } =
		useMUIXSLTTransformation();

	return (
		<TransformerVWrapper
			title="XSLT Transformation"
			components={[
				{
					component: (
						<NextGenEditor
							handleOnChangeInputText={onChangeXmlValue}
							label="xml"
							name="mui"
							value={xmlText}
						/>
					),
					utilNode: <XmlButton />,
				},
				{
					component: (
						<NextGenEditor
							handleOnChangeInputText={onChangeXslValue}
							label="xsl"
							name="mui"
							value={xslText}
						/>
					),
					utilNode: <XslButton />,
				},
				{
					component: (
						<NextGenEditor
							readonly={true}
							label="result"
							name="mui"
							value={result}
						/>
					),
				},
			]}
		/>
	);
};

export default XmlXslt;
