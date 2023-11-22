import { $defaultAnimationDurationMs } from '@libs';
import { styled } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { Tenta } from "../../tentas";






//===






export function PileNodeLinkLine(props: {
	tenta: Tenta.Base;
	visible?: boolean;
	width?: number;
	lineToParent?: boolean;
	lineToNext?: boolean;
})
{

	let { tenta, width = 36, visible } = props;


	visible ??= !tenta.placeholder?.collector.root;


	return (
		<PileNodeLinkLine.Root width={visible ? width : 0}>

			{(props.lineToParent ?? tenta.isFirst) && <div className="line-to-parent" />}
			<div className="angle" />
			{(props.lineToNext ?? !tenta.isLast) && <div className="line-to-next" />}

		</PileNodeLinkLine.Root>
	);

}





export module PileNodeLinkLine
{


	export const Root = styled(
		"div",
		{ shouldForwardProp: p => p !== "width" && p !== "thickness" }
	)<{

		width: number;
		thickness?: number;

	}>(({ width, thickness }) =>
	{

		let color = blueGrey[400];


		return {

			position: "absolute",
			left: -width,
			top: 0,
			bottom: 0,
			width,
			opacity: width ? 1 : 0,

			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,


			"> .angle": {
				position: "absolute",
				left: 0,
				right: 0,
				top: 0,
				height: 24,

				border: `${thickness || 2}px solid ${color}`,
				borderTopWidth: 0,
				borderRightWidth: 0,
				borderBottomLeftRadius: 12,
			},

			"> .line-to-parent": {
				position: "absolute",
				left: 0,
				right: 0,
				top: -24,
				height: 24,
				borderLeft: `${thickness || 2}px solid ${color}`,
			},

			"> .line-to-next": {
				position: "absolute",
				inset: 0,
				borderLeft: `${thickness || 2}px solid ${color}`,
			},

		};

	});


}