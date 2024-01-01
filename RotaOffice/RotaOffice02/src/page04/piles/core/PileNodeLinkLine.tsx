import { styled } from '@mui/material/styles';
import { clsx } from "clsx";
import { createContext, useContext, type ReactNode } from "react";
import { Tenta } from "../../tentas";

import "./PileNodeLinkLine.css";






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
		width?: number;
		thickness?: boolean;
	}>(props => ({

		"--width": `${props.width}px`,
		"--thickness": `${props.thickness || 2}px`,

	}));




	//---


}