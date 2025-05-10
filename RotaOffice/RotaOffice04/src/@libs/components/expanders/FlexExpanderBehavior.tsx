import { type RefObject } from "react";

import type { Repaintable } from "../core";
import { ExpanderBaseBehavior, ExpanderBaseProps } from "./ExpanderBaseBehavior";






//===






export interface FlexExpanderProps extends ExpanderBaseProps
{
}




export module FlexExpanderProps
{
	export var propNames: PropNames<FlexExpanderProps> =
	{
		...ExpanderBaseProps.propNames
	};
}




export class FlexExpanderBehavior<P extends FlexExpanderProps = FlexExpanderProps> extends ExpanderBaseBehavior<P>
{

	//---



	elRef: RefObject<HTMLDivElement> = null!;
	flex: string | number | undefined;


	get el() { return this.elRef.current; }



	//---



	use(
		elRef: RefObject<HTMLDivElement>,
		flex: string | number | null | undefined,
		props: P,
		cfg?: Repaintable.UseConfig
	)
	{

		this.elRef = elRef;
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
