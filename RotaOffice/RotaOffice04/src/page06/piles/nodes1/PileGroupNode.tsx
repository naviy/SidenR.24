import { Pane } from '@libs';
import type { Color } from "@mui/material";
import { lighten, styled } from "@mui/material/styles";
import { Tenta as Tenta_ } from "../../tentas";






//===






export module PileGroupNode
{


	//---




	//export function Tail({

	//	collector,

	//	children,

	//	...colProps

	//}: Pane.ColProps & {

	//	collector: Tenta_.Collector;

	//})
	//{


	//	let isSeparated = collector.isSeparated();


	//	return (

	//		<Pane.Col

	//			start
	//			end

	//			rt={isSeparated ? "lg" : undefined}
	//			rb={isSeparated ? "lg" : undefined}

	//			{...colProps}
	//		>

	//			{children}

	//		</Pane.Col>

	//	);

	//}



	//---



	export function defaultBackfill(tenta: Tenta_.Base, color?: Color | null)
	{
		return (
			<Backfill
				bg={color ? lighten(color[50], .5) : undefined}
				brd={color ? `2px solid ${color?.[200]}` : undefined}
				visible={tenta.tailIsVisibleAndSeparated}
			/>
		);
	}



	export var Backfill = styled(
		"div",
		{
			target: "pile-group-node-2-backfill",
			shouldForwardProp: p => p !== "bg" && p !== "brd" && p !== "visible",
		}
	)<{
		bg?: string;
		brd?: string;
		visible?: boolean;
	}>(props => ({

		"--bg": props.bg,
		"--brd": props.brd,
		"--op": props.visible !== false ? 1 : undefined

	}));



	//---


}