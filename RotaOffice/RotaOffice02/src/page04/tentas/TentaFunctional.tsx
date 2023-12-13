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



	export interface Config<
		TTenta extends TentaBase = TentaBase
	>
	{
		collectors?: Record<string | number | symbol, () => TentaBase[]>;
		render?: (tenta: TTenta) => ReactNode;
		component?: FC<{ tenta: TTenta }>;
	}



	export function createFactory<
		TTenta extends TentaBase,
		TArgs extends any[]
	>(
		tentaClass: Constructor<TTenta & TentaFunctional>,
		configGetter: (...args: TArgs) => Config<TTenta>
	)
	{

		return (id: React.Key, ...args: TArgs) =>
		{

			let cfg = configGetter(...args);

			let tenta = new tentaClass(id);

			tenta.cfg = cfg as any;
			cfg.collectors && tenta.addCollectors(cfg.collectors);

			return tenta;

		};

	}



	//---

}