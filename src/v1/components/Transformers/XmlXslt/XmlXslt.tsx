import NextGenEditor from "v1/components/NextGenEditor/NextGenEditor/NextGenEditor";
import TransformerVWrapper from "../TransformerWrapper/TransformerVWrapper";
import { useMUIXSLTTransformation } from "v1/apphooks/index"; // Import the hook
import React, { useReducer, useCallback } from "react";
import XmlButton from "./XmlXsltButtons/XmlButton/XmlButton";
import XslButton from "./XmlXsltButtons/XslButton/XslButton";
import BoxWrapper from "v1/components/BoxWrapper/BoxWrapper";
import XML_INSTANT from "@utils/constants/XmlInstants/XmlInstants";

export interface xmlInstantReducerProps {
	XML: boolean;
	XSL: boolean;
	CALCULATE_XSLT: boolean;
}
export interface actionProps {
	key: string;
	value: boolean;
}
const xmlInstantReducer = (
	state: xmlInstantReducerProps,
	action: actionProps
) => {
	if (action.key === XML_INSTANT.XML) {
		return {
			...state,
			XML: action.value,
		};
	} else if (action.key === XML_INSTANT.XSL) {
		return {
			...state,
			XSL: action.value,
		};
	} else if (action.key === XML_INSTANT.CALCULATE_XSLT) {
		return {
			...state,
			CALCULATE_XSLT: action.value,
		};
	}
	return { ...state };
};

const XmlXslt = () => {
	const [xmlInstantState, xmlInstantDispatch] = useReducer(
		xmlInstantReducer,
		{ XML: true, XSL: true, CALCULATE_XSLT: false }
	);
	const { result, xmlText, xslText, onChangeXmlValue, onChangeXslValue } =
		useMUIXSLTTransformation({
			xmlInstant: xmlInstantState,
			setXmlInstant: xmlInstantDispatch,
		});

	const resultHeight = useCallback(() => {
		if (xmlText.length > 0 && xslText.length > 0 && result.length > 0) {
			return 18;
		}
		return 4;
	}, [xmlText, xslText, result]);
	const onClickShowResult = () => {
		xmlInstantDispatch({
			key: XML_INSTANT.CALCULATE_XSLT,
			value: true,
		});
	};
	const onChangeXmlInstant = (isChecked: boolean) => {
		xmlInstantDispatch({ key: XML_INSTANT.XML, value: isChecked });
	};
	const onChangeXslInstant = (isChecked: boolean) => {
		xmlInstantDispatch({ key: XML_INSTANT.XSL, value: isChecked });
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
					utilNode: (
						<XmlButton
							onChangeXmlInstant={onChangeXmlInstant}
							xmlContent={xmlText}
							defaultChecked={true}
							checked={xmlInstantState.XML}
						/>
					),
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
					utilNode: (
						<XslButton
							defaultChecked={true}
							onChangeXslInstant={onChangeXslInstant}
							checked={xmlInstantState.XSL}
						/>
					),
				},
				{
					component: (
						<BoxWrapper
							onClickShowResult={onClickShowResult}
							value={result}
						>
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
