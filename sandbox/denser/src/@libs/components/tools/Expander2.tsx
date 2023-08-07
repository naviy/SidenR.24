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

	let animatedReexpand = props.animatedReexpand !== false;
	let propExpanded = props.expanded !== false


	let elRef = useRef<HTMLDivElement>(null);
	let childrenRef = useRef<HTMLDivElement>(null);


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
			$log(`Expander #${props.id}.useEffect 1`)

			if (propExpanded !== expanded)
			{
				setExpanded(propExpanded);
				_$log(`expanded = ${propExpanded}`)

				setTransitionStep(1);
				_$log("transitionStep = 1")
			}
			else if (transitionStep === 1 && !animatedReexpand)
			{
				setTransitionStep(2);
				_$log("transitionStep = 2")
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
			$log(`Expander #${props.id}.useEffect 2`)

			let childrenHeight = childrenRef.current?.clientHeight || 0;
			_$log("childrenHeight:", childrenHeight);
			if (
				animatedReexpand &&
				expanded && propExpanded && !transitionStep &&
				(state.childrenHeight !== childrenHeight)
			)
			{
				setTransitionStep(1);
				_$log("transitionStep = 1")
				//state.targetHeight = scrollHeight;
			}
			state.childrenHeight = childrenHeight;
			_$log(`childrenHeight = ${state.childrenHeight}`)

			//state.lastHeight = scrollHeight;
			//__$log("lastHeight = ", state.lastHeight);
		}
	);


	let height = (
		animatedReexpand
			? expanded ? state.childrenHeight || 0 : 0
			: expanded
				? transitionStep
					? state.childrenHeight
					: "auto"
				: transitionStep === 1
					? state.childrenHeight
					: 0
	);
	_$log("height:", height);


	let body: ReactNode = (expanded || propExpanded || !!transitionStep) && Values.one(props.children);


	body = <div ref={childrenRef}>{body}</div>


	body = <Box

		ref={elRef}

		sx={{
			height,
			overflow: "hidden",
			//overflow: !expanded || !propExpanded || animatedReexpand && transitionStep /*state.childrenHeight !== childrenRef.current?.clientHeight*/
			//	? "hidden"
			//	: "visible"
			//,
			transition: `all ease-in-out ${timeout}, mask-image 0s, background ${timeout} linear, opacity ${timeout} linear, height ${timeout} ease, max-height ${timeout} ease !important`,
		}}

		onTransitionEnd={e =>
		{
			if (e.target !== elRef.current || e.propertyName !== "height")
				return;

			$log(`Expander #${props.id}.onTransitionEnd`)
			_$log("transitionStep = 0")
			setTransitionStep(0);

		}}

		children={body}

	/>;


	return body;

}
