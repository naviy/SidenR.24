import React, { ReactNode, RefObject, createRef, useEffect, useRef, useState } from "react";
import { styled } from "@mui/material";

import { $defaultAnimationDurationMs, DivProps, Repaintable, UseHookProps, Values, createPrimitive, useNew } from "../core";






//===






export function FlexExpander(props: FlexExpander.Props)
{

	props = UseHookProps.use(props);

	let bhv = useNew(FlexExpander.Behavior).use(null, props);


	let { l } = props;


	let flex = !bhv.expanded ? 0 : l == null || l >= 0 && l <= 24 ? l || 1 : `0 0 ${l}px`;
	//_$log("flex:", flex);
	let overflow = bhv.expanded || bhv.transitionStep ? "hidden" : "visible";
	//_$log("overflow:", overflow);

	let body: ReactNode = (bhv.expanded || !!bhv.transitionStep || props.forceRender) && Values.one(props.children);


	body = createPrimitive(
		FlexExpander.Root,
		{
			ref: bhv.ref,
			flex,
			overflow,
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



	export interface Props extends DivProps, UseHookProps<Props> 
	{

		/** default = true */
		expanded?: boolean;

		l?: number;

		forceRender?: boolean;

		timeout?: number;

		onExpanedChange?: () => void;
		onCollapsed?: () => void;
		onExpanding?: () => void;
		onExpanded?: () => void;

		children?: React.ReactNode;

	}


	export const propNames: Array<keyof Props> = [
		"expanded", "l", "forceRender", "timeout",
		"onExpanedChange", "onCollapsed", "onExpanding", "onExpanded",
		...UseHookProps.propNames
	];



	//---



	export class Behavior extends Repaintable()
	{

		//---



		props!: Readonly<Props>;

		ref!: RefObject<HTMLDivElement>;
		get el() { return this.ref.current; }


		get expanded() { return this.props.expanded !== false; }
		transitionStep = 0;
		get timeout() { return this.props.timeout ?? $defaultAnimationDurationMs; }

		private collapsed!: boolean;



		//---



		use(
			ref: RefObject<HTMLDivElement> | null | undefined,
			props: Props,
			cfg?: Repaintable.UseConfig
		)
		{

			let prevProps = this.props;
			this.props = props;

			Repaintable.use(this, cfg);

			this.ref = this.ref || ref || createRef<HTMLDivElement>();


			useEffect(
				() =>
				{
					if (prevProps?.expanded !== this.props.expanded)
					{
						this.transitionStep++;

							this.repaint();
					}
				},
				[props.expanded, prevProps?.expanded, this.transitionStep]
			);


			return this;

		}



		//---



		onTransitionEnd = (e: React.TransitionEvent) =>
		{
			if (e.target !== this.el || e.propertyName !== "flex")
				return;

			this.transitionStep = 0;


			this.props.onExpanedChange?.();


			if (this.expanded)
				this.props.onExpanded?.();
			else
				this.props.onCollapsed?.();


			this.repaint();
		}



		//---

	}



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