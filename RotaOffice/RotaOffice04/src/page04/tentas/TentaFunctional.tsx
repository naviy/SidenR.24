import type { Constructor } from "@libs";
import type React from "react";
import { createElement, type FC, type ReactNode } from "react";
import type { TentaBase } from "./TentaBase";
import type { TentaCollectorProps, TentaCollectorPropsAliases } from "./TentaCollector";






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

			var { cfg } = this;
			var { render } = cfg;

			if (render)
			{
				return <Renderer key={this.id} tenta={this} render={render} />;
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



	function Renderer({ tenta, render }: { tenta: TentaBase, render: (tenta: TentaBase) => ReactNode })
	{
		if (tenta == null || render == null)
		{
			return null;
		}


		return render(tenta);

	}


}






export module TentaFunctional
{


	//---




	export interface Config<TTenta extends TentaBase = TentaBase>
	{
		id: React.Key;
		collectors?: TentaCollectorPropsAliases;
		render?: (tenta: TTenta) => ReactNode;
		component?: FC<{ tenta: TTenta }>;
	}




	type ArrayConfig<TTenta extends TentaBase = TentaBase> = [

		id: React.Key,

		collectors: TentaCollectorPropsAliases | TentaCollectorProps["tentas"],

		componentOrRender: /*FC<{ tenta: TTenta }> |*/ ((tenta: TTenta) => ReactNode),

	] | [
		id: React.Key,
		componentOrRender: /*FC<{ tenta: TTenta }> |*/ ((tenta: TTenta) => ReactNode),
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


		if (!Array.isArray(cfg))
			return cfg;



		let id = cfg[0];

		let componentOrRender = cfg.length === 3 ? cfg[2] : cfg[1];

		let collectors0 = cfg.length === 3 ? cfg[1] : undefined;

		let collectors = typeof collectors0 === "function" ? { items: collectors0 } : collectors0;


		if (isFC<TTenta>(componentOrRender))
		{
			return {
				id,
				component: componentOrRender,
				collectors,
			};
		}
		else
		{
			return {
				id,
				render: componentOrRender,
				collectors,
			};
		}

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