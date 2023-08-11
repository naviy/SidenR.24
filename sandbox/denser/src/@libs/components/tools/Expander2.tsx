import { Box, SxProps, Theme } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";

import { $defaultAnimationDurationMs, UseHookProps, Values } from "../core";






//===






const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export interface ExpanderProps extends UseHookProps<ExpanderProps> 
{

	id?: string;

	className?: string;
	sx?: SxProps<Theme>;

	/** default = true */
	expanded?: boolean;

	/** default = true */
	animated?: boolean;

	/** default = true */
	noreexpand?: boolean;

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






export function Expander(props: ExpanderProps)
{

	props = UseHookProps.use(props);

	//alert(`Expander #${props.id}`)
	//$log(`Expander #${props.id}`)

	let noreexpand = !!props.noreexpand;
	let propExpanded = props.expanded !== false


	let elRef = useRef<HTMLDivElement>(null);
	let childrenRef = useRef<HTMLDivElement>(null);


	let timeout = `${props.timeout ?? $animationDurationMs}ms`;


	let [expanded, setExpanded] = useState(propExpanded);
	let [transitionStep, setTransitionStep] = useState(0);

	let stateRef = useRef<{ childrenHeight?: number; }>({});
	let state = stateRef.current;


	//_$log("propExpanded:", propExpanded);
	//_$log("expanded:", expanded);
	//_$log("transitionStep:", transitionStep);


	useEffect(
		() =>
		{
			//$log(`Expander #${props.id}.useEffect 1`)

			if (propExpanded !== expanded)
			{
				setExpanded(propExpanded);
				//_$log(`expanded = ${propExpanded}`)

				setTransitionStep(transitionStep + 1);
				//_$log("transitionStep = 1")
			}
			else if (transitionStep === 1 && noreexpand)
			{
				setTransitionStep(2);
				//_$log("transitionStep = 2")
			}

		},
		[expanded, propExpanded, transitionStep]
	);



	//_$log("childrenHeight:", state.childrenHeight);


	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(
		() =>
		{
			//$log(`Expander #${props.id}.useEffect 2`)

			let childrenHeight = childrenRef.current?.scrollHeight || 0;
			//_$log("childrenHeight:", childrenHeight);
			if (
				!noreexpand &&
				(expanded || propExpanded) &&
				(state.childrenHeight !== childrenHeight)
			)
			{
				setTransitionStep(transitionStep + 1);
				//_$log(`transitionStep = ${transitionStep + 1}`);
			}
			state.childrenHeight = childrenHeight;
			//_$log(`childrenHeight = ${state.childrenHeight}`)
		}
	);


	//let childrenHeight = (
	//	childrenRef.current?.scrollHeight ??
	//	(expanded && propExpanded && !transitionStep ? "auto" : 0)
	//);


	let childrenHeight = childrenRef.current?.scrollHeight;


	//let height = (
	//	!noreexpand
	//		? expanded ? childrenHeight : 0
	//		: expanded
	//			? transitionStep
	//				? childrenHeight
	//				: "auto"
	//			: transitionStep === 1
	//				? childrenHeight
	//				: 0
	//);


	let height = (
		expanded
			? transitionStep
				? childrenHeight ?? 0
				: "auto"
			: transitionStep === 1
				? childrenHeight ?? "auto"
				: 0
	);
	//_$log("height:", height);


	let overflow = (!noreexpand
		? "hidden"
		: expanded !== propExpanded || transitionStep || state.childrenHeight !== childrenRef.current?.scrollHeight ? "hidden" : "visible"
	);
	//_$log("overflow:", overflow);


	let body: ReactNode = (expanded || propExpanded || !!transitionStep) && Values.one(props.children);


	body = <div ref={childrenRef}>{body}</div>


	body = <Box

		ref={elRef}

		style={{
			height,
			overflow,
		}}

		sx={{
			transition: `all ease-in-out ${timeout}, mask-image 0s, background ${timeout} linear, opacity ${timeout} linear, height ${timeout} ease, max-height ${timeout} ease !important`,
		}}

		onTransitionEnd={e =>
		{
			if (e.target !== elRef.current || e.propertyName !== "height")
				return;

			//$log(`Expander #${props.id}.onTransitionEnd`)
			//_$log("transitionStep = 0")
			setTransitionStep(0);

		}}

		children={body}

	/>;


	return body;

}
