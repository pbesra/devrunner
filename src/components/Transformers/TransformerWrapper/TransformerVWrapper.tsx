import Box from "@mui/material/Box";

export interface TransformerWrapperProps {
	title?: string;
	components?: React.ReactNode[];
}

const TransformerVWrapper = (props: TransformerWrapperProps) => {
	return (
		<Box>
			<span
				style={{
					fontFamily: "monospace",
					color: "#4e4e4e",
				}}
			>
				{props.title}
			</span>
			{props.components && (
				<Box sx={{ margin: 2 }}>
					{props.components?.map((Comp, i) => (
						<Box sx={{ margin: 1.5 }} key={`${i}`}>
							{Comp}
						</Box>
					))}
				</Box>
			)}
		</Box>
	);
};

export default TransformerVWrapper;
