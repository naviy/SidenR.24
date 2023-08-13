import { styled } from "@mui/material";

import { createPrimitive, Div, DivProps, UseHookProps, useNew, Values } from "../core";
import { ExpanderBaseProps, ExpanderBehavior } from "./ExpanderBehavior";
import { type } from "os";
import { RefObject } from "react";






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



	export const Behavior = ExpanderBehavior;

	export type BaseProps = ExpanderBaseProps;
	export const BaseProps = ExpanderBaseProps;



	export interface Props extends ExpanderBaseProps, DivProps, UseHookProps<Props> 
	{

		wrapperRef?: RefObject<HTMLDivElement>;
		wrapperCls?: string;

	}


	export const propNames: Array<keyof Props> = [
		"wrapperRef", "wrapperCls",
		...ExpanderBaseProps.propNames,
	];



	//---



	export const Root = styled(
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

				willChange: "height",

				transition: `all ease-in-out ${timeout}ms, mask-image 0s, background ${timeout}ms linear, opacity ${timeout}ms linear, height ${timeout}ms ease, max-height ${timeout}ms ease !important`,

			});
		}
	);



	//---


}