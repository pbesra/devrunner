import { useEffect, useState } from "react";

interface useCopyContentProps {
	contentRef?: React.RefObject<HTMLDivElement>;
	content?: string;
	source: string;
}
//React.RefObject<HTMLDivElement>
const useCopyContent = (props: useCopyContentProps) => {
	const [isCopyCompleted, setIsCopyCompleted] = useState(false);
	const handleCopyContent = async (
		contentProps: useCopyContentProps,
		source: string
	) => {
		if (
			source === "ref" &&
			contentProps.contentRef &&
			contentProps.contentRef.current
		) {
			const content = contentProps.contentRef.current.innerText; // Extracts the text content

			try {
				await navigator.clipboard.writeText(content);
				setIsCopyCompleted(true);
			} catch (err) {
				console.error("Failed to copy text: ", err);
				setIsCopyCompleted(false);
			}
		} else {
			try {
				await navigator.clipboard.writeText(contentProps.content ?? "");
				setIsCopyCompleted(true);
			} catch (err) {
				console.error("Failed to copy text: ", err);
				setIsCopyCompleted(false);
			}
		}
	};
	useEffect(() => {
		const handleCopy = async () => {
			await handleCopyContent(props, props.source);
		};
		handleCopy();
	}, [props.contentRef, props.source, props.content]);
	return { isCopyCompleted, setIsCopyCompleted };
};
export default useCopyContent;
