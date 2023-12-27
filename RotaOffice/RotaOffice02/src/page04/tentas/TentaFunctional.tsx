import type React from "react";
import type { TentaBase } from "./TentaBase";
import { createElement, type FC, type ReactNode } from "react";
import type { Constructor } from "@libs";
import type { TentaCollectorProps, TentaCollectorPropsAlias } from "./TentaCollector";






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
		id: React.Key;
		collectors?: Record<string | number | symbol, TentaCollectorPropsAlias>;
		render?: (tenta: TTenta) => ReactNode;
		component?: FC<{ tenta: TTenta }>;
	}




	type ArrayConfig<TTenta extends TentaBase = TentaBase> = [
		id: React.Key,
		componentOrRender: FC<{ tenta: TTenta }> | ((tenta: TTenta) => ReactNode),
		collectors?: (
			Record<
				string | number | symbol,
				TentaCollectorPropsAlias
			>
			|
			TentaCollectorProps["tentas"]
		),
	];




	export type ConfigAlias<TTenta extends TentaBase, TArgs extends any[]> = (
		Config<TTenta> |
		ArrayConfig<TTenta> |
		((...args: TArgs) => Config<TTenta> | ArrayConfig<TTenta>)
	);



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

			let collectors = typeof cfg[2] === "function" ? { items: cfg[2] } : cfg[2];


			let id = cfg[0];
			let cfg1 = cfg[1];

			if (isFC<TTenta>(cfg1))
			{
				return {
					id,
					component: cfg1,
					collectors,
				};
			}
			else
			{
				return {
					id,
					render: cfg1,
					collectors,
				};
			}


		}


		return cfg;

	}


	function isFC<TTenta extends TentaBase>(func: Function | null | undefined): func is FC<{ tenta: TTenta }>
	{

		if (!func)
			return false;

		let firstChar = func.name.charCodeAt(0);

		return firstChar >= 65 && firstChar <= 90;
	}




	//---




	export function createFactory<
		TTenta extends TentaBase,
		TArgs extends any[]
	>(
		tentaClass: Constructor<TTenta & TentaFunctional>,
		configGetter: ConfigAlias<TTenta, TArgs>
	):
		(/*id: React.Key,*/ ...args: TArgs) => TTenta
	{

		return (/*id: React.Key,*/ ...args: TArgs) =>
		{

			let cfg = Config(configGetter, args);

			let tenta = new tentaClass(cfg.id);

			tenta.cfg = cfg as any;
			cfg.collectors && tenta.addCollectors(cfg.collectors);
			tenta.init();

			return tenta;

		};

	}




	//---


}