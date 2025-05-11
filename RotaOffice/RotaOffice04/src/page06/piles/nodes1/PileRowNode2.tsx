import type { ReactNode } from "react";
import { Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileRowNode2(props: PileRowNode2.Props & {
	children: ReactNode | (() => ReactNode)
})
{
	//$log("PileRowNode2 " + props.tenta)

	return PileRowNode<PileRowNode2.Tenta>({

		border: true,
		forefill: true,

		...props,

	});

}






export module PileRowNode2
{


	//---




	export interface Props extends PileRowNode.Props<Tenta>
	{
	}




	export class Tenta extends PileRowNode.Tenta<{
		tabsIsVisible: boolean
	}>
	{

		//---



		//@$log.m
		override getRestState(
			expandPhase: Tenta_.ExpandPhase,
			openPhase: Tenta_.OpenPhase
		)
		{

			let collapsed = !expandPhase;
			let closed = !openPhase;


			return {

				bodyIsSeparated: !collapsed,
				//bodyIsSeparated: this.maxExpandPhase ===1,

				tailIsVisible: !closed && this.hasCollectors,
				tailIsSeparated: expandPhase === this.maxExpandPhase || this.hasBodySeparatedItems,

				//tabsIsVisible: tailIsVisible && (tailIsSeparated || openPhase > 1),
				tabsIsVisible: this.hasCollectors && (!collapsed || openPhase > 1),

			};

		}


		override onItemBodyDeseparated()
		{
			this.refresh();
		}


		override onItemBodySeparated()
		{
			this.refresh();
		}



		//---



		//override  async onRightKey()
		//{

		//	if (!this.closed && this.collapsed)
		//		this.expand();

		//	if (this.open())
		//		return;


		//	if (this.scrollIntoViewTop())
		//		return;


		//	if (await this.focusTail())
		//		return;


		//	await this.shakeBody();

		//}



		override  async onLeftKey()
		{

			if (this.hasCollectors)
			{
				if (!this.collapse())
					if (!this.close())
						this.focusParentBody();
			}
			else
			{
				this.collapse()

				if (this.collapsed)
					if (!this.close())
					{
						this.focusParentBody();
					}
			}


			this.scrollIntoView();

		}



		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional<
		typeof Tenta, Tenta, typeof PileRowNode2
	>(Tenta) { }

	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = Tenta_.Functional.Factory<
		FunctionalTenta, typeof PileRowNode2, TArgs
	>;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FunctionalTenta, typeof PileRowNode2, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory(FunctionalTenta, PileRowNode2, configGetter);
	}




	//---


}