import { GlobalState, Repaintable, useNew } from "@libs";
import type React from "react";
import { createContext, useContext, type ReactNode } from "react";
import { use as useTenta } from "./Tenta";
import type { TentaBase } from "./TentaBase";
import { TentaPlaceholder } from "./TentaPlaceholder";






//===






export class TentaPlaceholderCollector extends Repaintable()
{

	//---


	static instanceCount = 0;
	iid = ++TentaPlaceholderCollector.instanceCount;
	//root!: boolean;

	id?: React.Key;

	tenta?: TentaBase | null;
	placeholder?: TentaPlaceholderCollector.CollectorPlaceholder;

	placeholders!: TentaPlaceholder[];

	globalState?: GlobalState;



	//---



	use(cfg: Repaintable.UseConfig & TentaPlaceholderCollector.CollectorConfig)
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



	usePlaceholders(news: TentaPlaceholder.DefaultPropsAlias[])
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



		function mergePlaceholders(olds: TentaPlaceholder[], news: TentaPlaceholder.DefaultPropsAlias[])
		{
			return news.map(nn =>
			{
				let n = TentaPlaceholder.DefaultProps(nn);
				return (
					olds?.find(o => o.id === n.id)
					?? new TentaPlaceholder(me, n)
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






export module TentaPlaceholderCollector
{


	//---






	const CollectorContext = createContext<{ collector: TentaPlaceholderCollector | null }>({ collector: null });



	export function Provider(
		props: CollectorConfig & {
			children: ReactNode;
		}
	): JSX.Element;

	export function Provider(
		props: {
			bhv: TentaPlaceholderCollector;
			children: ReactNode;
		}
	): JSX.Element;

	export function Provider(
		props: Partial<CollectorConfig> & {
			bhv?: TentaPlaceholderCollector
			children: ReactNode;
		}
	)
	{

		let bhv = props.bhv as TentaPlaceholderCollector;

		if (bhv === undefined)
			bhv = useNew(TentaPlaceholderCollector).use(props as CollectorConfig);

		return <CollectorContext.Provider
			value={{ collector: bhv }}
			children={props.children}
		/>;

	}




	export function use(): TentaPlaceholderCollector | null
	{
		return useContext(CollectorContext)?.collector || null;
	}




	export function NoProvider(props: { children: ReactNode })
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
		placeholders: TentaPlaceholder.DefaultPropsAlias[];
	}




	export interface CollectorPlaceholder
	{

		id: React.Key;

		collector?: TentaPlaceholderCollector;

		prior?: CollectorPlaceholder | null;
		next?: CollectorPlaceholder | null;

	}




	//---


}