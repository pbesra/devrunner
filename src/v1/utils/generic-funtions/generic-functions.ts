import { ActionProps } from "v1/common-interfaces/common-interfaces";

export const handleFileUpload = () => {};
export const handleOnClickClear = () => {};
export const handleOnDownload = (
	identifier: string,
	textContent?: string,
	fileType: string = "txt"
) => {
	const blob = new Blob([textContent ?? ""], {
		type: `application/${fileType}`,
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
	const filename = `${identifier}_data_${timestamp}.${fileType}`;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};
export const handleOpenInCodeEditor = () => {};
export const handleOnClickMinimize = (action: ActionProps, callback: any) => {
	callback({ key: action.key, value: action.value });
};
export const handleOnChangeInputText = (value: any, callbackFn: any) => {
	callbackFn?.(value);
};
