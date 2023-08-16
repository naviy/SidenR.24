import { createRef, ReactNode, RefObject, useLayoutEffect } from "react";

import { $defaultAnimationDurationMs, adelay, arequestAnimationFrame, Repaintable } from "../core";






//===





export interface FlexExpanderBaseProps
{

	/** default = true */
	expanded?: boolean;

	/** default = false */
	noreexpand?: boolean;

	forceRender?: boolean;

	maxSize?: number | string;

	timeout?: number;

	onExpanedChange?: () => void;
	onCollapsed?: () => void;
	onExpanding?: () => void;
	onExpanded?: () => void;

	children?: ReactNode;

}




export module ExpanderBaseProps
{

	export const propNames: Array<keyof FlexExpanderBaseProps> = [
		"expanded",
		"noreexpand", "forceRender", "maxSize", "timeout",
		"onExpanedChange", "onCollapsed", "onExpanding", "onExpanded",
	];

}






export class FlexExpanderBehavior<Props extends FlexExpanderBaseProps = FlexExpanderBaseProps> extends Repaintable.Async()
{

	//---


	props!: Readonly<Props>;

	ref!: RefObject<HTMLDivElement>;


	get el() { return this.ref.current; }
	get currentSize() { return (this.el)?.style.flex; }


	get expanded() { return this.props.expanded !== false; }
	get timeout() { return this.props.timeout ?? $defaultAnimationDurationMs; }

	private collapsed!: boolean;
	private _startSize?: number | string | null;


	get childrenShouldBeRendered()
	{
		return this.props.forceRender || !this.collapsed || this.expanded;
	}



	//---



	use(
		ref: RefObject<HTMLDivElement> | null | undefined,
		props: Props,
		cfg?: Repaintable.UseConfig
	)
	{

		Repaintable.use(this, cfg);

		this.ref = this.ref || ref || createRef<HTMLDivElement>();

		let prevProps = this.props;
		this.props = props;


		if (!prevProps)
		{
			this.collapsed = !this.expanded;
		}


		if (this.el)
		{
			this._startSize = this.currentSize;
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

		this._priorMaxSize = this.props.maxSize;

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
		else if (expanded && this._startSize != null)
		{

			if (!props.noreexpand)
			{
				await this.reexpand(this._startSize!);
			}

			else if (this._priorMaxSize !== props.maxSize)
			{
				let maxHeight = props.maxSize;
				el.style.maxHeight = maxHeight ? maxHeight + "px" : "9999px";
				el.style.overflow = maxHeight ? "hidden" : "visible";
			}

		}


		this._priorMaxSize = props.maxSize;

	}



	//---



	private _reexpandIndex = 0;
	private _priorMaxSize?: number | string;



	private getExpandedSize(size: number | string, useNewMaxHeight: boolean): string
	{

		let maxSize = useNewMaxHeight ? this.props.maxSize : this._priorMaxSize;

		if (useNewMaxHeight)
		{
			this._priorMaxSize = this.props.maxSize;
		}

		if (maxSize)
		{
			return (
				typeof size === "number" && typeof maxSize === "number"
					? Math.min(size, maxSize) + "px"
					: typeof maxSize === "number" ? maxSize + "px" : maxSize
			);
		}

		return typeof size === "number" ? size + "px" : size;

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
			el.style.height = this.getExpandedSize(this.currentSize!, true);
			el.style.maxHeight = null!;
		});


		await adelay(this.timeout + 50);


		if (ri !== this._reexpandIndex)
			return;


		await this.setExpanded();

	}



	private async setExpanded()
	{

		let { el } = this;
		if (!el) return;


		//await arequestAnimationFrame(() =>
		//{
		let maxSize = this.props.maxSize;

		el.style.height = "auto";
		el.style.maxHeight = maxSize ? maxSize + "px" : "9999px";
		el.style.overflow = maxSize ? "hidden" : "visible";
		//});

	}



	private async collapse()
	{

		let el = this.el!;
		if (!el) return;


		let ri = ++this._reexpandIndex;


		await arequestAnimationFrame(() =>
		{
			el.style.height = this.getExpandedSize(this._startSize ?? this.currentSize!, false);
			el.style.maxHeight = null!;
		});


		await arequestAnimationFrame(() => this.setCollapsed());


		if (ri !== this._reexpandIndex)
			return;


		await adelay(this.timeout);


		if (ri !== this._reexpandIndex)
			return;


		this._startSize = null;

		this.collapsed = true;


		await this.repaint();

	}



	private setCollapsed()
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
	private async reexpand(startHeight: number | string)
	{

		let el = this.el!;
		if (!el) return false;


		let ri = ++this._reexpandIndex;


		await arequestAnimationFrame(() =>
		{
			el.style.overflow = "hidden";
			el.style.height = this.getExpandedSize(startHeight, false);
			el.style.maxHeight = null!;
		});


		if (ri !== this._reexpandIndex)
			return false;


		await arequestAnimationFrame(() =>
		{
			this._startSize = null;
			el.style.height = this.getExpandedSize(this.currentSize!, true);
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
