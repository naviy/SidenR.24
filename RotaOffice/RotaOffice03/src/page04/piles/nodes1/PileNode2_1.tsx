import { $log } from "@libs";
import { TentaStage, Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileNode2_1(props: PileNode2_1.Props & {
	children: JSX.Element | (() => JSX.Element)
})
{
	$log("PileNode2_1 " + props.tenta)

	return PileRowNode(props);
}






export module PileNode2_1
{


	//---




	export type Props = PileRowNode.Props;




	export class Tenta extends PileRowNode.Tenta
	{

		override getRestState(stage: TentaStage)
		{

			let collapsed = stage === "collapsed";
			let opened = stage === "opened";

			return {
				//bodyIsSeparated: opened && this.hasSeparatedItems,
				bodyIsSeparated: opened,
				tailIsVisible: !collapsed && this.hasCollectors,
				//tailIsSeparated: opened,
				tailIsSeparated: opened || this.hasSeparatedItems,
			};
		}


		override onItemDeseparated()
		{
			this.refresh();
		}


		override onItemSeparated()
		{
			this.refresh();
		}


		override onDecPhase()
		{
			$log("onDecPhase "+ this)
			this.hasSeparatedItems && this.forEachTenta(a => a.bodyDeseparate());
			this.parent?.refresh();
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