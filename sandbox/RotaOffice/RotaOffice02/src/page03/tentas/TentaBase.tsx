import { GlobalState, type Constructor } from '@libs';
import type { TentaPlaceholder } from "./TentaPlaceholder";
import type { TentaStage } from "./TentaStage";






//===






export interface TentaGlobalState extends GlobalState
{

	stage?: TentaStage;
	focused?: boolean;

}






export interface TentaBase
{

	placeholder?: TentaPlaceholder.Behavior;

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


}






export function TentaBase<TBase extends Constructor>(Base: TBase)
{

	return class TentaBaseClass extends Base implements TentaBase
	{

		//---



		placeholder?: TentaPlaceholder.Behavior;

		disabled = false;



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

		readonly placeholder?: TentaPlaceholder.Behavior | null;

	}


	export function use(me: TentaBase, cfg?: UseConfig)
	{

		me.placeholder = cfg?.placeholder || undefined;
		me.placeholder?.useTenta(me);


	}



}

