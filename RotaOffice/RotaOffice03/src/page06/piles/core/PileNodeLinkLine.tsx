import { styled } from '@mui/material/styles';
import { clsx } from "clsx";
import { createContext, useContext, type ReactNode } from "react";
import { Tenta } from "../../tentas";

import "./PileNodeLinkLine.scss";






//===






export function PileNodeLinkLine(props: {
	tenta: Tenta.Base;
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


	return (

		<PileNodeLinkLine.Root
			className={clsx("pile-node-linkline", width && "visible")}
			width={width}
			//thickness={thickness}			
		>

			{<div className={clsx("line-to-parent", (props.lineToParent ?? tenta.isFirst) && "opacity10")} />}
			<div className="angle" />
			<div className={clsx("line-to-next", (props.lineToNext ?? !tenta.isLast) && "opacity10")} />

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
		width?: number;
		thickness?: boolean;
	}>(props => ({

		"--width": `${props.width}px`,
		"--thickness": `${props.thickness || 2}px`,

	}));




	//---


}