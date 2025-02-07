import NextGenEditor from "v1/components/NextGenEditor/NextGenEditor/NextGenEditor";
import TransformerVWrapper from "../TransformerWrapper/TransformerVWrapper";
import { useMUIXSLTTransformation } from "v1/apphooks/index"; // Import the hook
import React, { useReducer, useCallback, useState, useMemo } from "react";
import XmlButton from "./XmlXsltButtons/XmlButton/XmlButton";
import XslButton from "./XmlXsltButtons/XslButton/XslButton";
import BoxWrapper from "v1/components/BoxWrapper/BoxWrapper";
import XML_INSTANT from "@utils/constants/XmlInstants/XmlInstants";
import SquaredBoxWrapper from "v1/components/SquaredBoxWrapper/SquaredBoxWrapper";
import Box from "@mui/material/Box";
import TopBoxComponent from "v1/components/SquaredBoxWrapper/TopBoxComponent/TopBoxComponent";
import BoxFold from "v1/components/BoxFold/BoxFold";
import { Height } from "@mui/icons-material";
import { Tooltip } from "@mui/material";

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
	const [isMinimise, setIsMinimise] = useState(false);
	const [xmlInstantState, xmlInstantDispatch] = useReducer(
		xmlInstantReducer,
		{ XML: true, XSL: true, CALCULATE_XSLT: false }
	);
	const { transformerState, onChangeXmlValue, onChangeXslValue } =
		useMUIXSLTTransformation({
			xmlInstant: xmlInstantState,
			setXmlInstant: xmlInstantDispatch,
		});

	const { xmlState, xslState, resultState } = transformerState;

	const resultHeight = useCallback(() => {
		if (resultState.isValid) {
			return 18;
		}
		if (resultState.isAIResponse) {
			return 10;
		}
		return 4;
	}, [resultState.text]);
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
	const onClickMinimize = () => {
		setIsMinimise(true);
	};
	const onClickBoxFold = () => {
		console.log("click isMinimise", isMinimise);
		setIsMinimise(false);
	};
	const contentMapper: { [key: string]: string } = useMemo(() => {
		return {
			xml: xmlState.text,
			xsl: xslState.text,
			result: resultState.text,
		};
	}, [xmlState.text, xslState.text, resultState.text]);
	const handleDownload = (identifier: string, textContent?: string) => {
		const xmlContent = contentMapper[identifier];
		const blob = new Blob([xmlContent], { type: "application/xml" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
		const filename = `${identifier}_data_${timestamp}.xml`;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	return (
		<TransformerVWrapper
			title="XSLT Transformation"
			components={[
				{
					component: !isMinimise ? (
						<SquaredBoxWrapper
							children={
								<NextGenEditor
									handleOnChangeInputText={onChangeXmlValue}
									name="mui"
									value={xmlState.text}
									border="none"
									placeholder="Enter xml here ..."
								/>
							}
							TopComponent={
								<TopBoxComponent
									onClickMinimize={onClickMinimize}
									title="xml"
								/>
							}
						/>
					) : (
						<SquaredBoxWrapper>
							<Tooltip placement="bottom" title="Open xml">
								<span>
									<BoxFold
										boxLabel="xml"
										sx={{
											width: "60vw",
											height: "24px",
											cursor: "pointer",
										}}
										onClick={onClickBoxFold}
									/>
								</span>
							</Tooltip>
						</SquaredBoxWrapper>
					),
					utilNode: !isMinimise && (
						<XmlButton
							onChangeXmlInstant={onChangeXmlInstant}
							xmlContent={xmlState.text}
							defaultChecked={true}
							checked={xmlInstantState.XML}
							onClickDownload={handleDownload}
						/>
					),
				},
				{
					component: (
						<SquaredBoxWrapper
							children={
								<NextGenEditor
									handleOnChangeInputText={onChangeXslValue}
									name="mui"
									value={xslState.text}
									placeholder="Enter xsl here ..."
									border="none"
								/>
							}
							TopComponent={<TopBoxComponent title="xsl" />}
						/>
					),
					utilNode: (
						<XslButton
							defaultChecked={true}
							onChangeXslInstant={onChangeXslInstant}
							checked={xmlInstantState.XSL}
							onClickDownload={handleDownload}
						/>
					),
				},
				{
					component: (
						<BoxWrapper
							onClickShowResult={onClickShowResult}
							value={resultState.text}
							isLoading={resultState.isLoading}
						>
							<NextGenEditor
								readonly={true}
								name="mui"
								value={resultState.text}
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
