import { $defaultAnimationDurationMs, Div } from '@libs';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { styled } from "@mui/material/styles";
import { Tenta } from "../../tentas";
import { usePileCellIndent } from "./PileCellIndent";






//===






export function PilePhaseIcon({
	tenta,
	//indent
}: {
	tenta?: Tenta.Base | null;
	//indent?: boolean;
})
{


	if (tenta === undefined)
	{
		tenta = Tenta.useByPhase();
	}

	if (!tenta)
		return null;


	let { stage } = tenta;

	let indent = usePileCellIndent();


	return <>

		<div style={{ position: "absolute", top: 0, color: "maroon" } }>#{tenta.iid}</div>

		<Root
			indent={indent}
			rotate={stage === "collapsed" ? 0 : stage === "expanded" ? 45 : 90}
			children={<div>
				<ArrowRightIcon />
			</div>}
		/>

	</>;

}




const Root = styled(
	"div",
	{ shouldForwardProp: p => p !== "indent" && p !== "rotate" }
)<{
	indent: number;
	rotate: number;
}>((props) => ({

	//flex: `0 0 ${24 + props.indent}px`,
	width: 24 + props.indent,
	minHeight: 24,

	display: "inline-flex",
	justifyContent: "end",
	textAlign: "right",
	lineHeight: "24px",
	whiteSpace: "nowrap",
	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

	">div": {
		height: 24,
		transform: `rotate(${props.rotate}deg)!important`,
		transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,
	}

}));