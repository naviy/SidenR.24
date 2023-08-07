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
	let childrenRef = useRef<HTMLDivElement>(null);

	let propExpanded = props.expanded !== false

	let timeout = `${props.timeout ?? $animationDurationMs}ms`;


	let [expanded, setExpanded] = useState(propExpanded);
	let [transitionStep, setTransitionStep] = useState<0 | 1 | 2>(0);

	let stateRef = useRef<{ childrenHeight?: number; }>({});
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
			else if (transitionStep === 1)
			{
				setTransitionStep(2);
				__$log("transitionStep = 2")
			}
			//	else if (!transitionStep)
			//	{
			//		state.priorHeight = scrollHeight;
			//		state.targetHeight = undefined;
			//		__$log(`priorHeight = ${state.priorHeight}`)
			//	}
		},
		[expanded, propExpanded, transitionStep]
	);



	//let clientHeight = elRef.current?.clientHeight || 0;
	//let childrenHeight = childrenRef.current?.clientHeight;


	//_$log("priorHeight:", state.priorHeight);
	//_$log("targetHeight:", state.targetHeight);
	_$log("childrenHeight:", state.childrenHeight);
	//_$log("scrollHeight:", scrollHeight);


	useEffect(
		() =>
		{
			let childrenHeight = childrenRef.current?.clientHeight || 0;
			__$log("childrenHeight:", childrenHeight);
			if (
				expanded && propExpanded && !transitionStep &&
				(state.childrenHeight !== childrenHeight)
			)
			{
				setTransitionStep(1);
				__$log("transitionStep = 1")
				//state.targetHeight = scrollHeight;
			}
			state.childrenHeight = childrenHeight;
			__$log(`childrenHeight = ${state.childrenHeight}`)

			//state.lastHeight = scrollHeight;
			//__$log("lastHeight = ", state.lastHeight);
		}
	);


	let height = expanded ? state.childrenHeight || 0 : 0;
	_$log("height:", height);


	let body: ReactNode = (expanded || propExpanded || !!transitionStep) && Values.one(props.children);


	body = <div ref={childrenRef}>{body}</div>


	body = <Box

		ref={elRef}

		sx={{
			height,
			overflow: "hidden",
			//overflow: !expanded || !propExpanded || transitionStep ? "hidden" : "visible",
			transition: `all ease-in-out ${timeout}, mask-image 0s, background ${timeout} linear, opacity ${timeout} linear, height ${timeout} ease, max-height ${timeout} ease !important`,
		}}

		onTransitionEnd={e =>
		{
			if (e.target !== elRef.current || e.propertyName !== "height")
				return;

			$log("onTransitionEnd");
			_$log("transitionStep = 0")
			setTransitionStep(0);

		}}

		children={body}

	/>;


	return body;

}
