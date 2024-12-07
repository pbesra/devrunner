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
			console.log('1 event', event, 'anchor', anchor);
			if (
				event &&
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				console.log('2 event', event, 'anchor', anchor);
				return;
			}
			console.log('3 event', event, 'anchor', anchor);
			setState({ ...state, [anchor]: open });
		};
	};
    return {state, toggleDrawer, setState};
};
export default useAppDrawer;