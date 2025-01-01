import XmlXslt from "components/Transformers/XmlXslt/XmlXslt";

export type TransformerProp={
    label: string;
    name: string
    endpoint: string;
    component: React.ComponentType,
};
const transformers: TransformerProp[]=[
    {
        name: 'xmlxslt',
        label:'Xslt',
        component: XmlXslt,
        endpoint:'xml-xslt'
    }
];
export default transformers;