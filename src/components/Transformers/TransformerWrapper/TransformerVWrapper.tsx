import Box from "@mui/material/Box";

interface TransformerObject {
	component: React.ReactNode;
	utilNode?: React.ReactNode;
}

export interface TransformerWrapperProps {
	title?: string;
	components?: TransformerObject[];
}

const TransformerVWrapper = (props: TransformerWrapperProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Box
				sx={{
					width: "65%",

					padding: 2,
				}}
			>
				<Box
					component="span"
					sx={{
						fontFamily: "monospace",
						color: "#4e4e4e",
					}}
				>
					{props.title}
				</Box>

				{props.components && (
					<Box
						sx={{
							margin: 2,
							gap: 2,
						}}
					>
						{props.components.map((Comp, i) => (
							<Box
								key={i}
								display="flex"
								justifyContent="space-between"
								alignItems="flex-start"
								width="100%"
								marginBottom={1.5}
							>
								<Box
									display="flex"
									justifyContent="center"
									alignItems="center"
								>
									{Comp.component}
								</Box>

								{Comp.utilNode && (
									<Box
										sx={{
											marginLeft: 1,
										}}
									>
										{Comp.utilNode}
									</Box>
								)}
							</Box>
						))}
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default TransformerVWrapper;
