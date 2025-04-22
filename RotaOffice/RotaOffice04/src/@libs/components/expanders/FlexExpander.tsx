import { styled } from "@mui/material/styles";
import React from "react";
import { Div, UseHookProps, Values, createPrimitive, useNew, type DivProps } from "../core";
import { ExpanderBehavior, ExpanderProps } from "./ExpanderBehavior";
import { FlexExpanderBehavior } from "./FlexExpanderBehavior";






//===






export function FlexExpander(props: FlexExpander.Props & DivProps)
{

	props = UseHookProps.use(props);

	let elRef = React.createRef<HTMLDivElement>();


	let bhv = useNew(FlexExpanderBehavior).use(elRef, props.l || 1, props);


	let body = bhv.childrenShouldBeRendered && Values.one(props.children);


	body = createPrimitive(
		FlexExpander.Root,
		{
			ref: elRef,

			timeout: bhv.timeout,
			onTransitionEnd: bhv.onTransitionEnd,

			children: body,
		},
		props,
		FlexExpander.propNames
	);



	return body;

}






export module FlexExpander
{


	//---



	export var Behavior = ExpanderBehavior;


	export interface Props extends ExpanderProps, UseHookProps<Props> 
	{
		l?: number;
	}


	export var propNames: PropNames<Props> =
	{
		l: true,
		...ExpanderProps.propNames,
		...UseHookProps.propNames,
	};



	//---



	export var Root = styled(
		Div,
		{ shouldForwardProp: p => p !== "timeout", }
	)<{
		timeout: number;
	}>(
		({ timeout }) =>
		{

			return ({

				position: "relative",
				display: "inherit",
				flexDirection: "inherit",
				gap: "inherit",

				willChange: "flex",

				transition: `all ease-in-out ${timeout}ms, background ${timeout}ms linear, opacity ${timeout}ms linear !important`,

			});
		}
	);



	//---


}