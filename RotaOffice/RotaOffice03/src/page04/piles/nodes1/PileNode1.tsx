import { $log } from "@libs";
import { TentaStage, Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileNode1(props: PileNode1.Props & {
	children: JSX.Element | (() => JSX.Element)
})
{
	//$log("PileNode1 " + props.tenta)

	return PileRowNode(props);
}






export module PileNode1
{


	//---




	export type Props = PileRowNode.Props;




	export class Tenta extends PileRowNode.Tenta
	{

		override getRestState(stage: TentaStage)
		{

			let collapsed = stage === "collapsed";
			//let opened = stage === "opened";

			return {
				bodyIsSeparated: !collapsed,
				tailIsVisible: !collapsed && this.hasCollectors,
				tailIsSeparated: !collapsed,
			};
		}

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