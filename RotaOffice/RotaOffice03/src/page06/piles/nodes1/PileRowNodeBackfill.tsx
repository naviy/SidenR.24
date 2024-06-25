import { styled } from "@mui/material/styles";
import "./PileRowNodeBackfill.scss";






//===





export var PileRowNodeBackfill = styled(
	"div",
	{
		target: "pile-row-node-backfill",
		
		shouldForwardProp: p => p !== "bg" && p !== "color" && p !== "brd" && p !== "mb" && p !== "visible",
	}
)<{
	bg?: string;
	brd?: string;
	color?: string;
	mb?: number;
	visible?: boolean;
}>(props => ({

	"--bg": props.bg,
	"--brd": props.brd,
	"--color": props.color,

	"--mb": `${props.mb}px`,
	"--op": props.visible !== false ? 1 : undefined

}));
