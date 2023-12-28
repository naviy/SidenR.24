import { styled } from "@mui/material/styles";
import { $defaultAnimationDurationMs, createPrimitive, PrimitiveProps, UseHookProps } from "../core";
import { Block } from "./Block";
import * as Container from "./Container";
import { ContainerInfo, ContainerInfo as ContainerInfo_ } from "./ContainerInfo";
import { PaneRadius } from "./PaneRadius";
import { PaneBorder } from "./PaneBorder";






//===






export function Pane(props: Pane.Props & PrimitiveProps<HTMLDivElement>)
{

	//__$log("Pane");
	props = UseHookProps.use(props);

	let containerInfo = ContainerInfo_.use();


	let v = ContainerInfo.init(
		props,
		containerInfo,
		{}
	);


	let sizes = Block.getBoxSizes(
		containerInfo?.layout || "col",
		props,
	);



	let body = props.children;


	if (typeof body === "string")
	{
		body = <span>{body}</span>;
	}


	//if (typeof body === "string")
	//{
	//	body = <>
	//		{body}
	//		<div className="pane-border"/>
	//	</>
	//}


	//if (props.ff)
	//{
	//	body = <>
	//		<Focuser.Caret use={Pane.useCaretProps} />
	//		{body}
	//	</>;
	//}


	if (containerInfo?.debug)
	{
		body = <>
			<DebugBox>
				<div>
					<b>pane{props.id && ` #${props.id}`}</b>&nbsp; &nbsp;
					{props.start && " start"}{props.end && " end"}
				</div>
			</DebugBox>
			{body}
		</>;
	}



	body = createPrimitive(
		Root as any,
		{
			debug: containerInfo?.debug,
			//bgcolor: props.bgcolor,
			r: PaneRadius.css(v.rtl, v.rtr, v.rbr, v.rbl),
			bt: v.bt,
			br: v.br,
			bb: v.bb,
			bl: v.bl,
			...sizes,
			children: body,
		} as RootProps,
		props,
		Pane.propNames
	);



	body = (
		<ContainerInfo_.Context.Provider value={null}>
			{body}
		</ContainerInfo_.Context.Provider>
	);


	return body;

}






export module Pane
{


	//---




	export import ContainerInfo = ContainerInfo_;

	export type ColProps = Container.ColProps;
	export type DivProps = Container.DivProps;
	export type RowProps = Container.RowProps;

	export import Ghost = Container.Ghost;
	export import Col = Container.Col;
	export import Div = Container.Div;
	export import Row = Container.Row;

	export import Border = PaneBorder;
	export import Radius = PaneRadius;




	//---




	export interface Props extends Block.Props, UseHookProps<Props>
	{
		id?: string;

		//ff?: boolean;

	}



	export var propNames: PropNames<Props> =
	{

		id: true,

		//ff: true,

		...Block.propNames,
		...UseHookProps.propNames,

	};




	//---




	//export function useCaretProps()
	//{
	//	let row = Pane.ContainerInfo.use();
	//	return { borderRadius: row && Pane.Radius.css(row.rtl, row.rtr, row.rbr, row.rbl) };
	//}




	//---


}






//===






export interface RootProps
{
	debug?: boolean;

	r: string;
	bt: PaneBorder;
	br: PaneBorder;
	bb: PaneBorder;
	bl: PaneBorder;

	flex?: number | string;

	width?: number | string;
	minWidth?: number | string;
	maxWidth?: number | string;

	height?: number | string;
	minHeight?: number | string;
	maxHeight?: number | string;

}



const rootPropNames: PropNames<RootProps> =
{
	debug: true,
	r: true,
	bt: true,
	br: true,
	bb: true,
	bl: true,
	flex: true,
	width: true,
	minWidth: true,
	maxWidth: true,
	height: true,
	minHeight: true,
	maxHeight: true,
};






export var Root = styled(
	"div",
	{
		shouldForwardProp: p =>
			p !== "isFlex" && !(rootPropNames as any)[p]
		,
	}
)<RootProps>((props) =>
{

	//let ppColor = props.debug ? `rgb(231,171,171)` : "transparent";

	var defaultBorder = "0 solid transparent" as const;


	return {

		display: "flex",
		position: "relative",

		background: props.theme.palette.background.paper,
		//background: Pane.BgColor(props.theme, props.bgcolor),

		borderRadius: props.r,

		boxSizing: 'border-box',

		flex: props.flex,

		width: props.width,
		minWidth: props.minWidth,
		maxWidth: props.maxWidth,

		height: props.height,
		minHeight: props.minHeight,
		maxHeight: props.maxHeight,

		transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,

		userSelect: "none",

		willChange: "border-radius, flex, width, min-width, max-width, height, min-height, max-height",


		"> *": {
			userSelect: "text",
		},

		//border: "1px solid red",

		"&::before": {

			position: "absolute",
			inset: 0,
			content: '""',

			borderRadius: "inherit",
			//boxShadow: PaneBorder.shadowCss(props.bt, props.br, props.bb, props.bl),
			//border: "0px solid transparent",
			borderTop: PaneBorder.borderCss(props.bt) || defaultBorder,
			borderRight: PaneBorder.borderCss(props.br) || defaultBorder,
			borderBottom: PaneBorder.borderCss(props.bb) || defaultBorder,
			borderLeft: PaneBorder.borderCss(props.bl) || defaultBorder,
			transition: `all ${$defaultAnimationDurationMs}ms linear`,

			pointerEvents: "none",
			willChange: "border-radius, border",

		},

	};
});






//===






export var DebugBox = styled("div")(() =>
{

	let color = "rgba(100,30,30, .5)";

	return {
		position: "absolute",
		inset: "-1px",
		overflow: "hidden",
		border: `1px dotted ${color}`,
		borderRadius: "inherit",

		"> div": {
			position: "absolute",
			top: 0,
			left: 0,
			fontSize: "8px",
			padding: "0px 8px 2px 6px",
			background: color,
			color: "white",
			borderBottomRightRadius: 3,

			whiteSpace: "nowrap",

		}
	};

});
