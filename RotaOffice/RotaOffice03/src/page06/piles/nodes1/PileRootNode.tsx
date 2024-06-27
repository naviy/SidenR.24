import { Focuser } from '@libs';
import { createRef, type ReactNode } from "react";
import { ErrorBoundary } from '../../../@app';
import { Tenta as Tenta_ } from "../../tentas";






//===






export function PileRootNode({

	tenta,

	tailDecorator,

}: PileRootNode.Props & {

	children?: JSX.Element | (() => JSX.Element)

})
{

	tenta.useInNode();


	tailDecorator ??= PileRootNode.defaultTailDecorator;


	return (

		<Focuser ref={tenta.tailFfRef} ghost>

			{tailDecorator(tenta)}

		</Focuser>

	);

}











export module PileRootNode
{


	//---




	export interface Props
	{
		tenta: Tenta;

		tailDecorator?: PileRootNode.TailDecorator;
	}




	export class Tenta extends Tenta_.Base
	{

		//---


		tailFfRef = createRef<Focuser>();
		get tailFf(): Focuser | null { return this.tailFfRef.current; }


		override get maxOpenPhase() { return 0; }
		override get maxExpandPhase() { return 0; }


		//---


		override use(cfg?: Tenta_.Base.UseConfig)
		{

			this.rootFfRef = this.tailFfRef;

			this.hideChildrenLinks = false;


			super.use(cfg);


			this.useGlobalState();


			return this;

		}


		override getRestState()
		{
			return {
				bodyIsSeparated: false,
				tailIsVisible: true,
				tailIsSeparated: true,
			};
		}


		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional<
		typeof Tenta, Tenta, typeof PileRootNode
	>(Tenta) { }

	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = Tenta_.Functional.Factory<
		FunctionalTenta, typeof PileRootNode, TArgs
	>;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;



	export function createFactory<TArgs extends any[] = []>(
		colsGetter: (...args: TArgs) => Tenta_.Collector.Tentas
	): TentaFactory<TArgs>
	{

		return Tenta_.Functional.createFactory(

			FunctionalTenta,

			PileRootNode,

			(...args: TArgs) =>
			{
				return ["root", { cols: () => colsGetter(...args) }, undefined];
			}

		);

	}




	//---




	export type Decorator<TTenta extends Tenta_.Base = Tenta_.Base> =
		(tenta: TTenta, children: ReactNode) => ReactNode;
	export type TailDecorator = (tenta: Tenta) => ReactNode;




	export function defaultTailDecorator(tenta: Tenta)
	{
		return <>
			{tenta.collectors?.map(col =>
				<ErrorBoundary key={col.id}>
					{col.defaultListElement()}
				</ErrorBoundary>
			)}
		</>;
	}




	//---


}