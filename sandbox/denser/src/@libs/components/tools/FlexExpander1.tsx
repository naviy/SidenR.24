import { styled } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

import { $defaultAnimationDurationMs, DivProps, UseHookProps, Values, createPrimitive } from "../core";






//===






const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export function FlexExpander(props: FlexExpander.Props)
{

	props = UseHookProps.use(props);

	let { l } = props;
	let propExpanded = props.expanded !== false;
	let timeout = props.timeout ?? $animationDurationMs;


	let elRef = useRef<HTMLDivElement>(null);

	let [expanded, setExpanded] = useState(propExpanded);
	let [transitionStep, setTransitionStep] = useState(0);

	useEffect(
		() =>
		{
			if (propExpanded !== expanded)
			{
				setExpanded(propExpanded);
				setTransitionStep(transitionStep + 1);
			}
		},
		[expanded, propExpanded, transitionStep]
	);



	let flex = !expanded ? 0 : l == null || l >= 0 && l <= 24 ? l || 1 : `0 0 ${l}px`;
	//_$log("flex:", flex);
	let overflow = expanded !== propExpanded || transitionStep ? "hidden" : "visible";
	//_$log("overflow:", overflow);


	let body: ReactNode = (expanded || propExpanded || !!transitionStep) && Values.one(props.children);


	body = createPrimitive(
		FlexExpander.Root,
		{

			ref: elRef,

			flex,
			overflow,
			timeout,

			onTransitionEnd: (e: any) =>
			{
				if (e.target !== elRef.current || e.propertyName !== "flex")
					return;

				setTransitionStep(0);

			},

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



	export interface Props extends DivProps, UseHookProps<Props> 
	{

		/** default = true */
		expanded?: boolean;

		l?: number;

		forceRender?: boolean;

		timeout?: number;

		children?: React.ReactNode;

	}


	export const propNames: Array<keyof Props> = [
		"expanded", "l", "forceRender", "timeout",
		...UseHookProps.propNames
	];



	//---



	export const Root = styled(
		"div",
		{
			name: "flex-expander",
			shouldForwardProp: p => p !== "flex" && p !== "overflow" && p !== "timeout"
		}
	)<{
		flex: number | string;
		overflow: string;
		timeout: number;
	}>(props =>
	({

		flex: props.flex,
		overflow: props.overflow,

		position: "relative",
		display: "inherit",
		flexDirection: "inherit",
		gap: "inherit",

		transition: `all ease-in-out ${props.timeout}ms !important`,

	}))



	//---


}