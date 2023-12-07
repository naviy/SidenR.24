import { GlobalState, Repaintable, type Constructor } from '@libs';
import type React from "react";
import { Tenta } from ".";
import type { TentaPhase } from "./TentaPhase";
import { TentaPlaceholder } from "./TentaPlaceholder";
import { TentaStage } from "./TentaStage";
import type { TentaPlaceholderCollector } from "./TentaPlaceholderCollector";






//===






export interface TentaGlobalState extends GlobalState
{

	stage?: TentaStage;
	focused?: boolean;

}






export interface TentaBase extends Repaintable
{

	//---


	iid: number;

	id?: React.Key;

	parent: TentaBase | null;

	placeholder?: TentaPlaceholder;

	collectorPlaceholders?: TentaPlaceholderCollector.CollectorPlaceholder[];

	isFirst: boolean;
	isLast: boolean;

	disabled: boolean;


	//---


	phase: TentaPhase;
	priorPhase?: TentaPhase;
	expandedPhase: TentaPhase;
	openedPhase: TentaPhase;
	maxPhase: TentaPhase;

	//defaultPhase?: TentaPhase;

	stage: TentaStage;
	topStage: TentaStage;
	btmStage: TentaStage

	collapsed: boolean;
	expanded: boolean;
	opened: boolean;


	//---


	canCollapse(): boolean;
	canExpand(): boolean;

	collapse(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): Promise<boolean>;
	expand(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): Promise<boolean>;


	//---


	firstCollector(): TentaPlaceholderCollector | null;
	priorCollectorPlaceholder(): TentaPlaceholderCollector.CollectorPlaceholder | null;
	priorCollector(): TentaPlaceholderCollector | null;
	nextCollectorPlaceholder(): TentaPlaceholderCollector.CollectorPlaceholder | null;
	nextCollector(): TentaPlaceholderCollector | null;
	lastCollectorPlaceholder(): TentaPlaceholderCollector.CollectorPlaceholder | null;
	lastCollector(): TentaPlaceholderCollector | null;

	priorSiblingPlaceholder(): TentaPlaceholder | null
	priorSibling(): TentaBase | null;
	nextSiblingPlaceholder(): TentaPlaceholder | null
	nextSibling(): TentaBase | null;

	first(): TentaBase | null;
	firstOrMe(): TentaBase | null;
	last(): TentaBase | null;
	lastOrMe(): TentaBase | null;

	prior(): TentaBase | null;
	next(): TentaBase | null;


	//---


	getGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined;


	setGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		value: TentaGlobalState[TProp],
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined;


	//---

}






export function TentaBase<TBase extends Constructor<Repaintable>>(Base: TBase)
{

	return class TentaBaseClass
		extends Base
		implements TentaBase
	{

		//---


		get isTenta() { return true; }
		iid = ++TentaBase.instanceCount;


		//---



		id?: React.Key;

		parent!: TentaBase | null;
		level!: number;

		placeholder?: TentaPlaceholder;

		collectorPlaceholders?: TentaPlaceholderCollector.CollectorPlaceholder[];

		get isFirst() { return !this.placeholder?.prior; }
		get isLast() { return !this.placeholder?.next; }



		//---



		disabled = false;



		//---



		phase!: TentaPhase;
		priorPhase?: TentaPhase;
		expandedPhase: TentaPhase = 1;
		openedPhase: TentaPhase = 2;
		maxPhase: TentaPhase = 2;

		defaultPhase?: TentaPhase;


		get collapsed() { return !this.phase; }
		get expanded() { return this.phase >= this.expandedPhase && this.phase < this.openedPhase; }
		get opened() { return this.phase >= this.openedPhase; }


		get stage(): TentaStage { return TentaStage.byProps(this); }
		get topStage() { return TentaStage.max(this.stage, this.placeholder?.prior?.stage); }
		get btmStage() { return TentaStage.max(this.stage, this.placeholder?.next?.stage); }


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


		onPhaseChanged?: (tenta: any) => void;



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

			this.onPhaseChanged?.(this);


			if (this.placeholder)
			{
				if (this.placeholder.stage !== this.stage)
				{
					this.placeholder?.set({ stage: this.stage });
				}
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



		firstCollectorPlaceholder(): TentaPlaceholderCollector.CollectorPlaceholder | null
		{
			return this.collectorPlaceholders?.[0] || null;
		}

		firstCollector(): TentaPlaceholderCollector | null
		{
			return this.firstCollectorPlaceholder()?.collector || null;
		}


		priorCollectorPlaceholder(): TentaPlaceholderCollector.CollectorPlaceholder | null
		{
			return this.placeholder?.collector.placeholder?.prior || null;
		}

		priorCollector(): TentaPlaceholderCollector | null
		{
			return this.priorCollectorPlaceholder()?.collector || null;
		}


		nextCollectorPlaceholder(): TentaPlaceholderCollector.CollectorPlaceholder | null
		{
			return this.placeholder?.collector.placeholder?.next || null;
		}

		nextCollector(): TentaPlaceholderCollector | null
		{
			return this.nextCollectorPlaceholder()?.collector || null;
		}


		lastCollectorPlaceholder(): TentaPlaceholderCollector.CollectorPlaceholder | null
		{
			return this.collectorPlaceholders?.at(-1) || null;
		}

		lastCollector(): TentaPlaceholderCollector | null
		{
			return this.lastCollectorPlaceholder()?.collector || null;
		}



		priorSiblingPlaceholder(): TentaPlaceholder | null
		{
			return this.placeholder?.prior || null;
		}


		priorSibling(): TentaBase | null
		{
			return this.placeholder?.prior?.tenta || null;
		}


		nextSiblingPlaceholder(): TentaPlaceholder | null
		{
			return this.placeholder?.next || null;
		}


		nextSibling(): TentaBase | null
		{
			return this.placeholder?.next?.tenta || null;
		}



		first(): TentaBase | null
		{
			return this.firstCollector()?.firstTenta() || null;
		}

		firstOrMe(): TentaBase | null
		{
			return this.first() || this;
		}

		last(): TentaBase | null
		{
			return this.lastCollector()?.lastTenta() || null;
		}

		lastOrMe(): TentaBase | null
		{
			return this.last() || this;
		}


		prior(): TentaBase | null
		{
			return (
				this.priorSibling()?.lastOrMe() ||
				this.priorCollector()?.lastTenta() ||
				this.parent ||
				null
			);
		}


		next(): TentaBase | null
		{

			let next = (
				this.first() ||
				this.nextSibling() ||
				this.nextCollector()?.firstTenta() ||
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



		getMargin()
		{
			let me = this.placeholder?.getMargin();
			let prior = this.priorSiblingPlaceholder();
			let priorSiblingLast = this.priorSibling()?.last();
		}



		//---



		getGlobalProp<TProp extends keyof TentaGlobalState>(
			propName: TProp,
			defaultValue?: TentaGlobalState[TProp]
		): TentaGlobalState[TProp] | undefined
		{
			return GlobalState.get(this.placeholder?.globalState, propName, defaultValue);
		}


		setGlobalProp<TProp extends keyof TentaGlobalState>(
			propName: TProp,
			value: TentaGlobalState[TProp],
			defaultValue?: TentaGlobalState[TProp]
		): TentaGlobalState[TProp] | undefined
		{
			return GlobalState.set(this.placeholder?.globalState, propName, value, defaultValue);
		}



		//---

	};

}






export module TentaBase
{


	//---



	export var instanceCount = 0;



	//---



	export interface UseConfig
	{

		readonly id?: React.Key;

		readonly placeholder?: TentaPlaceholder | null;

		readonly collectors?: React.Key[];

		readonly maxPhase?: TentaPhase;

		readonly defaultPhase?: TentaPhase;
		readonly defaultStage?: TentaStage;

	}




	export function use(me: TentaBase, cfg?: UseConfig)
	{

		me.id = cfg?.id;
		me.parent = Tenta.use();

		cfg?.collectors && useCollectors(me, cfg.collectors);

		usePlaceholder(me, cfg);
		usePhase(me, cfg);

	}



	function usePlaceholder(me: TentaBase, cfg?: UseConfig)
	{

		if (!cfg)
			return;


		let { placeholder } = cfg;

		if (placeholder !== undefined)
		{
			placeholder = me.placeholder = cfg.placeholder || undefined;
		}
		else if (cfg.id !== undefined)
		{
			placeholder = me.placeholder = TentaPlaceholder.use(cfg.id);
		}


		placeholder?.useTenta(me);

	}



	function useCollectors(me: TentaBase, collectorIds: React.Key[])
	{

		me.collectorPlaceholders = mergePlaceholders(me.collectorPlaceholders);

		me.collectorPlaceholders.forEach((a, i, all) =>
		{
			a.prior = all[i - 1] || null;
			a.next = all[i + 1] || null;
		});


		function mergePlaceholders(olds?: TentaPlaceholderCollector.CollectorPlaceholder[])
		{
			return collectorIds.map(id => olds?.find(o => o.id === id) ?? { id });
		}

	}



	function usePhase(me: TentaBase, cfg?: UseConfig)
	{

		if (cfg?.maxPhase != null)
		{
			me.maxPhase = cfg.maxPhase;

			if (me.expandedPhase > me.expandedPhase)
				me.expandedPhase = me.expandedPhase;

			if (me.openedPhase > me.maxPhase)
				me.openedPhase = me.maxPhase;
		}


		if (me.phase != null)
			return;


		if (!cfg)
		{
			me.phase = 0;
		}
		else if (cfg.defaultPhase != null)
		{
			me.phase = cfg.defaultPhase;
		}
		else if (cfg.defaultStage != null)
		{
			me.stage = cfg.defaultStage;
		}
		else if (cfg.placeholder)
		{
			me.stage = cfg.placeholder.stage;
		}
		else
		{
			me.phase = 0;
		}

	}



	//---


}






//===






export function isTenta(obj: any): obj is TentaBase
{
	return !!(obj && obj["isTenta"]);
}