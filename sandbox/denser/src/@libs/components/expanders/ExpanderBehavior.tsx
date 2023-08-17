import { createRef, RefObject } from "react";

import { ExpanderBaseBehavior, ExpanderBaseProps } from "./ExpanderBaseBehavior";






//===




export interface ExpanderProps extends ExpanderBaseProps
{
	maxHeight?: number | string;
}



export module ExpanderProps
{
	export const propNames: Array<keyof ExpanderProps> = [
		"maxHeight",
		...ExpanderBaseProps.propNames
	];
}




export class ExpanderBehavior<Props extends ExpanderProps = ExpanderProps> extends ExpanderBaseBehavior<Props>
{

	//---



	ref!: RefObject<HTMLDivElement>;
	wrapperRef!: RefObject<HTMLDivElement>;


	get el() { return this.ref.current; }
	get wrapperEl() { return this.wrapperRef.current; }



	//---



	use(
		ref: RefObject<HTMLDivElement> | null | undefined,
		wrapperRef: RefObject<HTMLDivElement> | null | undefined,
		props: Props,
		cfg?: ExpanderBaseBehavior.UseConfig
	)
	{

		this.ref = this.ref || ref || createRef<HTMLDivElement>();
		this.wrapperRef = this.wrapperRef || wrapperRef || createRef<HTMLDivElement>();

		ExpanderBaseBehavior.use(this, props, cfg);

		return this;

	}



	//---



	getMaxSize() { return this.props.maxHeight; }


	getCurrentSize()
	{
		return (this.wrapperEl || this.el)?.clientHeight;
	}


	setSizes(
		overflow: "hidden" | "visible",
		size: string | null | undefined,
		maxSize: string | null | undefined
	)
	{
		let { el } = this;
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




