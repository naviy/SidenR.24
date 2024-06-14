import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { styled } from "@mui/material/styles";
import { Tenta } from "../../tentas";
import { usePileCellIndent } from "./PileCellIndent";

import "./PilePhaseIcon.scss";






//===






export function PilePhaseIcon({
	tenta,
	noindent
}: {
	tenta?: Tenta.Base | null;
	noindent?: true;
})
{


	if (tenta === undefined)
	{
		tenta = Tenta.useByPhase();
	}

	if (!tenta)
		return null;


	let { openPhase, maxOpenPhase } = tenta;

	let indent = noindent === undefined ? usePileCellIndent() : 0;


	return <>

		<div style={{ position: "absolute", top: 0, color: "maroon" }}>#{tenta.iid}</div>

		<Root
			className="pile-phase-icon"
			indent={indent}
			rotate={Math.round(90.0 * openPhase / maxOpenPhase)}
			children={<div>
				<ArrowRightIcon />
			</div>}
		/>


	</>;

}




var Root = styled(
	"div",
	{ shouldForwardProp: p => p !== "indent" && p !== "rotate" }
)<{
	indent: number;
	rotate: number;
}>(props => ({

	//"--indent": props.indent,
	width: 32 + (props.indent || 0),
	"--rotate": `${props.rotate}deg`,

}));
