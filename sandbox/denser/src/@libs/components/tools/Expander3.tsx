import { Box, styled } from "@mui/material";
import { Component, ReactNode, useLayoutEffect } from "react";

import { $defaultAnimationDurationMs, $log, $logm, adelay, arequestAnimationFrame, Repaintable, UseHookProps, useNew, Values } from "../core";
import { ExpanderProps } from "./Expander2";






//===






const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export function Expander(props: ExpanderProps)
{

	let bhv = useNew(Expander.Behavior).use(props);

	//$log("bhv.collapsed:", bhv.collapsed);

	let children: ReactNode = (
		props.children && (props.forceRender || bhv.expanded || !bhv.collapsed)
			? Values.one(props.children)
			: null
	);


	if (bhv._el)
	{
		bhv._startHeight = bhv.currentHeight;
		//$log("set startHeight = currentHeight:", this._startHeight);
	}



	return <Expander.Root

		ref={bhv.setEl}

		animated={props.animated !== false}
		hlimited={!!props.maxHeight}
		timeout={props.timeout}

		onTransitionEnd={bhv.onTransitionEnd}

		children={<div ref={bhv.setEl2} children={children} />}

	/>;

}






export module Expander
{


	//---



	export interface Props extends UseHookProps<ExpanderProps> 
	{

		/** default = true */
		expanded?: boolean;

		/** default = true */
		animated?: boolean;

		/** default = false */
		noreexpand?: boolean;

		forceRender?: boolean;

		maxHeight?: number | null;

		timeout?: number;

		onChange?: () => void;
		onCollapsed?: () => void;
		onExpanding?: () => void;
		onExpanded?: () => void;

		children?: React.ReactNode | (() => React.ReactNode);

	}



	//---



	export class Behavior extends Repaintable.Async()
	{

		//---


		props!: ExpanderProps;


		/*private*/ _el?: HTMLElement | null;
		/*private*/ setEl = (a: HTMLElement | null) => this._el = a;

		/*private*/ _el2?: HTMLElement | null;
		/*private*/ setEl2 = (a: HTMLElement | null) => this._el2 = a;

		/*private*/ collapsed!: boolean;

		get expanded() { return this.props.expanded !== false; }


		_startHeight?: number | null;


		get currentHeight() { return (this._el2 || this._el)?.clientHeight; }



		//---



		get timeout() { return this.props.timeout ?? $animationDurationMs; }



		//---



		//@$logm
		use(props: ExpanderProps, cfg?: Repaintable.UseConfig)
		{

			props = UseHookProps.use(props);

			Repaintable.use(this, cfg);


			let prevProps = this.props;
			this.props = props;


			if (!prevProps)
			{
				this.collapsed = !this.expanded;
			}


			useLayoutEffect(() =>
			{
				if (!prevProps)
					this.componentDidMount();
				else
					this.componentDidUpdate(prevProps);
			});


			return this;

		}


		//@$logm
		componentDidMount()
		{

			this.expanded ? this.setExpanded() : this.setCollapsed();

			this._priorMaxHeight = this.props.maxHeight;

		}



		//@$logm
		async componentDidUpdate(prevProps: Props)
		{

			let el = this._el;
			if (!el)
				return;


			let props = this.props;

			let expanded = this.expanded;
			let prevExpanded = prevProps.expanded !== false;


			if (!prevExpanded && expanded)
			{
				await this.expand();
			}
			else if (!expanded && prevExpanded)
			{
				await this.collapse();
			}
			else if (expanded && this._startHeight != null)
			{

				if (!props.noreexpand)
				{
					await this.reexpand(this._startHeight!);
				}

				else if (this._priorMaxHeight !== props.maxHeight)
				{
					let maxHeight = props.maxHeight;
					el.style.maxHeight = maxHeight ? maxHeight + "px" : "9999px";
					el.style.overflow = maxHeight ? "hidden" : "visible";
				}

			}


			this._priorMaxHeight = props.maxHeight;

		}



		//---



		private _reexpandIndex = 0;
		private _priorMaxHeight?: number | null;



		private getExpandedHeight(height: number, useNewMaxHeight: boolean)
		{

			let maxHeight = useNewMaxHeight ? this.props.maxHeight : this._priorMaxHeight;

			if (useNewMaxHeight)
			{
				this._priorMaxHeight = this.props.maxHeight;
			}

			if (maxHeight)
				height = Math.min(height, maxHeight);

			return height + "px";

		}



		//@$logm
		private async expand()
		{

			let el = this._el!;

			if (!el)
				return;


			this.collapsed = false;


			let ri = ++this._reexpandIndex;


			this.props.onExpanding?.();


			await arequestAnimationFrame(() =>
			{
				el.style.height = this.getExpandedHeight(this.currentHeight!, true);
				el.style.maxHeight = null!;
			});


			await adelay(this.timeout + 50);


			if (ri !== this._reexpandIndex)
				return;


			await this.setExpanded();

		}



		//@$logm
		private async setExpanded()
		{

			let el = this._el;
			let el2 = this._el2;

			if (!el || !el2)
				return;


			//await arequestAnimationFrame(() =>
			//{
			let maxHeight = this.props.maxHeight;

			el.style.height = "auto";
			el.style.maxHeight = maxHeight ? maxHeight + "px" : "9999px";
			el.style.overflow = maxHeight ? "hidden" : "visible";

			//});

		}



		//@$logm
		private async collapse()
		{

			let el = this._el!;

			if (!el)
				return;


			let ri = ++this._reexpandIndex;


			await arequestAnimationFrame(() =>
			{
				el.style.height = this.getExpandedHeight(this._startHeight ?? this.currentHeight!, false);
				el.style.maxHeight = null!;
				//$log("set height", el.style.height);
			});


			await arequestAnimationFrame(this.setCollapsed);


			if (ri !== this._reexpandIndex)
				return;


			await adelay(this.timeout);


			if (ri !== this._reexpandIndex)
				return;


			this._startHeight = null;

			//$log("collapsed = true");
			this.collapsed = true;


			await this.repaint();

		}



		private setCollapsed = () =>
		{

			let el = this._el;

			if (!el)
				return;


			el.style.height = "0";
			el.style.maxHeight = null!;
			el.style.overflow = "hidden";

		};



		/*private*/ onTransitionEnd = (e: React.TransitionEvent) =>
		{

			if (e.target !== this._el)
				return;


			const { props } = this;


			if (e.propertyName !== "height")
				return;


			let expanded = this.expanded;

			expanded ? this.setExpanded() : this.setCollapsed();


			props.onChange?.();


			if (expanded)
				props.onExpanded?.();
			else
				props.onCollapsed?.();

		};



		//---



		//@$logm
		private async reexpand(startHeight: number)
		{

			let el = this._el!;

			if (!el)
				return false;



			let ri = ++this._reexpandIndex;



			await arequestAnimationFrame(() =>
			{
				el.style.overflow = "hidden";
				el.style.height = this.getExpandedHeight(startHeight, false);
				el.style.maxHeight = null!;
				//$log("set height #1", el.style.height);
			});



			if (ri !== this._reexpandIndex)
				return false;



			await arequestAnimationFrame(() =>
			{
				this._startHeight = null;
				el.style.height = this.getExpandedHeight(this.currentHeight!, true);
				el.style.maxHeight = null!;
				//$log("set height #2", el.style.height);
			});


			await adelay(this.timeout);


			if (ri !== this._reexpandIndex)
				return false;



			await this.setExpanded();


			return true;

		}



		//---

	}




	//---



	export const Root = styled(
		Box,
		{
			shouldForwardProp: p => p !== "animated" && p !== "hlimited" && p !== "timeout",
		}
	)<{
		animated: boolean;
		hlimited: boolean;
		timeout?: number;
	}>(
		({ animated, hlimited, timeout }) =>
		{

			let timeout2 = `${timeout ?? $animationDurationMs}ms`;


			return ({

				position: "relative",

				willChange: "height",

				...animated && {
					transition: `all ease-in-out ${timeout2}, mask-image 0s, background ${timeout2} linear, opacity ${timeout2} linear, height ${timeout2} ease, max-height ${timeout2} ease !important`,
				},

				...animated && hlimited && {
					maskImage: "linear-gradient(to top, rgba(0, 0, 0, .2), rgba(0, 0, 0, 1)  75%)",
				},

			});
		}
	);



	//---


}