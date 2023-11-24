import { GlobalState, type Constructor, Repaintable } from '@libs';
import { TentaPlaceholder } from "./TentaPlaceholder";
import { TentaStage } from "./TentaStage";
import type { TentaPhase } from "./TentaPhase";
import type React from "react";
import { Tenta } from ".";






//===






export interface TentaGlobalState extends GlobalState
{

	stage?: TentaStage;
	focused?: boolean;

}






export interface TentaBase extends Repaintable
{

	id?: React.Key;

	parent: TentaBase | null;

	placeholder?: TentaPlaceholder.Behavior;
	isFirst: boolean;
	isLast: boolean;

	disabled: boolean;

	getGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined;


	setGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		value: TentaGlobalState[TProp],
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined;


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

	canCollapse(): boolean;
	canExpand(): boolean;

	collapse(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): Promise<boolean>;
	expand(canSkipPhase?: (phase: TentaPhase, bhv: this) => boolean): Promise<boolean>;


}






export function TentaBase<TBase extends Constructor<Repaintable>>(Base: TBase)
{

	return class TentaBaseClass
		extends Base
		implements TentaBase
	{

		//---



		id?: React.Key;

		parent!: TentaBase | null;

		placeholder?: TentaPlaceholder.Behavior;

		disabled = false;

		get isFirst() { return !this.placeholder?.prior; }
		get isLast() { return !this.placeholder?.next; }



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

	};

}






export module TentaBase
{


	//---



	export interface UseConfig
	{

		readonly id?: React.Key;

		readonly placeholder?: TentaPlaceholder.Behavior | null;

		readonly maxPhase?: TentaPhase;

		readonly defaultPhase?: TentaPhase;
		readonly defaultStage?: TentaStage;

	}




	export function use(me: TentaBase, cfg?: UseConfig)
	{

		me.id = cfg?.id;
		me.parent = Tenta.use();

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

