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

		override tailIsVisible()
		{
			return !this.collapsed;
		}

		override bodyIsSeparated()
		{
			let { parent } = this;
			return parent ? parent.opened && this.opened : this.opened;
		}

		override tailIsSeparated()
		{
			return this.opened;
		}

	}



	//---

}
