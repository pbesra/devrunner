import { useEffect, useState, useReducer } from "react";
import parseXML from "v1/utils/parseXML/parseXML";
import {
	xmlInstantReducerProps,
	actionProps,
} from "v1/components/Transformers/XmlXslt/XmlXslt";
import XML_INSTANT from "@utils/constants/XmlInstants/XmlInstants";

const transformerReducer = (state: any, action: any) => {
	return { ...state };
};

const ContentRefOptions = {
	xml: "xml",
	xsl: "xsl",
};

interface useMUIXSLTTransformationProps {
	xmlInstant?: xmlInstantReducerProps;
	setXmlInstant?: React.Dispatch<actionProps>;
}

const useMUIXSLTTransformation = (props: useMUIXSLTTransformationProps) => {
	const [xmlText, setXmlText] = useState("");
	const [xslText, setXslText] = useState("");
	const [result, setResult] = useState("");
	const [contentRef, setContentRef] = useState<string | undefined | null>();

	const [transformerState, transfomerDispatcher] = useReducer(
		transformerReducer,
		{}
	);
	console.log("props", props);
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
		setContentRef("xml");
	};
	const onChangeXslValue = (xslChangedValue: string) => {
		setXslText(xslChangedValue);
		setContentRef("xsl");
	};

	const processXSLTOnChange = () => {
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
		if (
			transformedResult !== null &&
			props.xmlInstant?.XML &&
			ContentRefOptions.xml === contentRef
		) {
			setResult(transformedResult);
		} else if (
			transformedResult !== null &&
			props.xmlInstant?.XSL &&
			ContentRefOptions.xsl === contentRef
		) {
			setResult(transformedResult);
		} else if (
			transformedResult !== null &&
			props.xmlInstant?.CALCULATE_XSLT
		) {
			setResult(transformedResult);
		}
		props.setXmlInstant?.({
			key: XML_INSTANT.CALCULATE_XSLT,
			value: false,
		});
	};
	useEffect(() => {
		if (props.xmlInstant?.XML || props.xmlInstant?.XSL) {
			processXSLTOnChange();
		}
	}, [xmlText, xslText]);
	useEffect(() => {
		processXSLTOnChange();
	}, [
		props.xmlInstant?.XML,
		props.xmlInstant?.XSL,
		props.xmlInstant?.CALCULATE_XSLT,
	]);

	return { result, xmlText, xslText, onChangeXmlValue, onChangeXslValue };
};

export default useMUIXSLTTransformation;
