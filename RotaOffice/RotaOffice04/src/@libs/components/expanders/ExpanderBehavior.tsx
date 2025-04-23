import { createRef, type RefObject } from "react";

import { ExpanderBaseBehavior, ExpanderBaseProps } from "./ExpanderBaseBehavior";
import { $log } from "../core";
//import { $log } from "../core/utils/$log";






//===






export interface ExpanderProps extends ExpanderBaseProps
{
	maxHeight?: number | string;
}



export module ExpanderProps
{

	export var propNames: PropNames<ExpanderProps> =
	{

		maxHeight: true,

		...ExpanderBaseProps.propNames

	};

}






export class ExpanderBehavior<Props extends ExpanderProps = ExpanderProps>
	extends ExpanderBaseBehavior<Props>
{


	//---



	elRef: RefObject<HTMLDivElement> = null!;
	wrapperRef: RefObject<HTMLDivElement> = null!;


	get el() { return this.elRef.current; }
	get wrapperEl() { return this.wrapperRef.current; }



	//---



	use(
		elRef: RefObject<HTMLDivElement>,
		wrapperRef: RefObject<HTMLDivElement> | undefined,
		props: Props,
		cfg?: ExpanderBaseBehavior.UseConfig
	)
	{

		//return $log.b(this + ".use()", () =>
		//{
		//	$log("elRef:", elRef);
		//	$log("wrapperRef:", wrapperRef);
			this.elRef = elRef;
			this.wrapperRef = wrapperRef || createRef<HTMLDivElement>();

			ExpanderBaseBehavior.use(this, props, cfg);

			return this;
		//})!;

	}



	//---



	getMaxSize() { return this.props.maxHeight; }


	getCurrentSize()
	{
		return (
			((this.wrapperEl || this.el)?.clientHeight || 0) +
			(this.expanded ? this.props.addExpandedHeight || 0 : !this.collapsed ? this.priorAddExpandedHeight || 0 : 0)
		);
	}


	//@$log.m({ filter: (bhv: ExpanderBehavior) => bhv.props.id === "ValueFader" })
	setSizes(
		overflow: "hidden" | "visible",
		size: string | null | undefined,
		maxSize: string | null | undefined
	)
	{
		let { el } = this;
		//$log("el:", el)
		if (!el) return;

		el.style.overflow = overflow;
		el.style.height = size == null ? "auto" : typeof size === "number" ? size + "px" : size;
		el.style.maxHeight = maxSize || null!;
	}


	onTransitionEnd = (e: React.TransitionEvent) =>
	{
		if (e.target !== this.el || e.propertyName !== "height")
			return;

		this.endTransition();
	};



	//---


}




