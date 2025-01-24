import { useEffect, useState } from "react";

interface copyContentProps {
	contentRef?: React.RefObject<HTMLDivElement>;
	content?: string;
	source: string;
}
const copyContent = async (props: copyContentProps) => {
	if (
		props.source === "ref" &&
		props.contentRef &&
		props.contentRef.current
	) {
		const content = props.contentRef.current.innerText; // Extracts the text content

		try {
			await navigator.clipboard.writeText(content);
			return true;
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	} else {
		try {
			await navigator.clipboard.writeText(props.content ?? "");
			return true;
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
		return false;
	}
};
export default copyContent;
