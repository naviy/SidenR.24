import { GlobalState, Repaintable } from "@libs";
import type React from "react";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { use as useTenta } from "./Tenta";
import { /*TentaInitProps,*/ type TentaBase } from "./TentaBase";






//===






export class TentaCollector extends Repaintable()
{

	//---



	constructor(
		public id: React.Key,
		public tenta?: TentaBase | null,
		public tentasGetter?: () => TentaBase[] | null | undefined,
	)
	{
		super();
	}



	//---



	static instanceCount = 0;
	iid = ++TentaCollector.instanceCount;

	#priorSibling?: TentaCollector | null;
	#nextSibling?: TentaCollector | null;

	#tentas?: TentaBase[] | null;

	get tentas(): TentaBase[] | null
	{
		if (this.#tentas === undefined)
			this.ensureTentas();

		return this.#tentas!;
	};

	globalState?: GlobalState;


	//children?: ReactNode;



	//---



	override toString()
	{
		return `${this.constructor.name}-#${this.id}-##${this.iid}`;
	}



	//---



	use(cfg: Repaintable.UseConfig & TentaCollector.CollectorConfig)
	{

		Repaintable.use(this, cfg);


		if (cfg.globalState !== undefined)
		{
			if (cfg.globalState)
				this.globalState = GlobalState.use(cfg.globalState);
		}
		else if (typeof this.id === "string")
		{
			this.globalState = GlobalState.use(this.id);
		}


		//this.root = cfg?.root || false;

		//this.useTentas(cfg.tentas);


		return this;

	}



	//useTentas(news: TentaInitProps.Alias[])
	//{

	//	let me = this;


	//	this.tentas = mergeTentas(this.tentas, news);


	//	this.tentas.forEach((a, i, all) =>
	//	{
	//		a.setSiblings(all[i - 1], all[i + 1]);

	//		this.globalState && a.setGlobalState(
	//			GlobalState.node(this.globalState, `tenta${a.id}`)
	//		);
	//	});



	//	function mergeTentas(olds: TentaBase[] | undefined, news: TentaInitProps.Alias[])
	//	{
	//		return news.map(nn =>
	//		{
	//			let n = TentaInitProps(nn);
	//			return (
	//				olds?.find(o => o.id === n.id)
	//				?? n.descriptor.newTenta(me, n)
	//			);
	//		});

	//	}

	//}


	ensureTentas()
	{
		if (this.#tentas)
			return;

		//__$log(this + ".ensureTentas()")
		//___$log("tenta.phase:", this.tenta?.phase);
		//___$log("visible:", this.tenta?.collectorIsVisible(this));


		this.#tentas = this.isVisible() ? this.tentasGetter?.() : this.#tentas/*undefined*/;
		//___$log("tentas:", this.tentas);


		this.#tentas?.map((tenta, i, all) =>
		{
			tenta.setCollector(this, all[i - 1], all[i + 1]);
		});

	}



	//---



	isVisible()
	{
		return !this.tenta || this.tenta.tailIsVisible();
	}

	isSeparated()
	{
		return !this.tenta || this.tenta.tailIsSeparated();
	}

	isVisibleAndSeparated()
	{
		return this.isVisible() && this.isSeparated();
	}

	isVisibleAndNotSeparated()
	{
		return this.isVisible() && !this.isSeparated();
	}



	//---



	setSiblings(prior: TentaCollector | null | undefined, next: TentaCollector | null | undefined)
	{
		this.#priorSibling = prior || null;
		this.#nextSibling = next || null;
	}


	//byId(id: React.Key)
	//{
	//	return this.tentas?.find(a => a.id === id);
	//}

	//indexById(id: React.Key)
	//{
	//	return this.tentas?.findIndex(a => a.id === id);
	//}



	//---



	priorSibling(): TentaCollector | null
	{
		return this.#priorSibling || null;
	}

	nextSibling(): TentaCollector | null
	{
		return this.#nextSibling || null;
	}


	first()
	{
		return this.tentas?.[0] || null;
	}


	last()
	{
		return this.tentas?.at(-1) || null;
	}



	//---

}






export module TentaCollector
{


	//---






	const CollectorContext = createContext<{ collector: TentaCollector | null }>({ collector: null });




	export function use(): TentaCollector | null
	{
		return useContext(CollectorContext)?.collector || null;
	}



	export function useById(id: React.Key, tenta?: TentaBase | null)
	{

		if (tenta === undefined)
		{
			tenta = useTenta();
		}


		let collector: TentaCollector | null = null;


		if (tenta === undefined)
		{
			const ref = useRef<TentaCollector | null>(null);
			collector = ref.current;

			if (!collector)
				ref.current = collector = new TentaCollector(id);
		}
		else if (tenta === null)
		{
			collector = null;
		}
		else
		{
			collector = tenta.collectorById(id);

			if (!collector)
				throw Error(`Не найден collector#${id} в tenta ${tenta.constructor.name}#${tenta.iid}`);
		}


		return collector;

	}



	export function Provider(
		props: CollectorConfig & {
			id: React.Key;
			children?: ReactNode;
		}
	): JSX.Element;

	export function Provider(
		props: {
			bhv: TentaCollector;
			children?: ReactNode;
		}
	): JSX.Element;

	export function Provider(
		props: Partial<CollectorConfig> & {
			bhv?: TentaCollector | null
			id?: React.Key;
			children?: ReactNode;
		}
	)
	{

		let bhv = props.bhv;

		if (bhv === undefined)
		{
			bhv = useById(props.id!);
		}


		//$log("TentaCollection " + bhv)


		bhv?.use(props as CollectorConfig);



		let body = props.children;


		if (bhv && body === undefined)
		{
			//_$log("bhv.children 1:", bhv.children)
			//body = bhv.children != null ? bhv.children : (bhv.children = bhv.tentas?.map(a => a.render()));
			body = bhv.tentas?.map(a => a.render());
			//_$log("bhv.children 2:", bhv.children)
		}


		body = <CollectorContext.Provider
			value={{ collector: bhv }}
			children={body}
		/>;


		return body;

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
		globalState?: string | GlobalState | null | false;
		//tentas: TentaInitProps.Alias[];
	}




	//export interface CollectorPlaceholder
	//{

	//	id: React.Key;

	//	collector?: TentaCollector;

	//	prior?: CollectorPlaceholder | null;
	//	next?: CollectorPlaceholder | null;

	//}




	//---


}
