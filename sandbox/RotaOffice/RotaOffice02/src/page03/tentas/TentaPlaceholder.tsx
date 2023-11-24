import { GlobalState, Repaintable, useNew as useNew_ } from "@libs";
import type React from "react";
import { createContext, useContext, type ReactNode } from "react";
import type { TentaBase, TentaGlobalState } from "./TentaBase";
import { TentaStage } from "./TentaStage";






//===






export module TentaPlaceholder
{


	//---




	export function use(
		id: React.Key | undefined,
		collector?: CollectorBehavior | null
	): Behavior | undefined
	{

		if (id === undefined)
			return undefined;

		if (collector === undefined)
			collector = useContext(CollectorContext)?.collector;


		if (!collector)
			return undefined;


		let exist = collector.byId(id);

		if (exist)
			return exist;


		throw Error(`Tenta.Placeholder.use(): попытка использовать tenta с ключом '${id}', который не был зарегистрирован в Tenta.Placeholder.Collector`)

	}
	//export function use(tenta: TentaBehavior)
	//{
	//	let col = useContext(CollectorContext);
	//	return col?.useTenta(tenta);
	//}



	//---




	export interface Props
	{
		stage: TentaStage;
	}


	export type DefaultProps = React.Key | {
		readonly id: React.Key;
		readonly defaultStage?: TentaStage;
	};

	export function DefaultProps(props: DefaultProps)
	{
		if (typeof props === "object")
			return props;

		return { id: props };
	}



	export class Behavior
	{


		//---



		constructor(
			public collector: CollectorBehavior,
			public id: React.Key,
			public stage: TentaStage,
		)
		{
			//$log("create Placeholder")
		}


		use(tenta: TentaBase)
		{
			this.tenta = tenta;
			return this;
		}



		//---



		tenta?: TentaBase;

		prior: Behavior | null = null;
		next: Behavior | null = null;

		get collapsed() { return this.stage === "collapsed"; }
		get expanded() { return this.stage === "expanded"; }
		get opened() { return this.stage === "opened"; }



		//---



		globalState?: TentaGlobalState;



		setGlobalState(value: TentaGlobalState)
		{

			this.globalState = value;

			this.#loadFromGlobalState();

		}



		#loadFromGlobalState()
		{
			if (!this.globalState) return;

			this.stage = GlobalState.get(this.globalState, 'stage', this.stage)!;
		}



		#saveToGlobalState()
		{
			if (!this.globalState) return;


			GlobalState.set(this.globalState, 'stage', this.stage, TentaStage.Default)!;
		}




		//---



		useTenta(tenta: TentaBase)
		{
			//if (this.tenta && this.tenta !== tenta)
			//{
			//	throw Error(`Tenta.Placeholder.CollectorBehavior: по ключу ${this.id} уже зарегистрирован placeholder с другой tenta`)
			//}

			this.tenta = tenta;

		}



		//---



		setProps(props: Partial<Props>)
		{
			if (props.stage !== undefined)
			{
				this.stage = props.stage;
				this.#saveToGlobalState();
			}
		}


		set(props: Partial<Props>)
		{
			this.setProps(props);
			this.collector.repaint();
		}



		//---


	}




	//---




	const CollectorContext = createContext<{ collector: CollectorBehavior | null }>({ collector: null });



	export function Collector(props: Collector.Config & {
		children: ReactNode;
	}): JSX.Element;
	export function Collector(props: {
		bhv: CollectorBehavior;
		children: ReactNode;
	}): JSX.Element;
	export function Collector(props: Partial<Collector.Config> & {
		bhv?: CollectorBehavior
		children: ReactNode;
	})
	{

		let bhv = props.bhv as CollectorBehavior;

		if (bhv === undefined)
			bhv = Collector.useNew(props as Collector.Config);

		return <CollectorContext.Provider
			value={{ collector: bhv }}
			children={props.children}
		/>;

	}



	export module Collector
	{

		export interface Config
		{
			root?: boolean;
			globalState?: string | GlobalState;
			placeholders: DefaultProps[];
		}


		export function useNew(cfg: Config)
		{
			return useNew_(CollectorBehavior).use(cfg);
		}

	}



	export function NoCollector(props: { children: ReactNode })
	{
		return <CollectorContext.Provider
			value={{ collector: null }}
			children={props.children}
		/>;
	}




	export class CollectorBehavior extends Repaintable()
	{

		//---



		//root!: boolean;

		placeholders!: Behavior[];


		globalState?: GlobalState;



		//---



		use(cfg: Repaintable.UseConfig & Collector.Config)
		{

			Repaintable.use(this, cfg);


			if (cfg?.globalState !== undefined)
			{
				this.globalState = GlobalState.use(cfg.globalState);
			}


			//this.root = cfg?.root || false;

			this.usePlaceholders(cfg.placeholders);


			return this;

		}



		usePlaceholders(news: DefaultProps[])
		{

			let me = this;

			this.placeholders = mergePlaceholders(this.placeholders, news);

			this.placeholders.forEach((a, i, all) =>
			{
				a.prior = all[i - 1] || null;
				a.next = all[i + 1] || null;

				this.globalState && a.setGlobalState(
					GlobalState.node(this.globalState, `tenta${a.id}`)
				);
			});



			function mergePlaceholders(olds: Behavior[], news: DefaultProps[])
			{
				return news.map(nn =>
				{
					let n = DefaultProps(nn);
					return (
						olds?.find(o => o.id === n.id)
						?? new Behavior(me, n.id, n.defaultStage || TentaStage.Default)
					);
				});

			}

		}



		//---



		byId(id: React.Key)
		{
			return this.placeholders.find(a => a.id === id);
		}

		indexById(id: React.Key)
		{
			return this.placeholders.findIndex(a => a.id === id);
		}



		//---

	}




	//---


}