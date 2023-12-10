import { $defaultAnimationDurationMs } from '@libs';
import { styled } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { Tenta } from "../../tentas";
import { createContext, useContext, type ReactNode } from "react";






//===





export function PileNodeLinkLine(props: {
	tenta: Tenta.Base;
	//visible?: boolean;
	width?: number;
	lineToParent?: boolean;
	lineToNext?: boolean;
})
{

	let { tenta, width, /*visible*/ } = props;


	if (width === undefined)
	{
		let options = PileNodeLinkLine.useOptions();
		width = options.width;
	}


	//visible ??= !tenta.placeholder?.collector.root;


	return (

		<PileNodeLinkLine.Root width={Math.max(0, width - 4)}>

			{(props.lineToParent ?? tenta.isFirst) && <div className="line-to-parent" />}
			<div className="angle" />
			{(props.lineToNext ?? !tenta.isLast) && <div className="line-to-next" />}

		</PileNodeLinkLine.Root>

	);

}





export module PileNodeLinkLine
{


	//---




	const OptionsContext = createContext(0);



	export function useOptions()
	{
		return { width: useContext(OptionsContext) };
	}


	export function OptionsProvider(props: { width: number; children: ReactNode })
	{
		return <OptionsContext.Provider
			value={props.width}
			children={props.children}
		/>;
	}




	//---




	export var Root = styled(
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
			zIndex: 0,

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
				top: width ? -24 : 0,
				height: width ? 24 : 0,
				borderLeft: `${thickness || 2}px solid ${color}`,
				transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

			},

			"> .line-to-next": {

				position: "absolute",
				inset: 0,
				borderLeft: `${thickness || 2}px solid ${color}`,
				transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

			},

		};

	});




	//---


}