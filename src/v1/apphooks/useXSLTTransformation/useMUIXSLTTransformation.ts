import { useEffect, useReducer } from "react";
import parseXML from "v1/utils/parseXML/parseXML";
import { XmlInstantReducerProps } from "v1/components/Transformers/XmlXslt/xml-interfaces";
import XML_INSTANT from "@utils/constants/XmlInstants/XmlInstants";
import XML_NODE_MESSAGE from "@utils/constants/xml-xslt-messages/xml-node/XmlNodeMessage";

import { useSelector } from "react-redux";
import { RootState } from "v1/appReduxStore/rootStore/rootStore";
import { ActionProps } from "v1/common-interfaces/common-interfaces";

const ContentRefOptions = {
	XML: "XML",
	XSL: "XSL",
};

interface UseMUIXSLTTransformationProps {
	xmlInstant?: XmlInstantReducerProps;
	setXmlInstant?: React.Dispatch<ActionProps>;
}

const XmlTransformerStateConst = {
	XML: "XML",
	XSL: "XSL",
	RESULT: "RESULT",
	CONTENT_REF: "CONTENT_REF",
};

interface XmlTransformerState {
	xmlState: {
		text: string;
		isValid: boolean;
	};
	xslState: {
		text: string;
		isValid: boolean;
	};
	resultState: {
		text: string;
		isValid: boolean;
		isLoading?: boolean;
		isAIResponse?: boolean;
	};
	contentRef: {
		name: string;
	};
}
const xmlTransformerInitialState: XmlTransformerState = {
	xmlState: {
		text: "",
		isValid: false,
	},
	xslState: {
		text: "",
		isValid: false,
	},
	resultState: {
		text: "",
		isValid: false,
		isLoading: false,
		isAIResponse: false,
	},
	contentRef: {
		name: "",
	},
};
interface XmlTransformerAction {
	key: string;
	value: any;
}
const transformerReducer = (
	state: XmlTransformerState,
	action: XmlTransformerAction
) => {
	if (action.key === XmlTransformerStateConst.XML) {
		return { ...state, xmlState: { text: action.value, isValid: true } };
	} else if (action.key === XmlTransformerStateConst.XSL) {
		return { ...state, xslState: { text: action.value, isValid: true } };
	} else if (action.key === XmlTransformerStateConst.RESULT) {
		return {
			...state,
			resultState: {
				text: action.value.message,
				isValid: action.value.isValid,
				isLoading: action.value.isLoading,
				isAIResponse: action.value.isAIResponse,
			},
		};
	} else if (action.key === XmlTransformerStateConst.CONTENT_REF) {
		return { ...state, contentRef: { name: action.value.name } };
	}
	return { ...state };
};

const useMUIXSLTTransformation = (props: UseMUIXSLTTransformationProps) => {
	const coreAI = useSelector((state: RootState) => state.coreAI);

	const [transformerState, transfomerDispatcher] = useReducer(
		transformerReducer,
		xmlTransformerInitialState
	);
	const setDefaultFallbackResultResponse = (_xml: any, _xsl: any) => {
		transfomerDispatcher({
			key: XmlTransformerStateConst.RESULT,
			value: {
				message: _xml.errorMessage || _xsl.errorMessage,
				isValid: false,
				isLoading: false,
				isAIResponse: false,
			},
		});
	};
	const xsltTransform = (xmlText: string, xslText: string): string | null => {
		const xml = parseXML(xmlText, "xml");
		const xsl = parseXML(xslText, "xsl");

		if (xml.hasError || xsl.hasError) {
			const errorRef = xml.hasError
				? { name: "xml", value: xmlText }
				: { name: "xsl", value: xslText };
			transfomerDispatcher({
				key: XmlTransformerStateConst.RESULT,
				value: {
					message: "Result loading...",
					isValid: false,
					isLoading: true,
					isAIResponse: false,
				},
			});
			if (!coreAI.isCoreAIOn) {
				setDefaultFallbackResultResponse(xml, xsl);
			}

			coreAI.coreAI
				?.getResponse(
					`What's the issue in this xml/xslt? Here is the xml/xslt: ${errorRef.value}. Don't give me the code. Give the exact reason why the xml/xslt is invalid.`
				)
				.then((aix) => {
					transfomerDispatcher({
						key: XmlTransformerStateConst.RESULT,
						value: {
							message: `${errorRef.name} has error. More details - ${aix}`,
							isValid: false,
							isLoading: false,
							isAIResponse: true,
						},
					});
				})
				.catch((aix) => {
					setDefaultFallbackResultResponse(xml, xsl);
				});
			return null;
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
		transfomerDispatcher({
			key: XmlTransformerStateConst.XML,
			value: xmlChangedValue,
		});
		transfomerDispatcher({
			key: XmlTransformerStateConst.CONTENT_REF,
			value: { name: XmlTransformerStateConst.XML },
		});
	};
	const onChangeXslValue = (xslChangedValue: string) => {
		transfomerDispatcher({
			key: XmlTransformerStateConst.XSL,
			value: xslChangedValue,
		});
		transfomerDispatcher({
			key: XmlTransformerStateConst.CONTENT_REF,
			value: { name: XmlTransformerStateConst.XSL },
		});
	};

	const processXSLTOnChange = () => {
		const xmlNodeMessageMapper = [
			{
				test:
					!transformerState.xslState.text &&
					!transformerState.xmlState.text,
				message: XML_NODE_MESSAGE.XSTL_RESULT_DEFAULT,
			},
			{
				test: !transformerState.xslState.text,
				message: "Waiting for xsl content...",
				priority: 2,
			},
			{
				test: !transformerState.xmlState.text,
				message: "Waiting for xml content...",
				priority: 2,
			},
		];
		for (const nodeMsg of xmlNodeMessageMapper) {
			if (nodeMsg.test) {
				transfomerDispatcher({
					key: XmlTransformerStateConst.RESULT,
					value: { message: nodeMsg.message, isValid: false },
				});
				return;
			}
		}
		const transformedResult = xsltTransform(
			transformerState.xmlState.text,
			transformerState.xslState.text
		);
		if (props.xmlInstant?.CALCULATE_XSLT) {
			transfomerDispatcher({
				key: XmlTransformerStateConst.RESULT,
				value: { message: transformedResult || "", isValid: true },
			});
		} else if (
			transformedResult !== null &&
			props.xmlInstant?.XML &&
			ContentRefOptions.XML === transformerState.contentRef.name
		) {
			transfomerDispatcher({
				key: XmlTransformerStateConst.RESULT,
				value: { message: transformedResult, isValid: true },
			});
		} else if (
			transformedResult !== null &&
			props.xmlInstant?.XSL &&
			ContentRefOptions.XSL === transformerState.contentRef.name
		) {
			transfomerDispatcher({
				key: XmlTransformerStateConst.RESULT,
				value: { message: transformedResult, isValid: true },
			});
		}
	};
	const flipCalculateXslt = () => {
		props.setXmlInstant?.({
			key: XML_INSTANT.CALCULATE_XSLT,
			value: false,
		});
	};
	useEffect(() => {
		if (props.xmlInstant?.XSL) {
			processXSLTOnChange();
		}
		flipCalculateXslt();
	}, [transformerState.xslState.text]);

	useEffect(() => {
		if (props.xmlInstant?.XML) {
			processXSLTOnChange();
		}
		flipCalculateXslt();
	}, [transformerState.xmlState.text]);

	useEffect(() => {
		processXSLTOnChange();
		flipCalculateXslt();
	}, [
		props.xmlInstant?.XML,
		props.xmlInstant?.XSL,
		props.xmlInstant?.CALCULATE_XSLT,
	]);

	return {
		transformerState,
		onChangeXmlValue,
		onChangeXslValue,
	};
};

export default useMUIXSLTTransformation;
