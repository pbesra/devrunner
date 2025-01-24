import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { TransformerProp } from "v1/resources/transformers/transfomers";
import { Link } from "react-router";

export type Anchor = "top" | "left" | "bottom" | "right";
export type DrawerStateProps = {
	top: boolean;
	left: boolean;
	bottom: boolean;
	right: boolean;
};
type AppDrawerProps = {
	drawerItems?: TransformerProp[];
	anchor?: Anchor;
	state: { top: boolean; left: boolean; right: boolean; bottom: boolean };
	toggleDrawer: (
		anchor: Anchor,
		open: boolean
	) => (event: React.KeyboardEvent | React.MouseEvent) => void;
	DrawerLogo?: React.ComponentType;
	onClickAppDrawerItem?: (name: string) => void;
};

const AppDrawer = ({
	anchor = "left",
	drawerItems = [],
	state,
	toggleDrawer,
	DrawerLogo,
	onClickAppDrawerItem,
}: AppDrawerProps) => {
	const list = (anchor: Anchor) => (
		<Box
			sx={{
				width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
			}}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, true)}
		>
			<List>
				{drawerItems.map((item, index) =>
					item.endpoint ? (
						<Link
							style={{
								textDecoration: "none",
								color: "#4b4b4b",
							}}
							key={item.name}
							to={`/${item.endpoint}`}
							onClick={() =>
								onClickAppDrawerItem
									? onClickAppDrawerItem(item.name)
									: null
							}
						>
							<ListItem
								sx={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									textAlign: "left",
									paddingLeft: 4,
								}}
								key={item.name ?? index}
								disablePadding
							>
								<ListItemText
									primaryTypographyProps={{
										fontSize: "14px",
									}}
									primary={item.label}
								/>
							</ListItem>
						</Link>
					) : (
						<ListItem key={item.name ?? index} disablePadding>
							<ListItemButton>
								<ListItemText
									sx={{
										typography: {
											fontSize: "6px",
										},
									}}
									primary={item.label}
								/>
							</ListItemButton>
						</ListItem>
					)
				)}
			</List>
		</Box>
	);

	return (
		<div id="left-drawer">
			{(["left", "right", "top", "bottom"] as const).map((anchor) => (
				<React.Fragment key={anchor}>
					{/* <Button onClick={toggleDrawer(anchor, true)}>
						{anchor}
					</Button> */}
					<SwipeableDrawer
						anchor={anchor}
						open={state[anchor]}
						onClose={toggleDrawer(anchor, false)}
						onOpen={toggleDrawer(anchor, true)}
					>
						{DrawerLogo && (
							<Box>
								<DrawerLogo />
							</Box>
						)}
						{list(anchor)}
					</SwipeableDrawer>
				</React.Fragment>
			))}
		</div>
	);
};

export default AppDrawer;
