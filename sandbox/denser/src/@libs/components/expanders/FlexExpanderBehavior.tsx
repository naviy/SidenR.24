import { createRef, RefObject } from "react";

import { Repaintable } from "../core";
import { ExpanderBaseBehavior, ExpanderBaseProps } from "./ExpanderBaseBehavior";






//===






export interface FlexExpanderProps extends ExpanderBaseProps
{
}




export module FlexExpanderProps
{
	export const propNames: Array<keyof FlexExpanderProps> = [
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



	setSizes(
		overflow: "hidden" | "visible",
		flex: string | null | undefined
	)
	{
		let { el } = this;
		if (!el) return;

		el.style.overflow = overflow;
		el.style.flex = flex == null ? this.flex + '' : flex + '';
	}


	onTransitionEnd = (e: React.TransitionEvent) =>
	{
		if (e.target !== this.el || e.propertyName !== "flex")
			return;

		this.endTransition();
	};



	//---

}
