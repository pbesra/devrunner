import { useEffect, useState } from "react";
import parseXML from "@utils/parseXML/parseXML";

const useMUIXSLTTransformation = () => {
	const [xmlText, setXmlText] = useState("");
	const [xslText, setXslText] = useState("");
	const [result, setResult] = useState("");

	const xsltTransform = (xmlText: string, xslText: string): string | null => {
		const xml = parseXML(xmlText, "xml");
		const xsl = parseXML(xslText, "xsl");

		if (xml.hasError || xsl.hasError) {
			setResult(xml.errorMessage || xsl.errorMessage);
		}

		try {
			let resultDocument: DocumentFragment;
			const xsltProcessor = new XSLTProcessor();
			if (xml.xmlDoc) {
				xsl.xmlDoc && xsltProcessor.importStylesheet(xsl.xmlDoc);
				resultDocument = xsltProcessor.transformToFragment(
					xml.xmlDoc,
					document
				);
				return new XMLSerializer().serializeToString(resultDocument);
			}
		} catch (error) {
			console.error("XSLT Transformation Error:", error);
		}
		return null;
	};

	const onChangeXmlValue = (xmlChangedValue: string) => {
		setXmlText(xmlChangedValue);
	};
	const onChangeXslValue = (xslChangedValue: string) => {
		setXslText(xslChangedValue);
	};

	useEffect(() => {
		const xmlNodeMessageMapper = [
			{
				test: !xslText && !xmlText,
				message: "Waiting for xml & xsl content...",
				priority: 1,
			},
			{
				test: !xslText,
				message: "Waiting for xsl content...",
				priority: 2,
			},
			{
				test: !xmlText,
				message: "Waiting for xml content...",
				priority: 2,
			},
		];
		for (const nodeMsg of xmlNodeMessageMapper) {
			if (nodeMsg.test) {
				setResult(nodeMsg.message);
				break;
			}
		}
		const transformedResult = xsltTransform(xmlText, xslText);
		if (transformedResult !== null) {
			setResult(transformedResult);
		}
	}, [xmlText, xslText]);

	return { result, xmlText, xslText, onChangeXmlValue, onChangeXslValue };
};

export default useMUIXSLTTransformation;
