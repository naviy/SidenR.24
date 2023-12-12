import MuiGlobalStyles from "@mui/material/GlobalStyles";
import { PileBackfill } from "./PileBackfill";






//===






export import Backfill = PileBackfill;

export { PilePhaseIcon as PhaseIcon } from "./PilePhaseIcon";
export { usePileCellIndent as useCellIndent, PileCellIndentProvider as CellIndentProvider } from "./PileCellIndent";

export { PileNode as Node } from "./PileNode";






//===






export function GlobalStyles()
{
	return <MuiGlobalStyles styles={{
		...PileBackfill.globalStyles
	}} />;
}
