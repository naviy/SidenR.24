import { styled } from "@mui/material/styles";
import type { RefObject } from "react";
import { Div, UseHookProps, Values, createPrimitive, useNew, type DivProps } from "../core";
import { ExpanderBehavior, ExpanderProps } from "./ExpanderBehavior";






//===






export function Expander(props: Expander.Props)
{

	props = UseHookProps.use(props);

	let bhv = useNew(ExpanderBehavior).use(null, props.wrapperRef, props);


	let body = bhv.childrenShouldBeRendered && Values.one(props.children);


	if (!props.wrapperRef)
	{
		body = <div
			ref={bhv.wrapperRef}
			className={props.wrapperCls}
			children={body}
		/>;
	}


	body = createPrimitive(
		Expander.Root,
		{
			ref: bhv.ref,

			timeout: bhv.timeout,
			onTransitionEnd: bhv.onTransitionEnd,

			children: body,
		},
		props,
		Expander.propNames
	);



	return body;

}






export module Expander
{


	//---



	export var Behavior = ExpanderBehavior;


	export interface Props extends ExpanderProps, DivProps, UseHookProps<Props> 
	{
		wrapperRef?: RefObject<HTMLDivElement>;
		wrapperCls?: string;
	}


	export var propNames: Array<keyof Props> = [
		"wrapperRef", "wrapperCls",
		...ExpanderProps.propNames,
	];



	//---



	export var Root = styled(
		Div,
		{
			shouldForwardProp: p => p !== "timeout",
		}
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

				willChange: "height",

				transition: `all ease-in-out ${timeout}ms, background ${timeout}ms linear, opacity ${timeout}ms linear !important`,

				">div": {
					flex: 1,
					display: "inherit",
					flexDirection: "inherit",
					gap: "inherit",

				}

			});
		}
	);



	//---


}