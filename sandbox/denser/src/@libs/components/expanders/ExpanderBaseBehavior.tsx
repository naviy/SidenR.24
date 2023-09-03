import { ReactNode, useLayoutEffect } from "react";

import { $defaultAnimationDurationMs, adelay, arequestAnimationFrame, Repaintable } from "../core";






//===





export interface ExpanderBaseProps
{

	/** default = true */
	expanded?: boolean;

	/** default = false */
	noreexpand?: boolean;

	forceRender?: boolean;

	//maxSize?: number | string;

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
		"noreexpand", "forceRender", "timeout",
		"onExpanedChange", "onCollapsed", "onExpanding", "onExpanded",
	];

}






export abstract class ExpanderBaseBehavior<Props extends ExpanderBaseProps = ExpanderBaseProps> extends Repaintable.Async()
{

	//---



	props!: Readonly<Props>;


	get expanded() { return this.props.expanded !== false; }
	get timeout() { return this.props.timeout ?? $defaultAnimationDurationMs; }

	collapsed!: boolean;
	private _startSize?: string | number | null;


	get childrenShouldBeRendered()
	{
		return this.props.forceRender || !this.collapsed || this.expanded;
	}



	//---



	abstract getMaxSize(): string | number | undefined;

	abstract getCurrentSize(): string | number | undefined;

	abstract setSizes(
		overflow: "hidden" | "visible",
		size: string | number | null | undefined,
		maxSize: string | number | null | undefined
	): void;



	//---



	static use<Props extends ExpanderBaseProps>(
		me: ExpanderBaseBehavior<Props>,
		props: Props,
		cfg?: ExpanderBaseBehavior.UseConfig
	)
	{

		Repaintable.use(me, cfg);

		let prevProps = me.props;
		me.props = props;


		if (!prevProps)
		{
			me.collapsed = !me.expanded;
		}


		me._startSize = me.getCurrentSize();


		useLayoutEffect(() =>
		{
			if (!prevProps)
				me.componentDidMount();
			else
				me.componentDidUpdate(prevProps);
		});

	}



	//---



	componentDidMount()
	{

		this.expanded ? this.setExpanded() : this.setCollapsed();

		this._priorMaxSize = this.getMaxSize();

	}



	async componentDidUpdate(prevProps: Props)
	{

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
				await this.reexpand();
			}

			else if (this._priorMaxSize !== this.getMaxSize())
			{
				this.setExpanded();
			}

		}


		this._priorMaxSize = this.getMaxSize();

	}



	//---



	private _reexpandIndex = 0;
	private _priorMaxSize?: string | number;



	private getExpandedSize(size: string | number, useNewMaxSize: boolean): string | number
	{

		let maxSize = useNewMaxSize ? this.getMaxSize() : this._priorMaxSize;


		if (useNewMaxSize)
		{
			this._priorMaxSize = maxSize;
		}


		if (maxSize)
		{
			return (
				typeof maxSize !== "number"
					? maxSize
					: typeof size !== "number"
						? maxSize
						: Math.min(size, maxSize)
			);
		}


		return size;

	}



	private async expand()
	{

		this.collapsed = false;


		let ri = ++this._reexpandIndex;


		this.props.onExpanding?.();


		if (!this.props.forceRender)
		{
			await this.repaint();
		}


		await arequestAnimationFrame(() =>
		{
			this.setSizes(
				"hidden", //?
				this.getExpandedSize(this.getCurrentSize()!, true),
				null
			);
		});


		await adelay(this.timeout + 50);


		if (ri !== this._reexpandIndex)
			return;


		this.setExpanded();

	}



	private setExpanded()
	{

		let maxSize = this.getMaxSize();

		this.setSizes(
			maxSize ? "hidden" : "visible",
			null,
			maxSize ? maxSize + "px" : "9999px"
		);

	}



	private async collapse()
	{

		let ri = ++this._reexpandIndex;

		await arequestAnimationFrame(() =>
		{
			this.setSizes(
				"hidden", //?
				this.getExpandedSize(this._startSize ?? this.getCurrentSize()!, false),
				null
			);
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
		this.setSizes("hidden", "0", null);
	};



	//---



	endTransition()
	{

		const { props, expanded } = this;

		expanded ? this.setExpanded() : this.setCollapsed();

		props.onExpanedChange?.();

		expanded ? props.onExpanded?.() : props.onCollapsed?.();

	}



	//---



	//@$logm
	private async reexpand()
	{

		let ri = ++this._reexpandIndex;


		await arequestAnimationFrame(() =>
		{
			this.setSizes(
				"hidden",
				this.getExpandedSize(this._startSize!, false),
				null
			);
		});


		if (ri !== this._reexpandIndex)
			return false;


		await arequestAnimationFrame(() =>
		{
			this._startSize = null;

			this.setSizes(
				"hidden", //?
				this.getExpandedSize(this.getCurrentSize()!, true),
				null
			);
		});


		await adelay(this.timeout);


		if (ri !== this._reexpandIndex)
			return false;


		this.setExpanded();

		return true;

	}



	//---

}






export module ExpanderBaseBehavior
{

	export type UseConfig = Repaintable.UseConfig;

}