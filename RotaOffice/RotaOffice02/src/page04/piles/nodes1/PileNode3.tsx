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

		override getRestState(stage: Tenta_.Stage)
		{

			let collapsed = stage === "collapsed";
			let opened = stage === "opened";

			return {
				bodyIsSeparated: opened,
				tailIsVisible: !collapsed,
				tailIsSeparated: opened,
			};

		}

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional(Tenta) { }
	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = (...args: TArgs) => FunctionalTenta;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FT, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory<FunctionalTenta, TArgs>(FunctionalTenta, configGetter);
	}




	//---


}
