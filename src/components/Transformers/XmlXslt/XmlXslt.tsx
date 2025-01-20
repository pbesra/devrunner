import Box from "@mui/material/Box";
import NextGenEditor from "components/NextGenEditor/NextGenEditor/NextGenEditor";
import TransformerVWrapper from "../TransformerWrapper/TransformerVWrapper";
import { useMUIXSLTTransformation } from "@hooks/index"; // Import the hook
import React, { Children, useState } from "react";
import XmlButton from "./XmlXsltButtons/XmlButton/XmlButton";
import XslButton from "./XmlXsltButtons/XslButton/XslButton";
import BoxWrapper from "components/BoxWrapper/BoxWrapper";

const XmlXslt = () => {
	const { result, xmlText, xslText, onChangeXmlValue, onChangeXslValue } =
		useMUIXSLTTransformation();

	const resultHeight = () => {
		if (xmlText.length > 0 && xslText.length > 0 && result.length > 0) {
			return 18;
		}
		return 4;
	};

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
					utilNode: <XmlButton xmlContent={xmlText} />,
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
						<BoxWrapper>
							<NextGenEditor
								readonly={true}
								name="mui"
								value={result}
								border="none"
								rows={resultHeight()}
								width="59.5vw"
							/>
						</BoxWrapper>
					),
				},
			]}
		/>
	);
};

export default XmlXslt;
