import { _$log, __$log } from "../../../@libs";
import type { TentaBase } from "../../tentas/TentaBase";
import { PileNode1Tenta } from "./PileNode1_Tenta";
import { PileNode2, type PileNode2Props } from "./PileNode2";






//===






type PileNode4Props = PileNode2Props;




export function PileNode4(props: PileNode4Props & {
	children: [JSX.Element, JSX.Element]
})
{
	return PileNode2(props);
}






export module PileNode4
{


	//---




	export type Props = PileNode4Props;




	export class Tenta extends PileNode1Tenta
	{

		//---



		constructor(id: React.Key)
		{
			super(id);

			this.initPhase({ maxPhase: 1, defaultStage: "opened" })

		}



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
			return !this.collapsed;
		}



		//---

	}




	//---


}
