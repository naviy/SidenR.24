import type React from "react";
import type { TentaBase } from "./TentaBase";
import { createElement, type FC, type ReactNode } from "react";
import type { Constructor } from "@libs";






//===






export interface TentaFunctional
{
	cfg: TentaFunctional.Config;
}




export function TentaFunctional<TBase extends Constructor<TentaBase>>(Base: TBase) 
{

	return class FunctionalTenta extends Base
	{

		//constructor(
		//	id: React.Key,
		//	public cfg: FunctionalTentaConfig
		//)
		//{
		//	super(id);

		//	cfg.collectors && this.addCollectors(cfg.collectors);

		//}


		cfg!: TentaFunctional.Config;


		override render(): ReactNode
		{

			let { cfg } = this;


			if (cfg.render)
			{
				return cfg.render(this);
			}


			if (cfg.component)
			{
				return createElement(
					cfg.component,
					{
						key: this.id,
						tenta: this,
					}
				);
			}


			return undefined;

		}

	};

}






export module TentaFunctional
{


	//---




	export interface Config<TTenta extends TentaBase = TentaBase>
	{
		collectors?: Record<string | number | symbol, () => TentaBase[]>;
		render?: (tenta: TTenta) => ReactNode;
		component?: FC<{ tenta: TTenta }>;
	}




	type ArrayConfig<TTenta extends TentaBase = TentaBase> = [
		component?: FC<{ tenta: TTenta }>,
		collectors?: /*Record<string | number | symbol, () => TentaBase[]> |*/ (() => TentaBase[]),
	];




	export type ConfigAlias<TTenta extends TentaBase, TArgs extends any[]> =
		Config<TTenta> |
		ArrayConfig<TTenta>  |
		((...args: TArgs) => Config<TTenta> | ArrayConfig<TTenta>)
	;



	export function Config<
		TTenta extends TentaBase,
		TArgs extends any[]
	>(
		configGetter: ConfigAlias<TTenta, TArgs>,
		args: TArgs
	): Config<TTenta>
	{

		let cfg = typeof configGetter === "function" ? configGetter(...args) : configGetter;

		if (Array.isArray(cfg))
		{
			return {
				component: cfg[0],
				collectors: typeof cfg[1] === "function" ? { "items": cfg[1] } : cfg[1],
			};
		}


		return cfg;

	}




	//---




	export function createFactory<
		TTenta extends TentaBase,
		TArgs extends any[]
	>(
		tentaClass: Constructor<TTenta & TentaFunctional>,
		configGetter: ConfigAlias<TTenta, TArgs>
	):
		(id: React.Key, ...args: TArgs) => TTenta
	{

		return (id: React.Key, ...args: TArgs) =>
		{

			let cfg = Config(configGetter, args);

			let tenta = new tentaClass(id);

			tenta.cfg = cfg as any;
			cfg.collectors && tenta.addCollectors(cfg.collectors);

			return tenta;

		};

	}




	//---


}