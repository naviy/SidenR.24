import { Constructor, Repaintable } from '@libs';
import { TentaStatuser } from "./TentaStatuser";






//===






export interface TentaPhaser
{

	phase: number;
	expandedPhase: number;
	openedPhase: number;
	maxPhase: number;

	defaultPhase?: number;

	collapsed: boolean;
	expanded: boolean;
	opened: boolean;

	canCollapse(): boolean;
	canExpand(): boolean;

	collapse(canSkipPhase?: (phase: number, bhv: this) => boolean): Promise<boolean>;
	expand(canSkipPhase?: (phase: number, bhv: this) => boolean): Promise<boolean>;

}






export function TentaPhaser<TBase extends Constructor<TentaStatuser & Repaintable>>(Base: TBase) 
{
	return class TentaPhaserClass extends Base
		implements TentaPhaser
	{

		//---



		phase!: number;
		expandedPhase: number = 1;
		openedPhase: number = 2;
		maxPhase: number = 2;

		defaultPhase?: number;

		get collapsed() { return !this.phase; }
		get expanded() { return this.phase >= this.expandedPhase && this.phase < this.openedPhase; }
		get opened() { return this.phase >= this.openedPhase; }

		canCollapse() { return this.phase > 0; }
		canExpand() { return this.phase < this.maxPhase; }


		onPhaseChanged?: (tenta: any) => void;



		//---



		async setPhase(value: number/*, manual = true*/): Promise<boolean>
		{

			let { phase } = this;


			if (phase === value || this.disabled)
				return false;

			if (value == null || value < 0 || value > this.maxPhase)
				return false;


			this.phase = value;
			//this.phaseWasManualChanged = manual;


			await this.phaseChanged();


			return true;

		}



		protected async phaseChanged()
		{

			this.onPhaseChanged?.(this);

			await this.repaint();

			//this.prior?.repaintListRow?.();
			//this.next?.repaintListRow?.();

		}



		priorPhase(canSkipPhase?: (phase: number, bhv: this) => boolean): number
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



		nextPhase(canSkipPhase?: (phase: number, bhv: this) => boolean): number
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



		async collapse(canSkipPhase?: (phase: number, bhv: this) => boolean): Promise<boolean>
		{
			return await this.setPhase(this.priorPhase(canSkipPhase));
		}

		async expand(canSkipPhase?: (phase: number, bhv: this) => boolean): Promise<boolean>
		{
			return await this.setPhase(this.nextPhase(canSkipPhase));
		}



		//---

	};
}






export module TentaPhaser
{


	export interface UseConfig
	{
		defaultPhase?: number;
	}


	export function use(me: TentaPhaser, cfg?: UseConfig)
	{
		me.phase ??= cfg?.defaultPhase ?? 0;
	}


}