import { $defaultAnimationDurationMs } from "@libs";
import { blueGrey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";






//===






export var PileListBackfill = styled(
	"div",
	{ shouldForwardProp: p => p !== "visible" }
)<{

	visible?: boolean;

}>((props) => ({

	position: "absolute",
	inset: 1,

	borderRadius: "inherit",
	border: `2px dotted ${blueGrey[200]}`,

	background: "rgba(255,255,255,.33)",
	//boxShadow: "0 4px 24px -4px #c3c6c9, 0 1px 8px -1px #c3c6c9",

	opacity: props.visible !== false ? 1 : 0,

	transition: `opacity ${$defaultAnimationDurationMs}ms linear`,

}));



