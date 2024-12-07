import { Anchor } from "components/AppDrawer/AppDrawer";
import React from "react";
type UseDrawerProps={
    anchor:Anchor
}
const useAppDrawer=({anchor='left'}:UseDrawerProps)=>{
    const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
	});

	const toggleDrawer = (anchor: Anchor, open: boolean) => {
		return (event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event &&
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				return;
			}

			setState({ ...state, [anchor]: open });
		};
	};
    return {state, toggleDrawer};
};
export default useAppDrawer;