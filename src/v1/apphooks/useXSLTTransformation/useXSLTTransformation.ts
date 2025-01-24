import { useState, useEffect } from "react";

export function useXSLTTransformation(
	xmlText: string | undefined,
	xslText: string | undefined
) {
	const [result, setResult] = useState<string>("");
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		if (!xmlText || !xslText) return;

		try {
			const parser = new DOMParser();
			const xsltProcessor = new XSLTProcessor();

			// Parse XSL and XML
			const xslStylesheet = parser.parseFromString(
				xslText,
				"application/xml"
			);
			const xmlDocument = parser.parseFromString(
				xmlText,
				"application/xml"
			);

			// Import the stylesheet and transform
			xsltProcessor.importStylesheet(xslStylesheet);
			const transformedDocument =
				xsltProcessor.transformToDocument(xmlDocument);

			// Serialize the result
			const serializer = new XMLSerializer();
			const resultString =
				serializer.serializeToString(transformedDocument);
			setResult(resultString);
		} catch (err) {
			setError(err);
		}
	}, [xmlText, xslText]);

	return { result, error };
}
