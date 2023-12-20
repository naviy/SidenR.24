import { $log, GlobalState, Repaintable } from "@libs";
import type React from "react";
import { type ReactNode } from "react";
import { type TentaBase } from "./TentaBase";
import { TentaStage } from "./TentaStage";






//===






export class TentaCollector extends Repaintable()
{

	//---



	constructor(
		public id: React.Key,
		public parentTenta?: TentaBase | null,
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

	#items?: TentaBase[] | null;

	get items(): TentaBase[] | null
	{
		if (this.#items === undefined)
			this.ensureItems();

		return this.#items!;
	};



	maxItemStage: TentaStage | null = null;


	#globalState?: GlobalState;
	get globalState() { return this.#globalState ??= GlobalState.node(this.parentTenta?.globalState, this.id + ""); }


	#defaultListElement?: JSX.Element;
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



	//---



	use(cfg: Repaintable.UseConfig & TentaCollector.CollectorConfig)
	{

		Repaintable.use(this, cfg);

		return this;

	}



	ensureItems()
	{

		if (this.#items || !this.isVisible())
			return;

		this.#createItems();

	}


	#createItems()
	{

		$log(this + ".#createItems")

		this.#items = this.tentasGetter?.() || null;
		//___$log("tentas:", this.tentas);


		this.#items?.map((tenta, i, all) =>
		{
			tenta.setCollector(this, all[i - 1], all[i + 1]);
		});


		this.recalcStages();
		this.parentTenta?.recalcStages();
	}



	//---



	itemPhaseChanged()
	{
		//$log(this + ".itemPhaseChanged");

		this.recalcStages();
		this.parentTenta?.collectorPhaseChanged();
	}



	recalcStages()
	{

		//_$log(this + ".recalcStages")

		this.maxItemStage = this.#items?.reduce<TentaStage>(
			(prior, cur) => TentaStage.max(prior, cur.stage),
			TentaStage.Min
		) || null;

	}



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
	): JSX.Element
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
