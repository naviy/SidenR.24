import { $defaultAnimationDurationMs } from "@libs";
import { blueGrey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";






//===






export var PileBackfill = styled(
	"div",
	{
		name: 'pile-listbackfill',
		shouldForwardProp: p => /*p !== "visible" &&*/ p !== "mb"
	}
)<{

	//visible?: boolean;
	mb?: number;

}>((props) => ({

	position: "absolute",
	inset: 0,
	bottom: props.mb,

	minHeight: 24,
	borderRadius: 12,
	border: `2px dotted ${blueGrey[200]}`,

	background: "rgba(255,255,255,.4)",
	//boxShadow: "0 4px 24px -4px #c3c6c9, 0 1px 8px -1px #c3c6c9",

	//opacity: props.visible !== false ? 1 : 0,

	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out, opacity ${$defaultAnimationDurationMs}ms linear`,

	//boxShadow: elevaltionShadows.L1,

}));


