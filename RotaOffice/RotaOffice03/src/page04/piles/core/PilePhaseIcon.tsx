import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { styled } from "@mui/material/styles";
import { Tenta } from "../../tentas";
import { usePileCellIndent } from "./PileCellIndent";

import "./PilePhaseIcon.scss";






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

		{/*<div style={{ position: "absolute", top: 0, color: "maroon" }}>#{tenta.iid}</div>*/}

		<Root
			className="pile-phase-icon"
			indent={indent}
			rotate={stage === "collapsed" ? 0 : stage === "expanded" ? 45 : 90}
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
