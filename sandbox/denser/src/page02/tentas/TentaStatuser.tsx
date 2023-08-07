import { Constructor } from '@libs';






//===






export interface TentaStatuser
{

	disabled: boolean;

}






export function TentaStatuser<TBase extends Constructor>(Base: TBase)
{
	return class TentaStatuserClass extends Base implements TentaStatuser
	{

		disabled = false;

	};
}






export module TentaStatuser
{


	export interface UseConfig
	{
	}


	export function use(me: TentaStatuser, cfg?: UseConfig)
	{
	}


}

