import { Tenta as Tenta_ } from "../../tentas";
import { PileNodeBase } from "./PileNodeBase";






//===






export function PileNode4(props: PileNode4.Props & {
	children: JSX.Element | [JSX.Element, JSX.Element]
})
{
	return PileNodeBase(props);
}






export module PileNode4
{


	//---




	export type Props = PileNodeBase.Props;




	export class Tenta extends PileNodeBase.Tenta
	{

		//---



		constructor(id: React.Key)
		{
			super(id);

			this.initPhase({ maxPhase: 1, defaultStage: "opened" })
		}



		//---



		override bodyIsSeparated()
		{
			return !this.collapsed;
		}


		override tailIsVisible()
		{
			return !this.collapsed;
		}


		override tailIsSeparated()
		{
			return !this.collapsed;
		}



		//---

	}




	//---




	export class FT extends Tenta_.Functional(Tenta)	{	}


	export type Factory<TArgs extends any[] = []> = (id: React.Key, ...args: TArgs) => FT;
	

	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FT, TArgs>
	): Factory<TArgs>
	{
		return Tenta_.Functional.createFactory<FT, TArgs>(FT, configGetter);
	}




	//---


}
