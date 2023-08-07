import { Box, styled, SxProps, Theme } from "@mui/material";
import clsx from "clsx";
import { Component, ReactNode, useEffect, useRef, useState } from "react";

import { $defaultAnimationDurationMs, $log, adelay, arequestAnimationFrame, Values, _$log, __$log, ___$log } from "../core";






//===






const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export interface Expander2Props
{

	id?: string;

	className?: string;
	sx?: SxProps<Theme>;

	/** default = true */
	expanded?: boolean;

	/** default = true */
	animated?: boolean;

	/** default = true */
	animatedReexpand?: boolean;

	forceRender?: boolean;

	maxHeight?: number | null;

	timeout?: number;

	//focusabler?: FlowFocuser.Focuser;
	//pane?: boolean | PaneProps;

	onChange?: () => void;
	onCollapsed?: () => void;
	onExpanding?: () => void;
	onExpanded?: () => void;

	children?: React.ReactNode | (() => React.ReactNode);

}






//===






export function Expander2(props: Expander2Props)
{

	//alert(`Expander #${props.id}`)
	$log(`Expander #${props.id}`)

	let elRef = useRef<HTMLDivElement>(null);

	let propExpanded = props.expanded !== false

	let timeout = `${props.timeout ?? $animationDurationMs}ms`;


	let [expanded, setExpanded] = useState(propExpanded);
	let [transitionStep, setTransitionStep] = useState<0 | 1 | 2 | 3>(0);

	let stateRef = useRef<{ wasRendered?: boolean; priorHeight?: number; targetHeight?: number; }>({});
	let state = stateRef.current;


	_$log("propExpanded:", propExpanded);
	_$log("expanded:", expanded);
	_$log("transitionStep:", transitionStep);


	useEffect(
		() =>
		{

			if (propExpanded !== expanded)
			{
				setExpanded(propExpanded);
				__$log(`expanded = ${propExpanded}`)

				setTransitionStep(1);
				__$log("transitionStep = 1")
			}
			else if (transitionStep === 1 || transitionStep === 2)
			{
				setTransitionStep(3);
				__$log("transitionStep = 3")
			}
			else if (!transitionStep)
			{
				state.priorHeight = scrollHeight;
				state.targetHeight = undefined;
				__$log(`priorHeight = ${state.priorHeight}`)
			}
		},
		[expanded, propExpanded, transitionStep]
	);



	let clientHeight = elRef.current?.clientHeight || 0;
	let scrollHeight = elRef.current?.scrollHeight || 0;


	_$log("priorHeight:", state.priorHeight);
	_$log("targetHeight:", state.targetHeight);
	_$log("clientHeight:", clientHeight);
	_$log("scrollHeight:", scrollHeight);


	useEffect(
		() =>
		{
			let scrollHeight = elRef.current?.scrollHeight || 0;
			__$log("scrollHeight:", scrollHeight);
			if (
				expanded && propExpanded && !transitionStep &&
				(state.priorHeight !== scrollHeight || state.targetHeight !== undefined && state.targetHeight !== scrollHeight)
			)
			{
				setTransitionStep(2);
				__$log("transitionStep = 2")
				state.targetHeight = scrollHeight;
			}
			//state.lastHeight = scrollHeight;
			//__$log("lastHeight = ", state.lastHeight);
		}
	);


	let height = (
		expanded
			? transitionStep === 2
				? state.priorHeight
				: transitionStep
					? state.targetHeight ?? scrollHeight
					: "auto"
			: transitionStep === 1
				? scrollHeight
				: 0
	);
	_$log("height:", height);

	return <Box

		ref={elRef}

		sx={{
			height,
			overflow: expanded !== propExpanded || transitionStep ? "hidden" : "visible",
			transition: `all ease-in-out ${timeout}, mask-image 0s, background ${timeout} linear, opacity ${timeout} linear, height ${timeout} ease, max-height ${timeout} ease !important`,
		}}

		onTransitionEnd={e =>
		{
			if (e.target !== elRef.current || e.propertyName !== "height")
				return;

			$log("onTransitionEnd");
			_$log("transitionStep = 0")
			setTransitionStep(0);
			state.targetHeight = undefined;
			$log("targetHeight = undefined")

		}}

		children={(expanded || propExpanded || !!transitionStep) && Values.one(props.children)}

	/>;


}
