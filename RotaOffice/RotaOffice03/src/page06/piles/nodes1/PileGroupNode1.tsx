import { ErrorBoundary } from "@app";
import { Pane } from "@libs";
import type { Color } from "@mui/material";
import { lighten, styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import { Tenta as Tenta_ } from "../../tentas";
import "./PileGroupNode1.scss";
import { PileRowNode } from "./PileRowNode";






//===






export function PileGroupNode1({
	color,
	...props
}: PileGroupNode1.Props & {
	children: JSX.Element | (() => JSX.Element)
})
{
	//$log("PileGroupNode1 " + props.tenta)


	return PileRowNode<PileGroupNode1.Tenta>({

		tailDecorator: PileGroupNode1.defaultTailDecorator,

		...props,

		backfill: (props.backfill === true
			? ((tenta) => PileGroupNode1.defaultBackfill(tenta, color))
			: props.backfill
		),

		bg: "transparent",
		//pl: 32,
		pr: 24,

		style: color ? { color: color[700], ...props.style } : props.style,

	});

}






export module PileGroupNode1
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


		//@$log.m
		override getRestState(
			expandPhase: Tenta_.ExpandPhase,
			openPhase: Tenta_.OpenPhase
		)
		{

			return {

				bodyIsSeparated: !!openPhase,

				tailIsVisible: !!openPhase && this.hasCollectors,
				tailIsSeparated: !!openPhase,

			};

		}



		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional<
		typeof Tenta, Tenta, typeof PileGroupNode1
	>(Tenta) { }

	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = Tenta_.Functional.Factory<
		FunctionalTenta, typeof PileGroupNode1, TArgs
	>;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FunctionalTenta, typeof PileGroupNode1, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory(FunctionalTenta, PileGroupNode1, configGetter);
	}




	//---




	export function defaultTailDecorator(
		tenta: Tenta,
		renderCol?: (col: Tenta_.Collector) => ReactNode,
	)
	{

		renderCol ??= col => <Pane.Col
			start
			end
			wrapperCls="px36"
			children={col.defaultListElement()}
		/>;


		return <>
			{tenta.collectors?.map(col =>
				<ErrorBoundary key={col.id}>
					{renderCol!(col)}
				</ErrorBoundary>
			)}
		</>;

	}




	//---




	export function defaultBackfill(tenta: Tenta_.Base, color?: Color | null)
	{
		return (
			<Backfill
				bg={color ? lighten(color[50], .5) : undefined}
				brd={color ? `2px solid ${color?.[200]}` : undefined}
				visible={tenta.tailIsVisibleAndSeparated}
			/>
		);
	}



	export var Backfill = styled(
		"div",
		{
			target: "pile-group-node-1-backfill",
			shouldForwardProp: p => p !== "bg" && p !== "brd" && p !== "visible",
		}
	)<{
		bg?: string;
		brd?: string;
		visible?: boolean;
	}>(props => ({

		"--bg": props.bg,
		"--brd": props.brd,
		"--op": props.visible !== false ? 1 : undefined

	}));




	//---


}