import { Box, styled, SxProps, Theme } from "@mui/material";
import clsx from "clsx";
import { Component, ReactNode } from "react";

import { $defaultAnimationDurationMs, adelay, arequestAnimationFrame } from "../core";






//===






const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export interface ExpanderProps
{

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






const ExpanderRoot = styled(
	Box,
	{
		shouldForwardProp: p => p !== "animated" && p !== "collapsed" && p !== "hlimited" && p !== "timeout",
	}
)<{
	animated: boolean;
	collapsed: boolean;
	hlimited: boolean;
	timeout?: number;
}>(
	({ animated, collapsed, hlimited, timeout }) =>
	{

		let timeout2 = `${timeout ?? $animationDurationMs}ms`;


		return ({

			position: "relative",
			//flex: 1,
			//gap: "inherit",
			//border: "4px solid gray",

			willChange: "height",
			height: "0px",


			"& > div": {
				display: "flex",
				gap: "inherit",
			},


			...animated && {

				//display: "flex",
				transition: `all ease-in-out ${timeout2}, mask-image 0s, background ${timeout2} linear, opacity ${timeout2} linear, height ${timeout2} ease, max-height ${timeout2} ease !important`,
				//opacity: 1,


			},


			...animated && collapsed && {
				height: 0,
				//opacity: .2,
			},


			...animated && hlimited && {
				maskImage: "linear-gradient(to top, rgba(0, 0, 0, .2), rgba(0, 0, 0, 1)  75%)",
			},

		});
	}
);






//===






export class Expander extends Component<ExpanderProps>
{

	//---



	private _el?: HTMLElement | null;
	private setEl = (a: HTMLElement | null) => this._el = a;

	private _el2?: HTMLElement | null;
	private setEl2 = (a: HTMLElement | null) => this._el2 = a;

	private collapsed = true;

	get expanded() { return this.props.expanded !== false; }


	_startHeight?: number | null;


	get currentHeight() { return (this._el2 || this._el)?.clientHeight; }



	//---



	get timeout() { return this.props.timeout ?? $animationDurationMs; }



	//---



	//toString()
	//{
	//	return componentToString(this);
	//}



	//---



	componentDidMount()
	{

		if (this._el && this.expanded)
		{
			this.setExpanded();
		}


		this._priorMaxHeight = this.props.maxHeight;

	}



	//@$logm
	async componentDidUpdate(prevProps: ExpanderProps)
	{

		//if (this._reexpanding)
		//	return;


		//this._reexpanding = true;


		let el = this._el;
		if (!el)
			return;


		//$log("el:", el);
		//$log("el2:", this._el2);


		let props = this.props;

		let expanded = this.expanded;
		let prevExpanded = prevProps.expanded !== false;

		//$log("expanded:", expanded);
		//$log("prevExpanded:", prevExpanded);

		//let startHeight = this._startHeight;


		//await adelay();


		//await $runAction(async () =>
		//{



		//$log("expanded:", expanded);
		//$log("startHeight:", startHeight);
		//$log("currentHeight:", this.currentHeight);
		//alert("Expander.componentDidUpdate");

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
			//if ((startHeight === 0 || startHeight !== this.currentHeight || this._priorMaxHeight !== props.maxHeight))
			//{

			if (props.animatedReexpand !== false)
			{
				await this.reexpand(this._startHeight!);
			}

			else if (this._priorMaxHeight !== props.maxHeight)
			{
				let maxHeight = props.maxHeight;
				el.style.maxHeight = maxHeight ? maxHeight + "px" : "9999px";
				el.style.overflow = maxHeight ? "hidden" : "visible";
			}

			//}

		}


		this._priorMaxHeight = props.maxHeight;

		//});


		//this._reexpanding = false;

	}



	//---



	//private _reexpanding?: boolean;
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



	private setExpanded = async () =>
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

		this.collapsed = false;

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

		this.collapsed = true;

		await new Promise(resolve => this.forceUpdate(resolve as any));

	}



	private setCollapsed = () =>
	{

		let el = this._el;

		if (!el)
			return;


		//$$logb("setCollapsed", () =>
		//{
		el.style.height = "0";
		el.style.maxHeight = null!;
		//$$log("set height", el.style.height);
		el.style.overflow = "hidden";
		//});

	};



	private onTransitionEnd = (e: React.TransitionEvent) =>
	{

		if (e.target !== this._el)
			return;


		//$$logb("onTransitionEnd:", () =>
		//{

		const { props } = this;


		if (e.propertyName !== "height")
			return;

		//$log(e);
		//$log("e.propertyName", e.propertyName);

		let expanded = this.expanded;

		expanded && this.setExpanded();


		props.onChange?.();


		if (expanded)
			props.onExpanded?.();
		else
			props.onCollapsed?.();

		//});
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



	//@$logm
	render()
	{

		let me = this;

		let { props } = this;


		let children: ReactNode = (
			props.children && (props.forceRender || this.expanded || !this.collapsed)
				? (typeof props.children === "function" ? (props.children as any)() : props.children)
				: null
		);


		if (this._el)
		{
			this._startHeight = this.currentHeight;
			//$log("set startHeight = currentHeight:", this._startHeight);
		}


		let style = props.sx;// ? { ...initialStyle, ...props.sx } as SxProps<Theme> : initialStyle;


		return <ExpanderRoot

			ref={me.setEl}

			animated={props.animated !== false}
			collapsed={!me.expanded}
			hlimited={!!props.maxHeight}
			timeout={props.timeout}

			className={clsx("layout-expander", props.className)}
			sx={style}

			onTransitionEnd={me.onTransitionEnd}

			children={<div ref={me.setEl2} children={children} />}

		/>;

	}



	//---

}
