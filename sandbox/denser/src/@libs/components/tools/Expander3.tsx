import { styled } from "@mui/material";
import { ReactNode, RefObject, useLayoutEffect, useRef } from "react";

import { $defaultAnimationDurationMs, adelay, arequestAnimationFrame, createPrimitive, Div, DivProps, Repaintable, UseHookProps, useNew, Values } from "../core";






//===






const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export function Expander(props: Expander.Props)
{

	props = UseHookProps.use(props);

	let bhv = useNew(Expander.Behavior).use(null, props.wrapperRef, props);


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

			animated: bhv.animated,
			hlimited: !!props.maxHeight,
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



	export interface Props extends DivProps, UseHookProps<Props> 
	{

		wrapperRef?: RefObject<HTMLDivElement>;
		wrapperCls?: string;

		/** default = true */
		expanded?: boolean;

		/** default = true */
		animated?: boolean;

		/** default = false */
		noreexpand?: boolean;

		forceRender?: boolean;

		maxHeight?: number | null;

		timeout?: number;

		onExpanedChange?: () => void;
		onCollapsed?: () => void;
		onExpanding?: () => void;
		onExpanded?: () => void;

	}


	export const propNames: Array<keyof Props> = [
		"expanded", "animated",
		"noreexpand", "forceRender", "maxHeight", "timeout",
		"onExpanedChange", "onCollapsed", "onExpanding", "onExpanded",

	];



	//---



	export class Behavior extends Repaintable.Async()
	{

		//---


		props!: Readonly<Props>;

		ref!: RefObject<HTMLDivElement>;
		wrapperRef!: RefObject<HTMLDivElement>;


		get el() { return this.ref.current; }
		get childrenEl() { return this.wrapperRef.current; }
		get currentHeight() { return (this.childrenEl || this.el)?.clientHeight; }


		get expanded() { return this.props.expanded !== false; }
		get timeout() { return this.props.timeout ?? $animationDurationMs; }

		get animated() { return this.props.animated !== false; }

		private collapsed!: boolean;
		private _startHeight?: number | null;


		get childrenShouldBeRendered()
		{
			return this.props.forceRender || !this.collapsed || this.expanded;
		}





		//---



		//@$logm
		use(
			ref: RefObject<HTMLDivElement> | null | undefined,
			wrapperRef: RefObject<HTMLDivElement> | null | undefined,
			props: Props,
			cfg?: Repaintable.UseConfig
		)
		{

			Repaintable.use(this, cfg);

			this.ref = ref || useRef<HTMLDivElement>(null);
			this.wrapperRef = wrapperRef || useRef<HTMLDivElement>(null);

			let prevProps = this.props;
			this.props = props;


			if (!prevProps)
			{
				this.collapsed = !this.expanded;
			}


			if (this.el)
			{
				this._startHeight = this.currentHeight;
				//$log("set startHeight = currentHeight:", this._startHeight);
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

			let el = this.el;
			if (!el) return;


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

			let el = this.el!;
			if (!el) return;


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

			let { el, childrenEl } = this;
			if (!el || !childrenEl) return;


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

			let el = this.el!;
			if (!el) return;


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

			let el = this.el;
			if (!el) return;


			el.style.height = "0";
			el.style.maxHeight = null!;
			el.style.overflow = "hidden";

		};



		/*private*/ onTransitionEnd = (e: React.TransitionEvent) =>
		{

			if (e.target !== this.el)
				return;


			const { props } = this;


			if (e.propertyName !== "height")
				return;


			let expanded = this.expanded;

			expanded ? this.setExpanded() : this.setCollapsed();


			props.onExpanedChange?.();


			if (expanded)
				props.onExpanded?.();
			else
				props.onCollapsed?.();

		};



		//---



		//@$logm
		private async reexpand(startHeight: number)
		{

			let el = this.el!;
			if (!el) return false;


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



		//renderRoot(wrapper: ReactNode)
		//{

		//	let { props } = this;


		//	let body = createPrimitive(
		//		Expander.Root,
		//		{
		//			ref: this.ref,
		//			animated: props.animated !== false,
		//			hlimited: !!props.maxHeight,
		//			timeout: props.timeout,
		//			onTransitionEnd: this.onTransitionEnd,
		//			children: wrapper,
		//		},
		//		this.props,
		//		propNames
		//	);


		//	return body;

		//}


		//renderWrapper(children: ReactNode)
		//{
		//	return <div
		//		ref={this.wrapperRef}
		//		className={this.props.wrapperCls}
		//		children={children}
		//	/>;
		//}


		//renderChildren(): ReactNode
		//{

		//	let { props } = this;

		//	return (
		//		props.children && (props.forceRender || !this.collapsed || this.expanded)
		//			? Values.one(props.children)
		//			: null
		//	);

		//}



		//---

	}



	//---



	export const Root = styled(
		Div,
		{
			shouldForwardProp: p => p !== "animated" && p !== "hlimited" && p !== "timeout",
		}
	)<{
		animated: boolean;
		hlimited: boolean;
		timeout: number;
	}>(
		({ animated, hlimited, timeout }) =>
		{

			return ({

				position: "relative",

				willChange: "height",

				...animated && {
					transition: `all ease-in-out ${timeout}ms, mask-image 0s, background ${timeout}ms linear, opacity ${timeout}ms linear, height ${timeout}ms ease, max-height ${timeout}ms ease !important`,
				},

				...animated && hlimited && {
					maskImage: "linear-gradient(to top, rgba(0, 0, 0, .2), rgba(0, 0, 0, 1)  75%)",
				},

			});
		}
	);



	//---


}