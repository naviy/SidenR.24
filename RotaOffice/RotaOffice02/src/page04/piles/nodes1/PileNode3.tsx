import { _$log, __$log } from "../../../@libs";
import type { TentaBase } from "../../tentas/TentaBase";
import { PileNode1Tenta } from "./PileNode1_Tenta";
import { PileNode2, type PileNode2Props } from "./PileNode2";






//===






type PileNode3Props = PileNode2Props;




export function PileNode3(props: PileNode3Props & {
	children: [JSX.Element, JSX.Element]
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
			return parent ? parent.opened && this.opened : this.opened;
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



		override decompress()
		{
			return super.decompress((phase) =>
				!!this.parent?.opened && phase === this.expandedPhase
			);
		}


		override compress()
		{
			return super.compress((phase) =>
				!!this.parent?.opened && phase === this.expandedPhase
			);
		}



		override onItemDecompressed(item: TentaBase)
		{
			_$log(this + ".onItemDecompressed " + item)

			if (item.expanded)
			{
				this.open();
			}
		}


		override onItemCompressed(item: TentaBase)
		{
			_$log(this + ".onItemCompressed " + item)

			if (item.collapsed && this.parent?.anyTenta(a => a.anyTenta(b => b.collapsed)))
			{
				this.parent.expand();
			}
		}




		//---

	}




	//---


}
