import { Constructor, useForceUpdate, useForceUpdateAsync } from '@libs';






//===






export interface Repaintable
{
	forceUpdate?: (() => void) | (() => Promise<void>);
	useForceUpdate?(): void;
	repaint(): Promise<void>;
}




export function Repaintable<TBase extends Constructor>(Base?: TBase)
{
	return class RepaintableClass
		extends (Base || Object)
		implements Repaintable
	{

		forceUpdate?: (() => void) | (() => Promise<void>);


		useForceUpdate?(): void;


		async repaint()
		{
			this.forceUpdate && await this.forceUpdate();
		}

	}

}




export module Repaintable
{

	//---



	export function Async<TBase extends Constructor>(Base?: TBase)
	{
		return class RepaintableAsync
			extends Repaintable(Base || Object)
		{

			useForceUpdate(): void
			{
				this.forceUpdate = useForceUpdateAsync();
			}

		}

	}



	//---



	export interface UseConfig
	{
		forceUpdate?: (() => void) | (() => Promise<void>);
	}



	export function use(
		me: Repaintable,
		cfg?: UseConfig,
		_useForceUpdate?: () => (() => void) | (() => Promise<void>)
	): void
	{
		if (cfg && cfg.forceUpdate !== undefined)
		{
			me.forceUpdate = cfg.forceUpdate;
		}
		else if (me.useForceUpdate)
		{
			me.useForceUpdate();
		}
		else
		{
			me.forceUpdate = (_useForceUpdate || useForceUpdate)();
		}
	}



	export function useAsync(me: Repaintable, cfg?: UseConfig)
	{
		use(me, cfg, useForceUpdateAsync);
	}



	//---

}







