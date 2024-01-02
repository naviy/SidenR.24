//import { styled } from "@mui/material/styles";
//import { createContext, useContext, type ReactNode } from "react";
//import { $defaultAnimationDurationMs, $log } from "../core";
//import { PaneBorder } from "./PaneBorder";
//import type { ContainerBaseProps } from "./ContainerProps";
//import type { ContainerInfo } from "./ContainerInfo";






////===






//export function PaneBorderer(props: {
//	block: Partial<ContainerBaseProps>,
//	parentContainer: ContainerInfo | null,
//})
//{

//	$log("PaneBorderer");

//	let v = PaneBorderer.useByContainer(props.block, props.parentContainer);

//	return !v ? null : <PaneBorderer.Root bt={v.bt} br={v.br} bb={v.bb} bl={v.bl} />;
//}






//export module PaneBorderer
//{


//	//---




//	export interface ContextProps
//	{
//		b: PaneBorder;
//		bt: PaneBorder;
//		br: PaneBorder;
//		bb: PaneBorder;
//		bl: PaneBorder;
//	}



//	var contextPropNames: PropNames<ContextProps> =
//	{
//		b: true,
//		bt: true,
//		br: true,
//		bb: true,
//		bl: true,
//	};




//	export function useByContainer(
//		block: Partial<ContainerBaseProps>,
//		parentContainer: ContainerInfo | null,
//	): ContextProps
//	{

//		let { start, end, } = block;
//		let inRow = parentContainer?.layout === "row";
//		let inCol = !parentContainer || parentContainer.layout === "col";


//		let parent = use();


//		let b = (block.b ?? parent?.b) || "" as PaneBorder;
//		let bl = !parent ? "" : block.bl ?? (inRow && start || inCol ? parent.bl : b);
//		let br = !parent ? "" : block.br ?? (inRow && end || inCol ? parent.br : inRow && !end ? "" : b);
//		let bt = !parent ? "" : block.bt ?? (inRow || inCol && start ? parent.bt : b);
//		let bb = !parent ? "" : block.bb ?? (inRow || inCol && end ? parent.bb : inCol && !end ? "" : b);


//		let v: ContextProps = { b, bl, br, bt, bb };


//		return parent && Object.shallowEqual(parent, v) ? parent : v;

//	}



//	var Context = createContext<ContextProps | null>(null);


//	export function use()
//	{
//		return useContext(Context);
//	}


//	export function Provider({
//		value, children
//	}: {
//		value: ContextProps;
//		children: ReactNode;
//	})
//	{
//		return <Context.Provider value={value} children={children} />;
//	}




//	//---




//	export var Root = styled(
//		"div",
//		{
//			name: "pane-borderer",
//			shouldForwardProp: p => !(contextPropNames as any)[p],
//		}
//	)<Pick<ContextProps, "bt" | "br" | "bb" | "bl">>((props) =>
//	{

//		var defaultBorder = "0 solid transparent" as const;


//		return {

//			position: "absolute",
//			inset: 0,
//			content: '""',

//			borderRadius: "inherit",

//			borderTop: PaneBorder.borderCss(props.bt) || defaultBorder,
//			borderRight: PaneBorder.borderCss(props.br) || defaultBorder,
//			borderBottom: PaneBorder.borderCss(props.bb) || defaultBorder,
//			borderLeft: PaneBorder.borderCss(props.bl) || defaultBorder,

//			transition: `all ${$defaultAnimationDurationMs}ms linear`,

//			pointerEvents: "none",
//			willChange: "border-radius, border",

//		};
//	});




//	//---


//}

