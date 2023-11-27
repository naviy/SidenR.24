import { $defaultAnimationDurationMs } from '@libs';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { styled } from "@mui/material/styles";
import { createContext, useContext, type ReactNode } from "react";
import { Tenta } from "../../tentas";






//===





const IndentContext = createContext(0);



export function useCellIndent()
{
	return useContext(IndentContext);
}



export function CellIndentProvider(
	props: ({
		indent: number;
		addIndent?: never;
	} | {
		indent?: never;
		addIndent: number;
	}) & {
		children: ReactNode;
	},
)
{

	let { indent, addIndent } = props as any as { indent?: number; addIndent?: number; };


	if (addIndent !== undefined)
	{
		let parentIndent = useCellIndent();
		indent = parentIndent + addIndent;
	}



	return <IndentContext.Provider
		value={indent || 0}
		children={props.children}
	/>;

}






//===





export function PilePhaseIcon({
	tenta,
	//indent
}: {
	tenta?: Tenta.Base | null;
	//indent?: boolean;
})
{


	if (tenta === undefined)
	{
		tenta = Tenta.useByPhase();
	}

	if (!tenta)
		return null;


	let { stage } = tenta;


	let indent = useCellIndent();


	return <Root
		indent={indent}
		rotate={stage === "collapsed" ? 0 : stage === "expanded" ? 45 : 90}
		children={<div><ArrowRightIcon /></div>}
	/>;

}




const Root = styled(
	"div",
	{ shouldForwardProp: p => p !== "indent" && p !== "rotate" }
)<{
	indent: number;
	rotate: number;
}>((props) => ({

	flex: `0 0 ${24 + props.indent}px`,
	display: "flex",
	justifyContent: "end",
	textAlign: "right",
	lineHeight: 1,
	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

	">div": {
		height: 24,
		transform: `rotate(${props.rotate}deg)!important`,
		transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,
	}

}));