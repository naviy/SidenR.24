import { GlobalState, Repaintable } from "@libs";
import type React from "react";
import { type ReactNode } from "react";
import { type TentaBase } from "./TentaBase";






//===






export interface TentaCollectorProps
{

	title?: (collector: TentaCollector) => ReactNode;
	tentas: (collector: TentaCollector) => Array<TentaBase | null | undefined | false | 0 | ""> | null | undefined | false | 0 | "";

}



export type TentaCollectorPropsAlias = TentaCollectorProps | TentaCollectorProps["tentas"];

export type TentaCollectorPropsAliases = Record<
	string | number | symbol,
	TentaCollectorPropsAlias | null | undefined | false | 0 | ""
>;






export class TentaCollector extends Repaintable()
{

	//---



	constructor(
		public id: React.Key,
		public parentTenta: TentaBase | null,
		public props: TentaCollectorProps
	)
	{
		super();
	}



	//---



	static instanceCount = 0;
	iid = ++TentaCollector.instanceCount;

	#priorSibling?: TentaCollector | null;
	#nextSibling?: TentaCollector | null;

	#items?: TentaBase[] | null;



	get items(): TentaBase[] | null
	{
		if (this.#items === undefined)
			this.ensureItems();

		return this.#items!;
	};


	get itemCount(): number
	{
		return this.items?.length || 0;
	};



	//maxItemStage: TentaStage | null = null;


	#globalState?: GlobalState;
	get globalState() { return this.#globalState ??= GlobalState.node(this.parentTenta?.globalState, this.id + ""); }


	#defaultListElement?: ReactNode;
	defaultListElement()
	{
		return this.#defaultListElement ??= <TentaCollector.List key={this.id} bhv={this} />;
	}

	//children?: ReactNode;



	//---



	override toString()
	{
		return `C##${this.iid}`;
	}



	toLogValue()
	{
		return [this.toString()];
	}



	//---



	use(cfg: Repaintable.UseConfig & TentaCollector.CollectorConfig)
	{

		Repaintable.use(this, cfg);

		return this;

	}



	ensureItems()
	{

		if (this.#items !== undefined || !this.isVisible())
			return;

		this.#createItems();

	}



	#createItems()
	{

		this.#items = (this.props.tentas?.(this) || null)?.filter(a => a) as TentaBase[] || null;
		//___$log("tentas:", this.tentas);


		this.#items?.map((tenta, i, all) =>
		{
			tenta.setCollector(this, all[i - 1], all[i + 1]);
			tenta.created();
		});


		//this.recalcStages();
		this.parentTenta?.recalcStages();

	}



	//---



	title(): ReactNode
	{
		return this.props.title?.(this)
	}



	//---



	itemPhaseChanged()
	{
		//$log(this + ".itemPhaseChanged");

		//this.recalcStages();
		this.parentTenta?.collectorPhaseChanged();
	}



	//recalcStages()
	//{

	//	//_$log(this + ".recalcStages")

	//	this.maxItemStage = this.#items?.reduce<TentaStage>(
	//		(prior, cur) => TentaStage.max(prior, cur.stage),
	//		TentaStage.Min
	//	) || null;

	//}



	//---



	isVisible()
	{
		return !this.parentTenta || this.parentTenta.collectorIsVisible(this);
	}

	isSeparated()
	{
		return !this.parentTenta || this.parentTenta.collectorIsSeparated(this);
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



	//---



	priorSibling(): TentaCollector | null
	{

		let prior = this.#priorSibling;


		while (prior && !prior.isVisible())
		{
			prior = prior.#priorSibling;
		}


		return prior || null;

	}


	nextSibling(): TentaCollector | null
	{

		let next = this.#nextSibling;


		while (next && !next.isVisible())
		{
			next = next.#nextSibling;
		}


		return next || null;

	}


	first()
	{
		return this.items?.[0] || null;
	}


	last()
	{
		return this.items?.at(-1) || null;
	}



	//---

}






export module TentaCollector
{

	//---



	export function List(
		props: {
			bhv: TentaCollector;
			children?: ReactNode;
		}
	): ReactNode
	{

		let { bhv } = props;


		bhv?.use(props as CollectorConfig);



		let body = props.children;


		if (bhv && body === undefined)
		{
			//_$log("bhv.children 1:", bhv.children)
			//body = bhv.children != null ? bhv.children : (bhv.children = bhv.tentas?.map(a => a.render()));
			body = bhv.items?.map(a => a.render());
			//_$log("bhv.children 2:", bhv.children)
		}



		return <>{body}</>;

	}




	export interface CollectorConfig
	{
	}



	//---

}
