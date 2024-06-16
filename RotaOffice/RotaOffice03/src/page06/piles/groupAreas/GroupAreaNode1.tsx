import { Tenta as Tenta_ } from "../../tentas";
import { GroupAreaNode } from "../groupAreas/GroupAreaNode";






//===






export function GroupAreaNode1(props: GroupAreaNode1.Props & {
	children: JSX.Element | (() => JSX.Element)
})
{
	//$log("GroupNode1 " + props.tenta)

	props.tenta.use();


	return GroupAreaNode(props);

}






export module GroupAreaNode1
{


	//---




	export interface Props extends GroupAreaNode.Props<Tenta>
	{
	}




	export class Tenta extends GroupAreaNode.Tenta
	{

		//---



		override get maxExpandPhase() { return 0; }


		//@$log.m
		override getRestState(
			expandPhase: Tenta_.ExpandPhase,
			openPhase: Tenta_.OpenPhase
		)
		{

			return {

				bodyIsSeparated: true,

				tailIsVisible: !!openPhase && this.hasCollectors,
				tailIsSeparated: true,

			};

		}


		//override onItemBodyDeseparated()
		//{
		//	this.refresh();
		//}


		//override onItemBodySeparated()
		//{
		//	this.refresh();
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