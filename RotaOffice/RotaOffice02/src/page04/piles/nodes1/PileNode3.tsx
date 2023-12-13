import { Tenta as Tenta_ } from "../../tentas";
import { PileNode1Tenta } from "./PileNode1_Tenta";
import { PileNode2, type PileNode2Props } from "./PileNode2";






//===






type PileNode3Props = PileNode2Props;




export function PileNode3(props: PileNode3Props & {
	children: JSX.Element | [JSX.Element, JSX.Element]
})
{
	return PileNode2(props);
}






export module PileNode3
{


	//---




	export type Props = PileNode3Props;




	export class Tenta extends PileNode1Tenta
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
			//_$log(this + ".onItemPhaseUp " + item)

			if (!item.collapsed && this.anyTenta(a => !a.collapsed))
			{
				this.open();
			}
		}


		override onItemPhaseDown(item: Tenta_.Base)
		{

			if (item.collapsed && this.allTentas(a => a.collapsed))
			{
				this.expand();
			}

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
