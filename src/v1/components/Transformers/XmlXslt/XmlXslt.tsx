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
import CoreStackBlitz from "v1/core.integration/core.stackblitz/CoreStackBlitz/CoreStackBlitz";
import { useSelector } from "react-redux";
import { RootState } from "v1/appReduxStore/rootStore/rootStore";
import CoreCodeEditor from "v1/core.integration/core-code-editor/CoreCodeEditor/CoreCodeEditor";

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

interface MinimiseState {
	xml: {
		isMinimise: boolean;
	};
	xsl: {
		isMinimise: boolean;
	};
}
const initialMinimiseState: MinimiseState = {
	xml: {
		isMinimise: false,
	},
	xsl: {
		isMinimise: false,
	},
};
const minimiseReducer = (state: MinimiseState, action: actionProps) => {
	if (action.key === XML_INSTANT.XML) {
		return { ...state, xml: { isMinimise: action.value } };
	} else if (action.key === XML_INSTANT.XSL) {
		return { ...state, xsl: { isMinimise: action.value } };
	}
	return { ...state };
};

const XmlXslt = () => {
	const coreCodeEditor = new CoreCodeEditor(new CoreStackBlitz());
	const [isMinimise, minimiseDispatch] = useReducer(
		minimiseReducer,
		initialMinimiseState
	);
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
	const onClickMinimize = (id: string) => {
		minimiseDispatch({ key: id, value: true });
	};
	const onClickBoxFold = (id: string) => {
		minimiseDispatch({ key: id, value: false });
	};
	const contentMapper: { [key: string]: any } = useMemo(() => {
		return {
			XML: {
				state: xmlState,
				onChange: onChangeXmlValue,
			},
			XSL: {
				state: xslState,
				onChange: onChangeXslValue,
			},
			RESULT: {
				state: resultState,
			},
		};
	}, [xmlState.text, xslState.text, resultState.text]);

	const handleDownload = (identifier: string, textContent?: string) => {
		const xmlContent = contentMapper[identifier].state.text;
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

	const handleOpenInStackblitz = (identifier: string) => {
		const content = contentMapper[identifier].state.text;
		coreCodeEditor.handleOpenInCodeEditor(
			content,
			"xml",
			`${identifier}_data`
		);
	};

	const handleFileUpload = (
		id: string,
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			const content = e.target?.result as string;
			const onChangeFn = contentMapper[id].onChange;
			onChangeFn?.(content);
		};
		reader.readAsText(file);
	};
	const onClickClear = (id: string) => {
		const onChangeFn = contentMapper[id].onChange;
		onChangeFn?.("");
	};

	return (
		<TransformerVWrapper
			title="XSLT Transformation"
			components={[
				{
					component: !isMinimise.xml.isMinimise ? (
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
									onClickMinimize={() =>
										onClickMinimize(XML_INSTANT.XML)
									}
									onClickClear={() =>
										onClickClear(XML_INSTANT.XML)
									}
									title="xml"
								/>
							}
						/>
					) : (
						<SquaredBoxWrapper
							sx={{ border: "none", borderRadius: 4 }}
						>
							<Tooltip placement="bottom" title="Open xml">
								<span>
									<BoxFold
										boxLabel="xml"
										sx={{
											width: "60vw",
											height: "24px",
											cursor: "pointer",
											backgroundColor: "#007cb9",
											borderRadius: 1,
											fontWeight: "bold",
											color: "whitesmoke",
										}}
										onClick={() =>
											onClickBoxFold(XML_INSTANT.XML)
										}
										hasClassName={false}
									/>
								</span>
							</Tooltip>
						</SquaredBoxWrapper>
					),
					utilNode: !isMinimise.xml.isMinimise && (
						<XmlButton
							onChangeXmlInstant={onChangeXmlInstant}
							xmlContent={xmlState.text}
							defaultChecked={true}
							checked={xmlInstantState.XML}
							onClickDownload={handleDownload}
							onClickOpenInStackBlitz={handleOpenInStackblitz}
							onClickUpload={handleFileUpload}
						/>
					),
				},
				{
					component: !isMinimise.xsl.isMinimise ? (
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
							TopComponent={
								<TopBoxComponent
									onClickMinimize={() =>
										onClickMinimize(XML_INSTANT.XSL)
									}
									title="xsl"
									onClickClear={() =>
										onClickClear(XML_INSTANT.XSL)
									}
								/>
							}
						/>
					) : (
						<SquaredBoxWrapper
							sx={{ border: "none", borderRadius: 4 }}
						>
							<Tooltip placement="bottom" title="Open xsl">
								<span>
									<BoxFold
										boxLabel="xsl"
										sx={{
											width: "60vw",
											height: "24px",
											cursor: "pointer",
											backgroundColor: "#007cb9",
											borderRadius: 1,
											fontWeight: "bold",
											color: "whitesmoke",
										}}
										onClick={() =>
											onClickBoxFold(XML_INSTANT.XSL)
										}
										hasClassName={false}
									/>
								</span>
							</Tooltip>
						</SquaredBoxWrapper>
					),
					utilNode: !isMinimise.xsl.isMinimise && (
						<XslButton
							defaultChecked={true}
							onChangeXslInstant={onChangeXslInstant}
							checked={xmlInstantState.XSL}
							onClickDownload={handleDownload}
							onClickOpenInStackBlitz={handleOpenInStackblitz}
							onClickUpload={handleFileUpload}
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
