import XmlXslt from "v1/components/Transformers/XmlXslt/XmlXslt";
import TextCompare from "v1/components/Transformers/TextCompare/TextCompare";

export type TransformerProp = {
	label: string;
	name: string;
	endpoint: string;
	component: React.ComponentType | React.ComponentType<any>;
};
const transformers: TransformerProp[] = [
	{
		name: "xmlxslt",
		label: "Xslt transformation",
		component: XmlXslt,
		endpoint: "xml-xslt",
	},
	{
		name: "text-compare",
		label: "Text Compare",
		component: TextCompare,
		endpoint: "text-compare",
	},
	{
		name: "json-web-token",
		label: "JSON Web Token",
		component: XmlXslt,
		endpoint: "json-web-token",
	},

	{
		name: "xpath",
		label: "X Path",
		component: XmlXslt,
		endpoint: "xpath",
	},
	{
		name: "xml-to-json",
		label: "XML to JSON",
		component: XmlXslt,
		endpoint: "xml-to-json",
	},
	{
		name: "json-to-xml",
		label: "JSON to XML",
		component: XmlXslt,
		endpoint: "json-to-xml",
	},
	{
		name: "validate-json",
		label: "Validate JSON",
		component: XmlXslt,
		endpoint: "validate-json",
	},
	{
		name: "validate-xml",
		label: "Validate XML",
		component: XmlXslt,
		endpoint: "validate-xml",
	},
	{
		name: "validate-yaml",
		label: "Validate yaml",
		component: XmlXslt,
		endpoint: "validate-yaml",
	},
];
export default transformers;
