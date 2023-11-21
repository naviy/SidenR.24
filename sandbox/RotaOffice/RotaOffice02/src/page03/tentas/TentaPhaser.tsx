import { type Constructor, type Repaintable } from '@libs';
import { type TentaBase } from "./TentaBase";
import type { TentaPhase } from "./TentaPhase";
import { TentaStage } from "./TentaStage";






//===






export interface TentaPhaser extends TentaBase, Repaintable
{

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






export function TentaPhaser<TBase extends Constructor<TentaBase & Repaintable>>(Base: TBase) 
{

	return class TentaPhaserClass extends Base
		implements TentaPhaser
	{

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

	};

}






export module TentaPhaser
{


	//---



	export interface UseConfig extends TentaBase.UseConfig
	{

		readonly maxPhase?: TentaPhase;

		readonly defaultPhase?: TentaPhase;
		readonly defaultStage?: TentaStage;

	}




	export function use(me: TentaPhaser, cfg?: UseConfig)
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