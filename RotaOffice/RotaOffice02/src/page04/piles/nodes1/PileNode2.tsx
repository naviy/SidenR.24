import { $log } from "@libs";
import { TentaStage, Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileNode2(props: PileNode2.Props & {
	children: JSX.Element
})
{
	$log("PileNode2 " + props.tenta)

	return PileRowNode(props);
}






export module PileNode2
{


	//---




	export type Props = PileRowNode.Props;




	export class Tenta extends PileRowNode.Tenta
	{

		//---



		override getRestState(stage: TentaStage)
		{

			let collapsed = stage === "collapsed";
			let opened = stage === "opened";

			return {
				bodyIsSeparated: !collapsed,
				bodyIsAccented: !collapsed,
				tailIsVisible: !collapsed,
				tailIsSeparated: opened,
			};
		}


		//override bodySeparate()
		//{
		//	return this.collapsed && this.expand();
		//}

		//override tailSeparate()
		//{
		//	return this.open();
		//}

		//override bodyDeseparate()
		//{
		//	return this.collapse();
		//}

		//override tailDeseparate()
		//{
		//	return this.opened && this.expand();
		//}



		//---



		//override onTailDeseparated()
		//{
		//	this.hasSeparatedItems && this.forEachTenta(a =>
		//		a.bodyDeseparate() || a.repaintNearests()
		//	);
		//}


		//override onItemSeparated()
		//{
		//	this.tailSeparate();
		//}


		//override onItemDeseparated()
		//{
		//	!this.hasSeparatedItems && this.tailDeseparate();
		//}



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