import { createRef, type RefObject } from "react";

import type { Repaintable } from "../core";
import { ExpanderBaseBehavior, ExpanderBaseProps } from "./ExpanderBaseBehavior";






//===






export interface FlexExpanderProps extends ExpanderBaseProps
{
}




export module FlexExpanderProps
{
	export var propNames: Array<keyof FlexExpanderProps> = [
		//"maxHeight",
		...ExpanderBaseProps.propNames
	];
}




export class FlexExpanderBehavior<Props extends FlexExpanderProps = FlexExpanderProps> extends ExpanderBaseBehavior<Props>
{

	//---



	ref!: RefObject<HTMLDivElement>;
	flex: string | number | undefined;


	get el() { return this.ref.current; }



	//---



	use(
		ref: RefObject<HTMLDivElement> | null | undefined,
		flex: string | number | null | undefined,
		props: Props,
		cfg?: Repaintable.UseConfig
	)
	{

		this.ref = this.ref || ref || createRef<HTMLDivElement>();
		this.flex = flex || undefined;

		ExpanderBaseBehavior.use(this, props, cfg);

		return this;

	}



	//---



	getMaxSize() { return undefined; }


	getCurrentSize()
	{
		return this.flex;
	}



	//@$logm
	setSizes(
		overflow: "hidden" | "visible",
		flex: string | number | null | undefined,
		maxSize: string | number | null | undefined
	)
	{
		let { el } = this;
		if (!el) return;

		flex ??= this.flex;
		let maxHeight = flex && flex !== "0" ? "9999px" : "0";

		//$log("flex:", flex);
		//$log("maxHeight:", maxHeight)
		el.style.overflow = overflow;
		el.style.flex = flex + "";
		el.style.maxHeight = maxHeight;
	}


	onTransitionEnd = (e: React.TransitionEvent) =>
	{
		if (e.target !== this.el || e.propertyName !== "flex")
			return;

		this.endTransition();
	};



	//---

}
