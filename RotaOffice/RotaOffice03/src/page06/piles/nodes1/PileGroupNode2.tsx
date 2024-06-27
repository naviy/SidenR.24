import { ErrorBoundary } from "@app";
import { Div, Pane } from '@libs';
import type { Color } from "@mui/material";
import { lighten, styled } from "@mui/material/styles";
import type { ReactNode } from "react";
import { Tenta as Tenta_ } from "../../tentas";
import "./PileGroupNode2.scss";
import { PileRowNode } from "./PileRowNode";






//===






export function PileGroupNode2({
	color,
	...props
}: PileGroupNode2.Props & {
	children: JSX.Element | (() => JSX.Element)
})
{
	//$log("PileGroupNode2 " + props.tenta)
	let { backfill } = props;


	return PileRowNode<PileGroupNode2.Tenta>({

		decorator: PileGroupNode2.defaultDecorator,

		tailDecorator: PileGroupNode2.defaultTailDecorator,

		...props,

		backfill: (typeof backfill === "function"
			? props.backfill
			: ((tenta) => PileGroupNode2.defaultBackfill(tenta, color, backfill as boolean))
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


		//@$log.m
		override getRestState(
			expandPhase: Tenta_.ExpandPhase,
			openPhase: Tenta_.OpenPhase
		)
		{

			return {

				bodyIsSeparated: false,
				//bodyIsSeparated: !!openPhase,

				tailIsVisible: !!openPhase && this.hasCollectors,
				tailIsSeparated: !!openPhase,

			};

		}


		//---

	}



	//---




	export class FunctionalTenta extends Tenta_.Functional<
		typeof Tenta, Tenta, typeof PileGroupNode2
	>(Tenta) { }

	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = Tenta_.Functional.Factory<
		FunctionalTenta, typeof PileGroupNode2, TArgs
	>;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FunctionalTenta, typeof PileGroupNode2, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory(FunctionalTenta, PileGroupNode2, configGetter);
	}



	//---



	export function defaultDecorator(tenta: Tenta, children: ReactNode)
	{
		return <Div
			relative
			animated
			px24
			pt={tenta.tailIsVisibleAndSeparated /*&& !tenta.isFirstSibling*/ ? 24 : 8}
			pb={tenta.tailIsVisibleAndSeparated ? 0 : 8}
			children={children}
		/>;
	}



	export function defaultTailDecorator(
		tenta: Tenta,
		renderCol?: (col: Tenta_.Collector) => ReactNode,
	)
	{

		renderCol ??= col => <Pane.Col
			start
			end
			wrapperCls="pl36"
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



	export function defaultBackfill(
		tenta: Tenta_.Base,
		color?: Color | null,
		bg?: boolean
	)
	{

		if (color && (color as any)["10"] == null)
		{
			(color as any)["10"] = lighten(color[50], .75);
		}


		if (!bg)
		{
			return (
				<Backfill
					brd={color ? `1px solid ${color?.[100]}` : undefined}
					visible={tenta.tailIsVisibleAndSeparated}
				/>
			);
		}


		return (
			<Backfill
				bg={color ? (color as any)["10"] : undefined}
				brd={color ? `2px solid ${color?.[200]}` : undefined}
				visible={tenta.tailIsVisibleAndSeparated}
			/>
		);
	}



	export var Backfill = styled(
		"div",
		{
			target: "pile-group-node-2-backfill",
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