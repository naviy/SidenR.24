import { $defaultAnimationDurationMs } from "@libs";
import { blueGrey } from "@mui/material/colors";






//===






export function PileNodeBackfill({ mb }: { mb?: number })
{
	return <div
		className="pile-node-backfill"
		style={mb !== undefined ? ({ "--mb": mb }) as any : undefined}
	/>;
}


export module PileNodeBackfill
{

	export var globalStyles = {

		".pile-node-backfill": {

			position: "absolute",
			inset: 0,
			bottom: "calc(var(--mb, 24) * 1px)",

			minHeight: 24,
			borderRadius: 12,
			border: `2px dotted ${blueGrey[200]}`,
			//boxShadow: elevaltionShadows.L1,

			background: "rgba(255,255,255,.4)",

			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out, opacity ${$defaultAnimationDurationMs}ms linear`,


		},

	};

}
