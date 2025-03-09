import XML_INSTANT from "@utils/constants/XmlInstants/XmlInstants";
import { ActionProps } from "v1/common-interfaces/common-interfaces";

export const handleOnChangeXmlInstant = (
	action: ActionProps,
	callback: any
) => {
	callback({ key: action.key, value: action.value });
};
export const handleOnChangeXslInstant = (
	action: ActionProps,
	callback: any
) => {
	callback({ key: action.key, value: action.value });
};

export const handleOnClickBoxFold = (action: ActionProps, callback: any) => {
	callback({ key: action.key, value: action.value });
};
