import { ErrorBoundary } from "@app";
import { Pane } from '@libs';
import type { Color } from "@mui/material";
import clsx from "clsx";
import { Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






//===






export function PileGroupNode2({
	color,
	...props
}: PileGroupNode2.Props & {
	children: JSX.Element | (() => JSX.Element)
})
{
	//$log("GroupNode1 " + props.tenta)

	props.tenta.useInNode();


	//return PileGroupNode(props);
	return PileRowNode<PileGroupNode2.Tenta>({

		tailDecorator: PileGroupNode2.defaultTailDecorator,

		...props,

		backfill: (props.backfill === true
			? ((tenta) => PileRowNode.defaultBackfill(tenta, color))
			: props.backfill
		),

		bg: "transparent",
		//pl: 32,
		pr: 24,

		style: color ? { color: color[700], ...props.style } : props.style,

	});

}






export module PileGroupNode2
{


	//---




	export interface Props extends PileRowNode.Props<Tenta>
	{
		color?: Color;
	}




	export class Tenta extends PileRowNode.Tenta
	{

		//---



		override get maxExpandPhase() { return 0; }


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



		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional(Tenta) { }
	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = Tenta_.Functional.Factory<FunctionalTenta, TArgs>;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FunctionalTenta, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory<FunctionalTenta, TArgs>(FunctionalTenta, configGetter);
	}




	//---




	export function defaultTailDecorator(tenta: Tenta_.Base)
	{

		return <>
			{tenta.collectors?.map(col =>
				<Tail
					key={col.id}
					collector={col}
					children={col.defaultListElement()}
				/>
			)}
		</>;
	}




	//---




	export function Tail({

		collector,

		children,

		...colProps

	}: Pane.ColProps & {

		collector: Tenta_.Collector;

	})
	{


		return (

			<ErrorBoundary>

				<Pane.Col

					start
					end

					{...colProps}

					wrapperCls={clsx(`px36 pb12`, colProps.wrapperCls)}
				>

					{children}

				</Pane.Col>

			</ErrorBoundary>

		);

	}




	//---


}