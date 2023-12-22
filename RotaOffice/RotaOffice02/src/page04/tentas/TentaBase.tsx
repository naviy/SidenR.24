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






export interface TentaInitState
{

	phase: number;
	stage: TentaStage;
}



export interface TentaState extends TentaInitState
{

	stageIndex: number;

	bodyIsSeparated: boolean;
	bodyIsAccented: boolean;

	tailIsVisible: boolean;
	tailIsSeparated: boolean;

	isSeparated: boolean;

}






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


	#state?: TentaState;
	#priorState?: TentaState;


	get state(): TentaState
	{
		return this.ensureState();
	}


	//---



	get phase(): TentaPhase
	{
		return this.state.phase;
	}


	expandedPhase: TentaPhase = 1;
	openedPhase: TentaPhase = 2;
	maxPhase: TentaPhase = 2;


	get stage(): TentaStage
	{
		return this.state.stage;
	}

	get stageIndex(): number
	{
		return this.state.stageIndex;
	}

	get collapsed() { return this.stage === "collapsed"; }
	get expanded() { return this.stage === "expanded"; }
	get opened() { return this.stage === "opened"; }


	stageByPhase(phase: TentaPhase): TentaStage
	{
		return (
			phase >= this.openedPhase ? "opened" :
				phase >= this.expandedPhase && phase < this.openedPhase ? "expanded" :
					"collapsed"
		);
	}


	phaseByStage(stage: TentaStage)
	{
		return (
			stage === "opened" ? this.openedPhase :
				stage === "expanded" ? this.expandedPhase :
					0
		);
	}



	//---



	get isSeparated() { return this.state.isSeparated; }

	get bodyIsSeparated() { return this.state.bodyIsSeparated; }
	get bodyIsAccented() { return this.state.bodyIsAccented; }

	get tailIsVisible() { return this.state.tailIsVisible; }
	get tailIsSeparated() { return this.state.tailIsSeparated; }



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
		this.ensureState();


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


		this.ensureState(cfg);
	}



	ensureState(cfg?: {
		readonly defaultPhase?: TentaPhase;
		readonly defaultStage?: TentaStage;
	}): TentaState
	{

		if (this.#state != null)
			return this.#state;


		let phase: number | undefined = undefined;
		let stage: TentaStage | undefined = undefined;

		if (cfg?.defaultPhase != null)
		{
			phase = cfg.defaultPhase;
		}
		else if (cfg?.defaultStage != null)
		{
			stage = cfg.defaultStage;
			phase = this.phaseByStage(stage);
		}


		this.#state = this.getState(phase, stage);


		return this.#state;

	}



	getState(phase?: TentaPhase, stage?: TentaStage): TentaState
	{

		if (phase === undefined)
		{
			phase = stage !== undefined ? this.phaseByStage(stage) : 0;
		}

		if (stage === undefined)
		{
			stage = this.stageByPhase(phase);
		}



		let restState = this.getRestState(stage, phase);


		return {

			phase,
			stage,

			stageIndex: TentaStage.indexOf(stage),

			isSeparated: restState.bodyIsSeparated || restState.tailIsSeparated,

			...restState,

		};

	}


	protected getRestState(stage: TentaStage, phase: TentaPhase): Omit<TentaState, "phase" | "stage" | "stageIndex" | "isSeparated">
	{

		let collapsed = stage === "collapsed";
		let opened = stage === "opened";

		return {
			bodyIsSeparated: !collapsed,
			bodyIsAccented: !collapsed,
			tailIsVisible: !collapsed,
			tailIsSeparated: opened,
		};
	}



	setPhase(value: TentaPhase): boolean
	{

		if (this.#state?.phase === value || this.disabled)
			return false;

		if (value == null || value < 0 || value > this.maxPhase)
			return false;


		//$log(this + ".setPhase", " phase =", value)


		this.#priorState = this.state;

		this.#state = this.getState(value);


		this.#phaseChanged();

		this.repaintNearests();


		return true;

	}



	#phaseChanged()
	{
		//_$log("onPhaseChanging " + this);
		this.onPhaseChanged();


		this.#recalcCollectors();

		this.#saveToGlobalState();


		this.parentCollector?.itemPhaseChanged();


		let s0 = this.#priorState;
		let s1 = this.state;


		if (s0?.phase != null)
		{

			if (s0.phase < s1.phase)
			{
				this.onPhaseUp();
				this.parent?.onItemPhaseUp(this);
			}
			else if (s0.phase > s1.phase)
			{
				this.onPhaseDown();
				this.parent?.onItemPhaseDown(this);
			}

		}



		if (s0?.bodyIsSeparated != null && s0.bodyIsSeparated !== s1.bodyIsSeparated)
		{

			if (s1.bodyIsSeparated)
			{
				this.onBodySeparated();
			}
			else
			{
				this.onBodyDeseparated();
			}

		}

		if (s0?.tailIsSeparated != null && s0.tailIsSeparated !== s1.tailIsSeparated)
		{

			if (s1.tailIsSeparated)
			{
				this.onTailSeparated();
			}
			else
			{
				this.onTailDeseparated();
			}

		}


		if (s0?.isSeparated != null && s0.isSeparated !== s1.isSeparated)
		{

			if (s1.isSeparated)
			{
				this.onSeparated();
				this.parent?.onItemSeparated(this);
			}
			else
			{
				this.onDeseparated();
				this.parent?.onItemDeseparated(this);
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


		this.hasSeparatedItems = this.anyTenta(a => a.isSeparated)

	}


	repaintNearests()
	{
		//__$log("repaintNearests " + this)


		let nearests = new Set<TentaBase | null | undefined>([
			this,
			this.#priorSibling,
			this.prior(),
			this.first(),
			this.last(),
			this.#nextSibling,
			this.next(),
		]);


		//startTransition(() =>
		//{
		nearests.forEach(a =>
		{

			if (a?.parentCollector && !a.parentCollector.isVisible())
				return;

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


	onPhaseChanged() { }

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



	onBodySeparated() { }
	onBodyDeseparated() { }
	onTailSeparated() { }
	onTailDeseparated() { }
	onSeparated() { }
	onDeseparated() { }
	onItemSeparated(item: TentaBase) { }
	onItemDeseparated(item: TentaBase) { }


	bodySeparate()
	{
		return this.collapsed && this.expand();
	}

	tailSeparate()
	{
		return this.open();
	}

	bodyDeseparate()
	{
		return this.collapse();
	}

	tailDeseparate()
	{
		return this.opened && this.expand();
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
			this.bodyIsSeparated ||
			!!this.priorSibling()?.bodyIsSeparated ||
			!!this.priorSibling()?.tailIsSeparated ||
			!!this.prior()?.tailIsSeparated
		);
	}



	btmIsSeparated()
	{
		return this.bodyIsSeparated || !!this.next()?.bodyIsSeparated || this.isLast && !!this.parent?.tailIsSeparated;
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
		return this.bodyIsSeparated ? this.stageIndex : 0;
	}


	bodyBtmMargin(): number
	{
		return this.bodyIsSeparated && !this.tailIsVisible ? this.stageIndex : this.tailIsSeparated ? 2 : 0;
	}


	tailBtmMargin(): number
	{
		return this.bodyIsSeparated ? this.stageIndex : this.tailIsSeparated ? 2 : 0;
	}


	parentTailBtmMargin(): number
	{

		let parent = this.parent;

		if (!parent)
			return 0;


		if (!this.isLast || this.tailIsVisible && !this.tailIsSeparated)
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



	collectorIsVisible(collector: TentaCollector)
	{
		return this.state.tailIsVisible;
	}


	collectorIsSeparated(collector: TentaCollector)
	{
		return this.state.tailIsSeparated;
	}



	isAccented(): boolean
	{

		let { parentCollector } = this;

		if (parentCollector?.parentTenta && parentCollector.isVisibleAndNotSeparated())
		{
			return parentCollector.parentTenta.isAccented();
		}


		return this.bodyIsAccented;

	}



	//---



	firstCollector(): TentaCollector | null
	{
		return this.tailIsVisible ? this.collectors?.find(a => a.isVisible()) || null : null;
	}

	lastCollector(): TentaCollector | null
	{
		return this.tailIsVisible ? this.collectors?.findLast(a => a.isVisible()) || null : null;
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



	useGlobalState(nameOrState?: string | TentaGlobalState)
	{

		let globalState = GlobalState.use(nameOrState ?? (this.id + ""));

		this.setGlobalState(globalState);


		return this;

	}


	setGlobalState(value: TentaGlobalState)
	{
		this.globalState = value;

		this.#loadFromGlobalState();
	}



	#loadFromGlobalState()
	{

		if (!this.globalState)
			return;


		let stage = GlobalState.get(this.globalState, 'stage', this.stage)!;

		if (stage !== undefined)
			this.#state = this.getState(undefined, stage);

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
