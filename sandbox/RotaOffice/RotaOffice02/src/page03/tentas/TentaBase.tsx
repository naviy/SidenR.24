import { GlobalState, type Constructor } from '@libs';
import { TentaPlaceholder } from "./TentaPlaceholder";
import { TentaStage } from "./TentaStage";
import type { TentaPhase } from ".";






//===






export interface TentaGlobalState extends GlobalState
{

	stage?: TentaStage;
	focused?: boolean;

}






export interface TentaBase
{

	placeholder?: TentaPlaceholder.Behavior;

	phase?: TentaPhase;
	stage?: TentaStage

	disabled: boolean;

	isFirst: boolean;
	isLast: boolean;


	getGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined;


	setGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		value: TentaGlobalState[TProp],
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined;


}






export function TentaBase<TBase extends Constructor>(Base: TBase)
{

	return class TentaBaseClass extends Base implements TentaBase
	{

		//---



		placeholder?: TentaPlaceholder.Behavior;

		disabled = false;

		get isFirst(){ return !this.placeholder?.prior;  }
		get isLast(){ return !this.placeholder?.next;  }



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



	export interface UseConfig
	{

		readonly id?: React.Key | undefined;

		readonly placeholder?: TentaPlaceholder.Behavior | null;

	}


	export function use(me: TentaBase, cfg?: UseConfig)
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


		if (!placeholder)
			return;


		placeholder.useTenta(me);

	}



}

