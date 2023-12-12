import { $defaultAnimationDurationMs } from "@libs";
import { blueGrey } from "@mui/material/colors";






//===






export function PileBackfill({ mb }: { mb?: number })
{
	return <div
		className="pile-backfill"
		style={mb !== undefined ? ({ "--mb": mb }) as any : undefined}
	/>;
}


export module PileBackfill
{

	export var globalStyles = {

		".pile-backfill": {

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
