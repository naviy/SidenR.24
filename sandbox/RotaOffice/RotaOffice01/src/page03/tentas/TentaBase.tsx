import type { Constructor } from '@libs';






//===






export interface TentaBase
{

	disabled: boolean;

}






export function TentaBase<TBase extends Constructor>(Base: TBase)
{
	return class TentaBaseClass extends Base implements TentaBase
	{

		disabled = false;

	};
}






export module TentaBase
{



	export interface UseConfig
	{
	}


	export function use(me: TentaBase, cfg?: UseConfig)
	{

	}



}

