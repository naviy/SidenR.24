import { $defaultAnimationDurationMs } from "@libs";
import { blueGrey } from "@mui/material/colors";
import type { CSSObject } from "@mui/material/styles";






//===






export function PileNodeBackfill({ mb, visible }: { mb?: number; visible?: boolean })
{
	return <div
		className="pile-node-backfill"
		style={mb !== undefined ? ({ "--mb": mb, "--op": visible !== false ? 1 : undefined }) as any : undefined}
	/>;
}


export module PileNodeBackfill
{

	export var globalStyles: CSSObject = {

		".pile-node-backfill": {

			position: "absolute",
			inset: 0,
			bottom: "calc(var(--mb, 24) * 1px)",

			minHeight: 24,
			borderRadius: 12,
			border: `2px dotted ${blueGrey[200]}`,
			//boxShadow: elevaltionShadows.L1,

			background: "rgba(255,255,255,.4)",

			opacity: "var(--op, 0)",

			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out, opacity ${$defaultAnimationDurationMs}ms linear`,

		},

	};

}
