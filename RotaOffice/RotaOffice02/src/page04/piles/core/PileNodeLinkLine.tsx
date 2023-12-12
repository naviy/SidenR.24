import { $defaultAnimationDurationMs } from '@libs';
import { styled } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { Tenta } from "../../tentas";
import { createContext, useContext, type ReactNode } from "react";
import { clsx } from "clsx";






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


	//width = Math.max(0, width - 4);


	return (

		<div
			className={clsx("pile-node-linkline", width && "visible")}
			style={{
				"--width": width,
				//...thickness
			} as any}
		>

			{(props.lineToParent ?? tenta.isFirst) && <div className="line-to-parent" />}
			<div className="angle" />
			{(props.lineToNext ?? !tenta.isLast) && <div className="line-to-next" />}

		</div>

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




	var color = blueGrey[300];

	export var globalStyles = {

		".pile-node-linkline": {

			position: "absolute",
			left: "calc(var(--width) * -1px)",
			top: 0,
			bottom: 0,
			width: "calc(var(--width) * 1px)",
			opacity: 0,
			zIndex: 0,

			transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,


			"> .angle": {

				position: "absolute",
				left: 0,
				right: 0,
				top: 0,
				height: 24,

				border: `calc(var(--thickness, 2) * 1px) solid ${color}`,
				borderTopWidth: 0,
				borderRightWidth: 0,
				borderBottomLeftRadius: 9,

				transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

			},

			"> .line-to-parent": {

				position: "absolute",
				inset: 0,
				borderLeft: `calc(var(--thickness, 2) * 1px) solid ${color}`,
				transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

			},

			"> .line-to-next": {

				position: "absolute",
				inset: 0,
				borderLeft: `calc(var(--thickness, 2) * 1px) solid ${color}`,
				transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

			},


			"&.visible": {

				opacity: 1,

				"> .line-to-parent": {
					top: -24,
					height: 24,
				},

			},

		},

	};




	//---


}