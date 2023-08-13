import { ReactNode, RefObject, useLayoutEffect, useRef } from "react";

import { $defaultAnimationDurationMs, $log, adelay, arequestAnimationFrame, Repaintable } from "../core";






//===





export interface ExpanderBaseProps
{

	/** default = true */
	expanded?: boolean;

	/** default = false */
	noreexpand?: boolean;

	forceRender?: boolean;

	maxHeight?: number | string;

	timeout?: number;

	onExpanedChange?: () => void;
	onCollapsed?: () => void;
	onExpanding?: () => void;
	onExpanded?: () => void;

	children?: ReactNode;

}




export module ExpanderBaseProps
{

	export const propNames: Array<keyof ExpanderBaseProps> = [
		"expanded",
		"noreexpand", "forceRender", "maxHeight", "timeout",
		"onExpanedChange", "onCollapsed", "onExpanding", "onExpanded",
	];

}






export class ExpanderBehavior<Props extends ExpanderBaseProps = ExpanderBaseProps> extends Repaintable.Async()
{

	//---


	props!: Readonly<Props>;

	ref!: RefObject<HTMLDivElement>;
	wrapperRef!: RefObject<HTMLDivElement>;


	get el() { return this.ref.current; }
	get wrapperEl() { return this.wrapperRef.current; }
	get currentHeight() { return (this.wrapperEl || this.el)?.clientHeight; }


	get expanded() { return this.props.expanded !== false; }
	get timeout() { return this.props.timeout ?? $defaultAnimationDurationMs; }

	private collapsed!: boolean;
	private _startHeight?: number | null;


	get childrenShouldBeRendered()
	{
		return this.props.forceRender || !this.collapsed || this.expanded;
	}



	//---



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



	componentDidMount()
	{

		this.expanded ? this.setExpanded() : this.setCollapsed();

		this._priorMaxHeight = this.props.maxHeight;

	}



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
	private _priorMaxHeight?: number | string;



	private getExpandedHeight(height: number, useNewMaxHeight: boolean): string
	{

		let maxHeight = useNewMaxHeight ? this.props.maxHeight : this._priorMaxHeight;

		if (useNewMaxHeight)
		{
			this._priorMaxHeight = this.props.maxHeight;
		}

		if (maxHeight)
		{
			return typeof maxHeight === "number" ? Math.min(height, maxHeight) + "px" : maxHeight;
		}

		return height + "px";

	}



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



	private async setExpanded()
	{

		let { el, wrapperEl } = this;
		if (!el || !wrapperEl) return;


		//await arequestAnimationFrame(() =>
		//{
		let maxHeight = this.props.maxHeight;

		el.style.height = "auto";
		el.style.maxHeight = maxHeight ? maxHeight + "px" : "9999px";
		el.style.overflow = maxHeight ? "hidden" : "visible";
		//});

	}



	private async collapse()
	{

		let el = this.el!;
		if (!el) return;


		let ri = ++this._reexpandIndex;


		await arequestAnimationFrame(() =>
		{
			el.style.height = this.getExpandedHeight(this._startHeight ?? this.currentHeight!, false);
			el.style.maxHeight = null!;
		});


		await arequestAnimationFrame(this.setCollapsed);


		if (ri !== this._reexpandIndex)
			return;


		await adelay(this.timeout);


		if (ri !== this._reexpandIndex)
			return;


		this._startHeight = null;

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



	onTransitionEnd = (e: React.TransitionEvent) =>
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
		});


		if (ri !== this._reexpandIndex)
			return false;


		await arequestAnimationFrame(() =>
		{
			this._startHeight = null;
			el.style.height = this.getExpandedHeight(this.currentHeight!, true);
			el.style.maxHeight = null!;
		});


		await adelay(this.timeout);


		if (ri !== this._reexpandIndex)
			return false;


		await this.setExpanded();

		return true;

	}



	//---

}
