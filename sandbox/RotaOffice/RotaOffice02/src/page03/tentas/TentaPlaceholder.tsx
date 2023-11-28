import { GlobalState, Repaintable, useNew } from "@libs";
import type React from "react";
import { createContext, useContext, type ReactNode } from "react";
import type { TentaBase, TentaGlobalState } from "./TentaBase";
import { TentaStage } from "./TentaStage";
import { use as useTenta } from "./Tenta";






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



	export type DefaultProps = {

		nodeCtr: Behavior["nodeCtr"];

		id: React.Key;

		defaultStage?: TentaStage;

	};


	export type DefaultPropsAlias = DefaultProps | [

		nodeCtr: Behavior["nodeCtr"],

		id: React.Key,

		cfg?: Omit<DefaultProps, "id" | "nodeCtr">

	];



	export function DefaultProps(props: DefaultPropsAlias): DefaultProps
	{
		if (Array.isArray(props))
		{
			return {
				nodeCtr: props[0],
				id: props[1],
				...props[2],
			};
		}

		return props;
	}




	export class Behavior
	{


		//---



		constructor(
			public collector: CollectorBehavior,
			props: DefaultProps
		)
		{
			this.id=props.id;
			this.nodeCtr = props.nodeCtr;
			this.stage = props.defaultStage || TentaStage.Default;
			//$log("create Placeholder")
		}


		use(tenta: TentaBase)
		{
			this.tenta = tenta;
			return this;
		}



		//---



		id: React.Key;
		stage: TentaStage;
		nodeCtr: {
			getMargin(phr: TentaPlaceholder.Behavior): number;
		};

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



	export function Collector(
		props: CollectorConfig & {
			children: ReactNode;
		}
	): JSX.Element;

	export function Collector(
		props: {
			bhv: CollectorBehavior;
			children: ReactNode;
		}
	): JSX.Element;

	export function Collector(
		props: Partial<CollectorConfig> & {
			bhv?: CollectorBehavior
			children: ReactNode;
		}
	)
	{

		let bhv = props.bhv as CollectorBehavior;

		if (bhv === undefined)
			bhv = useNew(CollectorBehavior).use(props as CollectorConfig);

		return <CollectorContext.Provider
			value={{ collector: bhv }}
			children={props.children}
		/>;

	}



	export function NoCollector(props: { children: ReactNode })
	{
		return <CollectorContext.Provider
			value={{ collector: null }}
			children={props.children}
		/>;
	}






	export interface CollectorConfig
	{
		id?: React.Key;
		//root?: boolean;
		globalState?: string | GlobalState | null | false;
		placeholders: DefaultPropsAlias[];
	}




	export interface CollectorPlaceholder
	{

		id: React.Key;

		collector?: CollectorBehavior;

		prior?: CollectorPlaceholder | null;
		next?: CollectorPlaceholder | null;

	}






	export class CollectorBehavior extends Repaintable()
	{

		//---


		static instanceCount = 0;
		iid = ++CollectorBehavior.instanceCount;
		//root!: boolean;

		id?: React.Key;

		tenta?: TentaBase | null;
		placeholder?: CollectorPlaceholder;

		placeholders!: Behavior[];

		globalState?: GlobalState;



		//---



		use(cfg: Repaintable.UseConfig & CollectorConfig)
		{

			Repaintable.use(this, cfg);


			cfg.id && this.#useTenta(cfg.id);


			if (cfg.globalState !== undefined)
			{
				if (cfg.globalState)
					this.globalState = GlobalState.use(cfg.globalState);
			}
			else if (typeof cfg.id === "string")
			{
				this.globalState = GlobalState.use(cfg.id);
			}


			//this.root = cfg?.root || false;

			this.usePlaceholders(cfg.placeholders);


			return this;

		}



		#useTenta(id: React.Key)
		{

			this.id = id;

			let tenta = this.tenta = useTenta();

			if (!tenta)
				return;


			let colPlh = this.placeholder = tenta.collectorPlaceholders?.find(a => a.id === id);

			if (colPlh)
				colPlh.collector = this;

		}



		usePlaceholders(news: DefaultPropsAlias[])
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



			function mergePlaceholders(olds: Behavior[], news: DefaultPropsAlias[])
			{
				return news.map(nn =>
				{
					let n = DefaultProps(nn);
					return (
						olds?.find(o => o.id === n.id)
						?? new Behavior(me, n)
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



		firstPlaceholder()
		{
			return this.placeholders[0] || null;
		}


		lastPlaceholder()
		{
			return this.placeholders.at(-1) || null;
		}


		firstTenta(): TentaBase | null
		{
			return this.firstPlaceholder()?.tenta || null;
		}


		lastTenta(): TentaBase | null
		{
			let tenta = this.lastPlaceholder()?.tenta;

			return tenta?.last() || tenta || null;
		}



		//---

	}




	//---


}