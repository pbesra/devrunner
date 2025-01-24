interface parseXMLProps {
	xmlDoc: Document | null;
	hasError: boolean;
	errorMessage: string;
}
const parseXML = (xmlString: string, nodeName?: string): parseXMLProps => {
	let hasError = false;
	let xmlDoc: Document | null = null;
	let errorMessage = "";
	if (xmlString) {
		const parser = new DOMParser();
		xmlDoc = parser.parseFromString(xmlString, "application/xml");
		const parseError = xmlDoc.getElementsByTagName("parsererror");
		if (parseError.length) {
			xmlDoc = null;
			errorMessage = `Invalid xml content in ${nodeName}. ${parseError[0].textContent}`;
			hasError = true;
		}
	}
	return {
		hasError: hasError,
		xmlDoc: xmlDoc,
		errorMessage: errorMessage,
	};
};

export default parseXML;
