import NextGenEditor from "v1/components/NextGenEditor/NextGenEditor/NextGenEditor";

import { useMUIXSLTTransformation } from "v1/apphooks/index"; // Import the hook
import React, { useReducer, useCallback, useMemo } from "react";

import BoxWrapper from "v1/components/BoxWrapper/BoxWrapper";
import XML_INSTANT from "@utils/constants/XmlInstants/XmlInstants";
import SquaredBoxWrapper from "v1/components/SquaredBoxWrapper/SquaredBoxWrapper";
import TopBoxComponent from "v1/components/SquaredBoxWrapper/TopBoxComponent/TopBoxComponent";
import BoxFold from "v1/components/BoxFold/BoxFold";
import { Tooltip } from "@mui/material";
import CoreStackBlitz from "v1/core.integration/core.stackblitz/CoreStackBlitz/CoreStackBlitz";
import CoreCodeEditor from "v1/core.integration/core-code-editor/CoreCodeEditor/CoreCodeEditor";
import { ActionProps } from "v1/common-interfaces/common-interfaces";

import {
	handleOnClickMinimize,
	handleOnDownload,
} from "@utils/generic-funtions/generic-functions";
import { FILE_TYPE } from "@utils/constants/FILE_TYPE";
import { MinimiseState, XmlInstantReducerProps } from "../xml-interfaces";
import {
	handleOnChangeXmlInstant,
	handleOnChangeXslInstant,
	handleOnClickBoxFold,
} from "../common-functions/common-functions";
import TransformerVWrapper from "../../TransformerWrapper/TransformerVWrapper";
import XmlButton from "../XmlXsltButtons/XmlButton/XmlButton";
import XslButton from "../XmlXsltButtons/XslButton/XslButton";
import { EDITOR_NAME } from "v1/components/NextGenEditor/EditorMapper/EditorMapper";
import { APP_LANGUAGE } from "@utils/constants/APP_LANGUAGE";

const xmlInstantReducer = (
	state: XmlInstantReducerProps,
	action: ActionProps
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

const initialMinimiseState: MinimiseState = {
	xml: {
		isMinimise: false,
	},
	xsl: {
		isMinimise: false,
	},
};
const minimiseReducer = (state: MinimiseState, action: ActionProps) => {
	if (action.key === XML_INSTANT.XML) {
		return { ...state, xml: { isMinimise: action.value } };
	} else if (action.key === XML_INSTANT.XSL) {
		return { ...state, xsl: { isMinimise: action.value } };
	}
	return { ...state };
};

const XmlXsltMonaco = () => {
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
	const _onChangeXmlInstant = (isChecked: boolean) => {
		handleOnChangeXmlInstant(
			{ key: XML_INSTANT.XML, value: isChecked },
			xmlInstantDispatch
		);
	};
	const _onChangeXslInstant = (isChecked: boolean) => {
		handleOnChangeXslInstant(
			{ key: XML_INSTANT.XSL, value: isChecked },
			xmlInstantDispatch
		);
	};
	const onClickMinimize = (id: string) => {
		handleOnClickMinimize({ key: id, value: true }, minimiseDispatch);
	};
	const onClickBoxFold = (id: string) => {
		handleOnClickBoxFold({ key: id, value: false }, minimiseDispatch);
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
		handleOnDownload(identifier, xmlContent, FILE_TYPE.TEXT);
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
									name={EDITOR_NAME.monaco}
									value={xmlState.text}
									border="none"
									placeholder="Enter xml here ..."
									language={APP_LANGUAGE.XML}
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
							onChangeXmlInstant={_onChangeXmlInstant}
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
									name={EDITOR_NAME.monaco}
									value={xslState.text}
									placeholder="Enter xsl here ..."
									border="none"
									language={APP_LANGUAGE.XML}
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
							onChangeXslInstant={_onChangeXslInstant}
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
							hasDownloadButton={true}
						>
							<NextGenEditor
								readonly={true}
								name={EDITOR_NAME.monaco}
								value={resultState.text}
								border="none"
								rows={resultHeight()}
								width="59.5vw"
								height={resultState.isValid ? "75vh" : "40vh"}
								language={APP_LANGUAGE.XML}
							/>
						</BoxWrapper>
					),
				},
			]}
		/>
	);
};

export default XmlXsltMonaco;
