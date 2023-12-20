import { GlobalState, Repaintable } from '@libs';
import type React from "react";
import { type ReactNode } from "react";
import { TentaCollector } from "./TentaCollector";
import type { TentaPhase } from "./TentaPhase";
import { TentaStage } from "./TentaStage";






//===






export interface TentaGlobalState extends GlobalState
{

	stage?: TentaStage;
	focused?: boolean;

}






//===






export class TentaBase extends Repaintable()
	implements Repaintable
{

	//---


	constructor(
		//props: TentaInitProps
		public id: React.Key,
	)
	{
		super();

		//this.id = props.id;
		//this.descriptor = props.descriptor;

	}


	/** Вызывается вручную после создания и добавления коллекторов */
	init()
	{

	}


	//---


	//get isTenta() { return true; }
	iid = ++TentaBase.instanceCount;


	//---


	parentCollector?: TentaCollector | null;

	get parent(): TentaBase | null { return this.parentCollector?.parentTenta || null; }

	#priorSibling?: TentaBase | null;
	#nextSibling?: TentaBase | null;

	get isFirst() { return !this.#priorSibling; }
	get isLast() { return !this.#nextSibling; }


	collectors?: TentaCollector[];

	get hasCollectors() { return !!this.collectors?.length; }
	get collectorCount() { return this.collectors?.length || 0; }



	//---



	disabled = false;



	//---



	#phase?: TentaPhase;
	get phase(): TentaPhase
	{
		if (this.#phase == null)
			this.ensurePhase();

		return this.#phase!;
	}


	priorPhase?: TentaPhase;
	expandedPhase: TentaPhase = 1;
	openedPhase: TentaPhase = 2;
	maxPhase: TentaPhase = 2;

	//defaultPhase?: TentaPhase;
	//defaultStage?: TentaStage;

	get collapsed() { return !this.phase; }
	get expanded() { return this.phase >= this.expandedPhase && this.#phase! < this.openedPhase; }
	get opened() { return this.phase >= this.openedPhase; }


	get stage(): TentaStage
	{
		return TentaStage.byProps(this);
	}

	get stageValue(): number
	{
		return TentaStage.valueOf(this.stage);
	}


	set stage(value: TentaStage)
	{

		if (this.#phase != null && this.stage === value)
			return;


		this.#phase = (
			value === "collapsed" ? 0 :
				value === "expanded" ? this.expandedPhase :
					value === "opened" ? this.openedPhase :
						this.#phase
		);

	}


	canCompress() { return this.phase > 0; }
	canDecompress() { return this.phase < this.maxPhase; }



	//---



	override toString()
	{
		return `T##${this.iid}`;
	}



	//---



	use(cfg?: TentaBase.UseConfig)
	{

		Repaintable.use(this, cfg);

		this.#recalcCollectors();
		this.ensurePhase();


		return this;

	}



	addCollector(id: React.Key, tentaGetter: () => TentaBase[])
	{

		let col = new TentaCollector(id, this, tentaGetter);


		if (!this.collectors)
		{
			this.collectors = [col];
		}
		else
		{
			this.collectors.push(col);
		}

	}



	addCollectors(cfg: Record<string | number | symbol, () => TentaBase[]>)
	{

		for (let id of Object.keys(cfg))
		{
			this.addCollector(id, cfg[id]);
		}

	}



	#recalcCollectors()
	{
		//_$log(this + ".#recalcCollectors()")

		this.collectors?.forEach((col, i, all) =>
		{
			col.setSiblings(all[i - 1], all[i + 1]);
			col.ensureItems();
		});
	}



	setCollector(
		collector: TentaCollector | null,
		prior: TentaBase | null | undefined,
		next: TentaBase | null | undefined
	)
	{

		this.parentCollector = collector;
		this.#priorSibling = prior || null;
		this.#nextSibling = next || null;

		if (this.globalState === undefined)
		{
			this.globalState = GlobalState.node(collector?.globalState, this.id + "");
		}

		this.#loadFromGlobalState();

	}



	//---



	initPhase(cfg?: {
		readonly maxPhase?: TentaPhase;
		readonly defaultPhase?: TentaPhase;
		readonly defaultStage?: TentaStage;
	})
	{

		if (cfg?.maxPhase != null)
		{
			this.maxPhase = cfg.maxPhase;
			this.openedPhase = Math.min(this.openedPhase, this.maxPhase);
			this.expandedPhase = Math.min(this.expandedPhase, this.openedPhase);
		}


		this.ensurePhase(cfg);
	}



	ensurePhase(cfg?: {
		readonly defaultPhase?: TentaPhase;
		readonly defaultStage?: TentaStage;
	})
	{

		if (this.#phase != null)
			return;


		if (!cfg)
		{
			this.#phase = 0;
		}
		else if (cfg.defaultPhase != null)
		{
			this.#phase = cfg.defaultPhase;
		}
		else if (cfg.defaultStage != null)
		{
			this.stage = cfg.defaultStage;
		}
		else
		{
			this.#phase = 0;
		}

	}



	setPhase(value: TentaPhase): boolean
	{
		if (this.#phase === value || this.disabled)
			return false;

		if (value == null || value < 0 || value > this.maxPhase)
			return false;


		//$log(this + ".setPhase", " phase =", value)


		this.priorPhase = this.#phase || 0;
		this.#phase = value;

		this.#phaseChanged();

		this.repaintNearests();


		return true;

	}



	#phaseChanged()
	{
		//_$log("onPhaseChanged " + this);
		//this.onPhaseChanged?.(this);


		this.#recalcCollectors();

		this.#saveToGlobalState();


		this.parentCollector?.itemPhaseChanged();


		if (this.priorPhase != null && this.#phase != null)
		{

			if (this.priorPhase < this.#phase)
			{
				this.onPhaseUp();
				this.parent?.onItemPhaseUp(this);
			}
			else if (this.priorPhase > this.#phase)
			{
				this.onPhaseDown();
				this.parent?.onItemPhaseDown(this);
			}

		}

	}



	//maxItemStage: TentaStage | null = null;
	hasSeparatedItems: boolean = false;

	collectorPhaseChanged()
	{

		//$log(this + ".collectorPhaseChanged");

		this.recalcStages();

	}


	recalcStages()
	{

		//_$log(this + ".recalcStages");
		//this.maxItemStage = this.collectors?.reduce<TentaStage>(
		//	(prior, cur) => TentaStage.max(prior, cur.maxItemStage),
		//	TentaStage.Min
		//) || null;


		this.hasSeparatedItems = this.anyTenta(a => a.isSeparated())

	}


	repaintNearests()
	{
		//__$log("repaintNearests " + this)


		let nearests = new Set<TentaBase | null | undefined>([
			this.#priorSibling,
			this.prior(),
			this,
			this.first(),
			this.last(),
			//...this.all() || [],
			this.#nextSibling,
			this.next(),
		]);


		//startTransition(() =>
		//{
		nearests.forEach(a =>
		{
			//___$log("repaint " + a)
			a?.repaint()
		});
		//});

	}


	//itemsForRepaint()
	//{
	//	return 
	//}


	//phaseIsSkipped(phase: TentaPhase)



	findPriorPhase(phaseIsSkipped?: (phase: TentaPhase, bhv: this) => boolean): TentaPhase
	{

		let { phase } = this;


		if (this.disabled || phase <= 0)
		{
			return phase;
		}


		do
		{
			phase--;
		}
		while (
			phase >= 0 && phaseIsSkipped?.(phase, this)
		)


		return phase;

	}



	findNextPhase(phaseIsSkipped?: (phase: TentaPhase, bhv: this) => boolean): TentaPhase
	{

		let { phase, maxPhase } = this;


		if (this.disabled || phase >= maxPhase)
		{
			return phase;
		}


		do
		{
			phase++;
		}
		while (
			phase <= maxPhase && phaseIsSkipped?.(phase, this)
		)


		return phase;

	}



	phaseUp(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): boolean
	{
		return this.setPhase(this.findPriorPhase(canSkipPhase));
	}

	phaseDown(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): boolean
	{
		return this.setPhase(this.findNextPhase(canSkipPhase));
	}



	onPhaseUp() { }
	onPhaseDown() { }

	onItemPhaseUp(item: TentaBase) { }
	onItemPhaseDown(item: TentaBase) { }



	collapse()
	{
		return this.setPhase(0);
	}


	expand()
	{
		return this.setPhase(this.expandedPhase);
	}


	open()
	{
		return this.setPhase(this.openedPhase);
	}



	//---



	collectorById(id: React.Key)
	{
		return this.collectors?.find(a => a.id === id) || null;
	}



	forEachTenta(action: (tenta: TentaBase) => void)
	{
		return !!this.collectors?.forEach(col => col.items?.forEach(action));
	}


	anyTenta(match: (tenta: TentaBase) => boolean)
	{
		return !!this.collectors?.find(col => col.items?.find(match));
	}


	allTentas(match: (tenta: TentaBase) => boolean)
	{
		return !this.anyTenta(a => !match(a));
	}



	//---



	topIsSeparated()
	{
		return (
			this.bodyIsSeparated() ||
			!!this.priorSibling()?.bodyIsSeparated() ||
			!!this.priorSibling()?.tailIsSeparated() ||
			!!this.prior()?.tailIsSeparated()
		);
	}



	btmIsSeparated()
	{
		return this.bodyIsSeparated() || !!this.next()?.bodyIsSeparated() || this.isLast && !!this.parent?.tailIsSeparated();
	}



	topMargin(): number
	{

		let margin = this.bodyTopMargin();


		if (margin < TentaStage.MaxValue)
		{
			let prior = this.prior();
			margin = !prior ? 2 : Math.max(margin, prior.btmMargin() || 0);
			//margin = Math.max(margin, prior?.btmMargin() || 0);
		}


		return margin;

	}



	btmMargin(): number
	{

		let margin = this.bodyBtmMargin();


		if (margin < TentaStage.MaxValue)
		{
			let next = this.next();
			margin = !next ? 2 : Math.max(margin, next.bodyTopMargin() || 0);
		}


		if (margin < TentaStage.MaxValue)
		{
			margin = Math.max(margin, this.parentTailBtmMargin());
		}


		return margin;

	}



	bodyTopMargin(): number
	{
		return this.bodyIsSeparated() ? this.stageValue : 0;
	}


	bodyBtmMargin(): number
	{
		return this.bodyIsSeparated() && !this.tailIsVisible() || this.tailIsSeparated() ? this.stageValue : 0;
	}


	tailBtmMargin(): number
	{
		return this.bodyIsSeparated() ? this.stageValue : this.tailIsSeparated() ? 2 : 0;
	}


	parentTailBtmMargin(): number
	{

		let parent = this.parent;

		if (!parent)
			return 0;


		if (!this.isLast || this.tailIsVisible() && !this.tailIsSeparated())
		{
			return 0;
		}


		return getParentTailBtmMargin(parent);


		function getParentTailBtmMargin(parent: TentaBase | null): number
		{

			if (!parent)
				return 0;


			let margin = Math.max(parent.tailBtmMargin(), parent.bodyBtmMargin());


			if (margin < TentaStage.MaxValue && parent.isLast)
			{
				let parentMargin = getParentTailBtmMargin(parent.parent);
				margin = Math.max(margin, parentMargin);
			}


			return margin;

		}

	}


	isSeparated()
	{
		return this.bodyIsSeparated() || this.tailIsSeparated();
	}


	bodyIsSeparated()
	{
		return !this.collapsed;
	}


	tailIsVisible()
	{
		return this.opened;
	}


	tailIsSeparated()
	{
		return !this.collapsed;
	}


	collectorIsVisible(collector: TentaCollector)
	{
		return this.tailIsVisible();
	}


	collectorIsSeparated(collector: TentaCollector)
	{
		return this.tailIsSeparated();
	}


	//tailIsVisibleAndSeparated()
	//{
	//	return this.tailIsVisible() && this.tailIsSeparated();
	//}


	//tailIsVisibleAndNotSeparated()
	//{
	//	return this.tailIsVisible() && !this.tailIsSeparated();
	//}


	bodyIsAccented()
	{
		return !this.collapsed;
	}


	isAccented(): boolean
	{

		let { parentCollector } = this;

		if (parentCollector?.parentTenta && parentCollector.isVisibleAndNotSeparated())
		{
			return parentCollector.parentTenta.isAccented();
		}


		return this.bodyIsAccented();

	}



	//---



	firstCollector(): TentaCollector | null
	{
		return this.tailIsVisible() ? this.collectors?.find(a => a.isVisible()) || null : null;
	}

	lastCollector(): TentaCollector | null
	{
		return this.tailIsVisible() ? this.collectors?.findLast(a => a.isVisible()) || null : null;
	}


	priorCollector(): TentaCollector | null
	{
		return this.parentCollector?.priorSibling() || null;
	}

	nextCollector(): TentaCollector | null
	{
		return this.parentCollector?.nextSibling() || null;
	}


	priorSibling(): TentaBase | null
	{
		return this.#priorSibling || null;
	}

	nextSibling(): TentaBase | null
	{
		return this.#nextSibling || null;
	}


	all(): TentaBase[] | null
	{
		return this.collectors?.flatMap(c => c.items) as TentaBase[] || null;
	}


	first(): TentaBase | null
	{
		return this.firstCollector()?.first() || null;
	}

	firstOrMe(): TentaBase | null
	{
		return this.first() || this;
	}

	last(): TentaBase | null
	{
		return this.lastCollector()?.last()?.lastOrMe() || null;
	}

	lastOrMe(): TentaBase | null
	{
		return this.last() || this;
	}


	prior(): TentaBase | null
	{
		return (
			this.priorSibling()?.lastOrMe() ||
			this.priorCollector()?.last() ||
			this.parent ||
			null
		);
	}


	next(): TentaBase | null
	{

		let next = (
			this.first() ||
			this.nextSibling() ||
			this.nextCollector()?.first() ||
			this.parent?.nextSibling() ||
			null
		);

		if (next)
			return next;


		let parent = this.parent;

		while (parent)
		{

			next = parent.nextSibling();

			if (next)
				return next;

			parent = parent.parent;

		}


		return null;

	}



	//---



	focus() { }



	//---



	globalState?: TentaGlobalState;



	setGlobalState(value: TentaGlobalState)
	{

		this.globalState = value;

		this.#loadFromGlobalState();

	}



	#loadFromGlobalState()
	{
		if (!this.globalState)
			return;

		this.stage = GlobalState.get(this.globalState, 'stage', this.stage)!;
	}


	#saveToGlobalState()
	{
		if (!this.globalState)
			return;

		GlobalState.set(this.globalState, 'stage', this.stage, TentaStage.Default)!;
	}



	getGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined
	{
		return GlobalState.get(this.globalState, propName, defaultValue);
	}


	setGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		value: TentaGlobalState[TProp],
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined
	{
		return GlobalState.set(this.globalState, propName, value, defaultValue);
	}



	//---



	//getMargin()
	//{
	//	let me = this.placeholder?.getMargin();
	//	let prior = this.priorSiblingPlaceholder();
	//	let priorSiblingLast = this.priorSibling()?.last();
	//}
	render(): ReactNode
	{
		return null;
	}



	//---

}






export module TentaBase
{


	//---



	export var instanceCount = 0;



	//---



	export interface UseConfig extends Repaintable.UseConfig
	{

		//readonly collectors?: React.Key[];

		//readonly maxPhase?: TentaPhase;

		//readonly defaultPhase?: TentaPhase;
		//readonly defaultStage?: TentaStage;

	}








	//---


}






//===






export function isTenta(obj: any): obj is TentaBase
{
	return obj instanceof TentaBase;
}
