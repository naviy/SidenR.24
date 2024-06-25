import type { Constructor } from "@libs";
import type React from "react";
import { type FC, type ReactNode } from "react";
import type { TentaBase } from "./TentaBase";
import type { TentaCollectorProps, TentaCollectorPropsAliases } from "./TentaCollector";






//===






export interface TentaFunctional<
	TTenta extends TentaBase,
	TComponent
>
{
	cfg: TentaFunctional.Config<TTenta, TComponent>;
	component: TComponent;
}




export function TentaFunctional<
	TBaseClass extends Constructor<TentaBase>,
	TBaseTenta extends TentaBase,
	TComponent,
>(
	BaseClass: TBaseClass
)
{

	return class FunctionalTenta extends BaseClass
	{

		//constructor(
		//	id: React.Key,
		//	public cfg: FunctionalTentaConfig
		//)
		//{
		//	super(id);

		//	cfg.collectors && this.addCollectors(cfg.collectors);

		//}


		cfg!: TentaFunctional.Config<TBaseTenta, TComponent>;
		component!: TComponent;


		override useInNode(cfg?: TentaBase.UseConfig)
		{
			this.cfg.use?.(this as any as TBaseTenta);

			super.useInNode(cfg);
		}


		override render(): ReactNode
		{

			var { cfg } = this;


			var { render } = cfg;

			if (!render)
				return null;

			return <Renderer<TBaseTenta, TComponent>
				key={this.id}
				tenta={this as any as TBaseTenta}
				component={this.component}
				render={render}
			/>;



			//if (cfg.component)
			//{
			//	return createElement(
			//		cfg.component,
			//		{
			//			key: this.id,
			//			tenta: this,
			//		}
			//	);
			//}


			//return undefined;

		}

	};

}




function Renderer<
	TTenta extends TentaBase,
	TComponent
>({
	tenta,
	component,
	render
}: {
	tenta: TTenta,
	component: TComponent,
	render: (tenta: TTenta, component: TComponent) => ReactNode
})
{
	if (tenta == null || render == null)
	{
		return null;
	}


	return render(tenta, component);

}





export module TentaFunctional
{


	//---




	export interface Config<
		TTenta extends TentaBase /*= TentaBase*/,
		TComponent,
	>
	{
		id: React.Key;

		collectors?: TentaCollectorPropsAliases;
		init?: (tenta: TTenta) => void;
		use?: (tenta: TTenta) => void;

		//component?: TComponent;

		render?: (tenta: TTenta, component: TComponent) => ReactNode;

	}




	type ArrayConfig<
		TTenta extends TentaBase /*= TentaBase*/,
		TComponent,
	> = [

		id: React.Key,

		prms: {
			cols?: TentaCollectorPropsAliases | TentaCollectorProps["tentas"];
			init?: (tenta: TTenta) => void;
			use?: (tenta: TTenta) => void;
		},

		render: Config<TTenta, TComponent>["render"],

	] | [
		id: React.Key,
		render: Config<TTenta, TComponent>["render"],
	];




	export type ConfigAlias<
		TTenta extends TentaBase,
		TComponent,
		TArgs extends any[]
	> = (
			Config<TTenta, TComponent> |
			ArrayConfig<TTenta, TComponent> |
			((...args: TArgs) => Config<TTenta, TComponent> | ArrayConfig<TTenta, TComponent>)
		);



	export function Config<
		TTenta extends TentaBase,
		TComponent,
		TArgs extends any[]
	>(
		configGetter: ConfigAlias<TTenta, TComponent, TArgs>,
		args: TArgs
	): Config<TTenta, TComponent>
	{

		let cfg = typeof configGetter === "function" ? configGetter(...args) : configGetter;


		if (!Array.isArray(cfg))
			return cfg;



		let id = cfg[0];

		let componentOrRender = cfg.length === 3 ? cfg[2] : cfg[1];
		let prms = cfg.length === 3 ? cfg[1] : undefined;
		//let componentOrRender = cfg[3];

		//let init = cfg[2] || undefined;
		//let collectors0 = cfg[1] || undefined;

		let collectors0 = prms?.cols;
		let init = prms?.init;
		let use = prms?.use;


		let collectors = typeof collectors0 === "function" ? { items: collectors0 } : collectors0;


		//if (isFC<TTenta>(componentOrRender))
		//{
		//	return {
		//		id,
		//		collectors,
		//		init,
		//		use,
		//		component: componentOrRender,
		//	};
		//}
		//else
		//{
		return {
			id,
			collectors,
			init,
			use,
			render: componentOrRender,
		};
		//}

	}


	//function isFC<TTenta extends TentaBase>(func: Function | null | undefined): func is FC<{ tenta: TTenta }>
	//{

	//	if (!func)
	//		return false;

	//	let firstChar = func.name.charCodeAt(0);

	//	return firstChar >= 65 && firstChar <= 90;
	//}




	//---




	export interface Factory<
		TTenta extends TentaBase,
		TComponent,
		TArgs extends any[] = []
	>
	{

		(/*id: React.Key,*/ ...args: TArgs): TTenta & TentaFunctional<TTenta, TComponent>;

		//use: (...args: TArgs) => TTenta & TentaFunctional;

	}




	export function createFactory<
		TTenta extends TentaBase,
		TComponent,
		TArgs extends any[]
	>(
		tentaClass: Constructor<TTenta & TentaFunctional<TTenta, TComponent>>,
		component: TComponent,
		//init: null | ((tenta: TTenta & TentaFunctional) => void),
		configGetter: ConfigAlias<TTenta, TComponent, TArgs>
	):
		Factory<TTenta, TComponent, TArgs>
	{


		let factory = ((...args: TArgs) =>
		{

			let cfg = Config(configGetter, args);

			let tenta = new tentaClass(cfg.id);

			tenta.component = component;

			tenta.cfg = cfg as any;
			cfg.collectors && tenta.addCollectors(cfg.collectors);
			//tenta.init();
			cfg.init?.(tenta);
			//init?.(tenta);

			return tenta;

		}) as Factory<TTenta, TComponent, TArgs>;



		//factory.use = (...args: TArgs) =>
		//{
		//	let [tenta] = useState(() => factory(...args))

		//	tenta.cfg?.use?.(tenta);

		//	return tenta;
		//};



		return factory;


	}




	//---


}