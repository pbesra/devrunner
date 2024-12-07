import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Anchor } from "@mui/icons-material";

export type Anchor = "top" | "left" | "bottom" | "right";
export type DrawerStateProps = {
	top: boolean;
	left: boolean;
	bottom: boolean;
	right: boolean;
};
type AppDrawerProps = {
	drawerItems?: string[];
	anchor?: Anchor;
	state: { top: boolean; left: boolean; right: boolean; bottom: boolean };
	toggleDrawer: (
		anchor: Anchor,
		open: boolean
	) => (event: React.KeyboardEvent | React.MouseEvent) => void;
};

const AppDrawer = ({
	anchor = "left",
	drawerItems = ["All mail", "Trash", "Spam"],
	state,
	toggleDrawer,
}: AppDrawerProps) => {
	// const [state, setState] = React.useState({
	// 	top: false,
	// 	left: false,
	// 	bottom: false,
	// 	right: false,
	// });

	// const toggleDrawer = (anchor: Anchor, open: boolean) => {
	// 	return (event: React.KeyboardEvent | React.MouseEvent) => {
	// 		if (
	// 			event &&
	// 			event.type === "keydown" &&
	// 			((event as React.KeyboardEvent).key === "Tab" ||
	// 				(event as React.KeyboardEvent).key === "Shift")
	// 		) {
	// 			return;
	// 		}

	// 		setState({ ...state, [anchor]: open });
	// 	};
	// };

	const list = (anchor: Anchor) => (
		<Box
			sx={{
				width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
			}}
			role="presentation"
			onClick={toggleDrawer(anchor, false)}
			onKeyDown={toggleDrawer(anchor, false)}
		>
			<List>
				{drawerItems.map((text, index) => (
					<ListItem key={text} disablePadding>
						<ListItemButton>
							<ListItemIcon>
								{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);

	return (
		<div>
			{(["left", "right", "top", "bottom"] as const).map((anchor) => (
				<React.Fragment key={anchor}>
					<Button onClick={toggleDrawer(anchor, true)}>
						{anchor}
					</Button>
					<SwipeableDrawer
						anchor={anchor}
						open={state[anchor]}
						onClose={toggleDrawer(anchor, false)}
						onOpen={toggleDrawer(anchor, true)}
					>
						{list(anchor)}
					</SwipeableDrawer>
				</React.Fragment>
			))}
		</div>
	);
};

export default AppDrawer;
