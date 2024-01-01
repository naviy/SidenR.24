import { styled } from "@mui/material/styles";

import "./PileNodeBackfill.css";






//===






export function PileNodeBackfill(props: { mb?: number; visible?: boolean })
{
	return <PileNodeBackfill.Root
		className="pile-node-backfill"
		mb={props.mb}
		visible={props.visible}
	/>;
}




export module PileNodeBackfill
{


	export var Root = styled(
		"div",
		{ shouldForwardProp: p => p !== "mb" && p !== "visible" }
	)<{
		mb?: number;
		visible?: boolean;
	}>(props => ({

		"--mb": `${props.mb}px`,
		"--op": props.visible !== false ? 1 : undefined

	}));


}
