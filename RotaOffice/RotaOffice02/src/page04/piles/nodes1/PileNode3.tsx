import { Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileNode3(props: PileNode3.Props & {
	children: JSX.Element
})
{
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



		//---



		override onPhaseDown()
		{

			//_$log("onPhaseDown " + this)

			this.expanded && this.forEachTenta(a =>
				a.collapse()// || a.repaintNearests()
			);

		}



		override onItemPhaseUp(item: Tenta_.Base)
		{
			//_$log(this+".onItemPhaseDown")
			//__$log("maxItemStage:", this.maxItemStage);

			if (this.hasSeparatedItems)
			//if (!item.collapsed && this.anyTenta(a => !a.collapsed))
			{
				this.open();
			}
		}


		override onItemPhaseDown(item: Tenta_.Base)
		{

			if (!this.hasSeparatedItems)
			//if (item.collapsed && this.allTentas(a => a.collapsed))
			{
				this.expand();
			}

		}



		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional(Tenta) { }
	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = (id: React.Key, ...args: TArgs) => FunctionalTenta;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;
	

	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FT, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory<FunctionalTenta, TArgs>(FunctionalTenta, configGetter);
	}




	//---


}
