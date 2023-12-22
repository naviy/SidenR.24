import { $log } from "@libs";
import { Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileNode3(props: PileNode3.Props & {
	children: JSX.Element
})
{
	$log("PileNode3 " + props.tenta)

	return PileRowNode(props);
}






export module PileNode3
{


	//---




	export type Props = PileRowNode.Props;




	export class Tenta extends PileRowNode.Tenta
	{

		//---


		override bodyIsSeparated()
		{
			let { parent } = this;
			return parent ? parent.opened && !this.collapsed : this.opened;
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
			return this.open();
		}

		override tailSeparate()
		{
			return this.open();
		}

		override bodyDeseparate()
		{
			return this.opened && this.expand();
		}

		override tailDeseparate()
		{
			return this.opened && this.expand();
		}



		//---



		override onTailDeseparated()
		{
			this.hasSeparatedItems && this.forEachTenta(a =>
				a.bodyDeseparate() || a.repaintNearests()
			);
		}


		override onItemSeparated()
		{
			this.tailSeparate();
		}


		override onItemDeseparated()
		{
			!this.hasSeparatedItems && this.tailDeseparate();
		}



		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional(Tenta) { }
	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = (/*id: React.Key,*/ ...args: TArgs) => FunctionalTenta;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FT, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory<FunctionalTenta, TArgs>(FunctionalTenta, configGetter);
	}




	//---


}
