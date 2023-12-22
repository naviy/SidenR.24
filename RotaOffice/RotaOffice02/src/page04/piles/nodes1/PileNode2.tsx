import { $log } from "@libs";
import { Tenta as Tenta_ } from "../../tentas";
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
			return this.opened;
		}


		override bodySeparate()
		{
			return this.collapsed && this.expand();
		}

		override tailSeparate()
		{
			return this.open();
		}

		override bodyDeseparate()
		{
			return this.collapse();
		}

		override tailDeseparate()
		{
			return this.opened && this.expand();
		}



		//---



		//override onSeparated()
		//{
		//	this.hasSeparatedItems && !this.isSeparated() && this.forEachTenta(a =>
		//		this.separate() || a.repaintNearests()
		//	);
		//}



		override onTailDeseparated()
		{
			this.hasSeparatedItems && this.forEachTenta(a =>
				a.bodyDeseparate() || a.repaintNearests()
			);
		}


		override onItemSeparated(item: Tenta_.Base)
		{
			this.tailSeparate();
		}


		override onItemDeseparated(item: Tenta_.Base)
		{
			!this.hasSeparatedItems && this.tailDeseparate();
		}

		//override onPhaseUp()
		//{

		//	//_$log("onPhaseUp " + this)

		//	this.forEachTenta(a =>
		//		this.collapsed && a.open() || a.repaintNearests()
		//	);

		//}


		//override onPhaseDown()
		//{

		//	//_$log("onPhaseDown " + this)

		//	this.forEachTenta(a =>
		//		!this.opened && a.opened && a.expand() || a.repaintNearests()
		//	);

		//}



		//override onItemPhaseUp(item: Tenta_.Base)
		//{

		//	//_$log("onItemPhaseUp " + this)

		//	if (this.hasSeparatedItems)
		//	{
		//		this.open();
		//	}

		//	//this.forEachTenta(a =>
		//	//	!this.opened && a.collapse()
		//	//);

		//}


		//override onItemPhaseDown(item: Tenta_.Base)
		//{

		//	//_$log(this+".onItemPhaseDown")
		//	//__$log("maxItemStage:", this.maxItemStage);
		//	//if (item.collapsed && this.allTentas(a => a.collapsed))
		//	if (!this.hasSeparatedItems)
		//	{
		//		this.expand();
		//	}

		//	//this.forEachTenta(a =>
		//	//	!this.opened && a.collapse()
		//	//);

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