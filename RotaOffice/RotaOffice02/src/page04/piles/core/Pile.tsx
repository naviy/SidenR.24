import MuiGlobalStyles from "@mui/material/GlobalStyles";
import { PileNodeBackfill } from "./PileNodeBackfill";
import { PileNodeLinkLine } from "./PileNodeLinkLine";






//===






export { PilePhaseIcon as PhaseIcon } from "./PilePhaseIcon";
export { usePileCellIndent as useCellIndent, PileCellIndentProvider as CellIndentProvider } from "./PileCellIndent";

export { PileNode as Node } from "./PileNode";






//===






export function GlobalStyles()
{
	return <MuiGlobalStyles styles={{
		...PileNodeBackfill.globalStyles,
		...PileNodeLinkLine.globalStyles,
	}} />;
}
