import type { ReactNode } from "react";
import { Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileNode4(props: PileNode4.Props & {
	children: ReactNode
})
{
	//$log("PileNode4 " + props.tenta)
	props.tenta.use();
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



		override getRestState(stage: Tenta_.Stage)
		{

			let collapsed = stage === "collapsed";

			return {
				bodyIsSeparated: !collapsed,
				tailIsVisible: !collapsed && this.hasCollectors,
				tailIsSeparated: !collapsed,
			};
		}



		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional(Tenta) { }
	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = (...args: TArgs) => FunctionalTenta;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FT, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory<FunctionalTenta, TArgs>(FunctionalTenta, configGetter);
	}




	//---


}
