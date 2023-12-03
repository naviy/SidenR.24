import { GlobalState, Repaintable } from '@libs';
import type React from "react";
import { TentaCollector } from "./TentaCollector";
import type { TentaPhase } from "./TentaPhase";
import { TentaStage } from "./TentaStage";
import type { ReactNode } from "react";






//===






//export type TentaInitProps = {

//	//descriptor: TentaDescriptor;

//	id: React.Key;

//	defaultStage?: TentaStage;

//};


//export function TentaInitProps(props: TentaInitProps.Alias): TentaInitProps
//{
//	if (Array.isArray(props))
//	{
//		return {
//			descriptor: props[0],
//			id: props[1],
//			...props[2],
//		};
//	}

//	return props;
//}



//export module TentaInitProps
//{

//	export type Alias = TentaInitProps | [

//		//descriptor: TentaDescriptor,

//		id: React.Key,

//		cfg?: Omit<TentaInitProps, "id" | "descriptor">

//	];

//}









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

		this.initPhase(this);

	}


	//---


	//get isTenta() { return true; }
	iid = ++TentaBase.instanceCount;


	//---


	collector?: TentaCollector | null;
	//descriptor: TentaDescriptor;

	//parent!: TentaBase | null;
	get parent(): TentaBase | null { return this.collector?.tenta || null; }

	#priorSibling?: TentaBase | null;
	#nextSibling?: TentaBase | null;

	get isFirst() { return !this.#priorSibling; }
	get isLast() { return !this.#nextSibling; }


	collectors?: TentaCollector[];



	//---



	disabled = false;



	//---



	phase!: TentaPhase;
	priorPhase?: TentaPhase;
	expandedPhase: TentaPhase = 1;
	openedPhase: TentaPhase = 2;
	maxPhase: TentaPhase = 2;

	defaultPhase?: TentaPhase;
	defaultStage?: TentaStage;
	
	get collapsed() { return !this.phase; }
	get expanded() { return this.phase >= this.expandedPhase && this.phase < this.openedPhase; }
	get opened() { return this.phase >= this.openedPhase; }


	get stage(): TentaStage { return TentaStage.byProps(this); }
	get topStage() { return TentaStage.max(this.stage, this.#priorSibling?.stage); }
	get btmStage() { return TentaStage.max(this.stage, this.#nextSibling?.stage); }


	set stage(value: TentaStage)
	{
		if (this.phase != null && this.stage === value)
			return;

		this.phase = (
			value === "collapsed" ? 0 :
				value === "expanded" ? this.expandedPhase :
					value === "opened" ? this.openedPhase :
						this.phase
		);
	}

	canCollapse() { return this.phase > 0; }
	canExpand() { return this.phase < this.maxPhase; }


	//onPhaseChanged?: (tenta: any) => void;



	//---



	use(cfg?: TentaBase.UseConfig)
	{

		Repaintable.use(this, cfg);


		//cfg?.collectors && this.#useCollectors(cfg.collectors);

		//this.#usePlaceholder(cfg);
		//this.initPhase(cfg);


		return this;

	}



	//function usePlaceholder(me: TentaBase, cfg?: UseConfig)
	//{

	//	if (!cfg)
	//		return;


	//	let { placeholder } = cfg;

	//	if (placeholder !== undefined)
	//	{
	//		placeholder = me.placeholder = cfg.placeholder || undefined;
	//	}
	//	else if (cfg.id !== undefined)
	//	{
	//		placeholder = me.placeholder = TentaPlaceholder.use(cfg.id);
	//	}


	//	placeholder?.useTenta(me);

	//}



	//#useCollectors(collectorIds: React.Key[])
	//{

	//	this.collectors = collectorIds.map(id =>
	//	{
	//		let col = this.collectors?.find(o => o.id === id) ?? new TentaCollector(id, this);
	//		return col;
	//	});;

	//	this.#recalcCollectors();
	//}



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


		this.#recalcCollectors();

	}


	#recalcCollectors()
	{
		this.collectors?.forEach((col, i, all) =>
		{

			col.setSiblings(all[i - 1], all[i + 1]);
			col.tentas = this.collectorIsVisible(col) ? col?.tentasGetter?.() : undefined;

		});
	}


	collectorIsVisible(collector: TentaCollector)
	{
		return this.opened;
	}


	initPhase(cfg?: {
		readonly maxPhase?: TentaPhase;
		readonly defaultPhase?: TentaPhase;
		readonly defaultStage?: TentaStage;
	})
	{

		if (cfg?.maxPhase != null)
		{
			this.maxPhase = cfg.maxPhase;

			if (this.expandedPhase > this.expandedPhase)
				this.expandedPhase = this.expandedPhase;

			if (this.openedPhase > this.maxPhase)
				this.openedPhase = this.maxPhase;
		}


		if (this.phase != null)
			return;


		if (!cfg)
		{
			this.phase = 0;
		}
		else if (cfg.defaultPhase != null)
		{
			this.phase = cfg.defaultPhase;
		}
		else if (cfg.defaultStage != null)
		{
			this.stage = cfg.defaultStage;
		}
		else
		{
			this.phase = 0;
		}

	}



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



	async setPhase(value: TentaPhase): Promise<boolean>
	{

		let { phase } = this;


		if (phase === value || this.disabled)
			return false;

		if (value == null || value < 0 || value > this.maxPhase)
			return false;


		this.priorPhase = this.phase;
		this.phase = value;

		await this.phaseChanged();


		return true;

	}



	protected phaseChanged()
	{

		//this.onPhaseChanged?.(this);


		this.#recalcCollectors();

		this.#saveToGlobalState();


		if (this.collector)
		{
			this.collector.repaint();
		}
		else
		{
			this.repaint();
		}

	}



	findPriorPhase(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): TentaPhase
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
			phase >= 0 && canSkipPhase?.(phase, this)
		)


		return phase;

	}



	findNextPhase(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): TentaPhase
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
			phase <= maxPhase && canSkipPhase?.(phase, this)
		)


		return phase;

	}



	async collapse(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): Promise<boolean>
	{
		return await this.setPhase(this.findPriorPhase(canSkipPhase));
	}

	async expand(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): Promise<boolean>
	{
		return await this.setPhase(this.findNextPhase(canSkipPhase));
	}



	//---



	setSiblings(prior: TentaBase | null | undefined, next: TentaBase | null | undefined)
	{
		this.#priorSibling = prior || null;
		this.#nextSibling = next || null;
	}


	collectorById(id: React.Key)
	{
		return this.collectors?.find(a => a.id === id) || null;
	}



	//---



	firstCollector(): TentaCollector | null
	{
		return this.collectors?.[0] || null;
	}

	priorCollector(): TentaCollector | null
	{
		return this.collector?.priorSibling() || null;
	}

	nextCollector(): TentaCollector | null
	{
		return this.collector?.nextSibling() || null;
	}


	lastCollector(): TentaCollector | null
	{
		return this.collectors?.at(-1) || null;
	}



	priorSibling(): TentaBase | null
	{
		return this.#priorSibling || null;
	}

	nextSibling(): TentaBase | null
	{
		return this.#nextSibling || null;
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
		return this.lastCollector()?.last() || null;
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



	export let instanceCount = 0;



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