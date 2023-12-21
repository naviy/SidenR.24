import { Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileNode4(props: PileNode4.Props & {
	children: JSX.Element
})
{
	return PileRowNode(props);
}






export module PileNode4
{


	//---




	export type Props = PileRowNode.Props;




	export class Tenta extends PileRowNode.Tenta
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




	export class FunctionalTenta extends Tenta_.Functional(Tenta) { }
	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = (/*id: React.Key,*/ ...args: TArgs) => FunctionalTenta;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FunctionalTenta, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory<FunctionalTenta, TArgs>(FunctionalTenta, configGetter);
	}




	//---


}
