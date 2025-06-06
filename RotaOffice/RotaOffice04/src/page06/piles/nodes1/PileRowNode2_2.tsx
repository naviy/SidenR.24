import { Div, ExpanderBaseBehavior, FillFade, Pane } from "@libs";
import Tab from "@mui/material/Tab";
import muiTabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";
import { createRef, type ReactNode } from "react";
import { ErrorBoundary } from "../../../@app";
import { Tenta as Tenta_ } from "../../tentas";
import { usePileCellIndent } from "../core/PileCellIndent";
import { PileRowNode } from "./PileRowNode";






//===






export function PileRowNode2_2(props: PileRowNode2_2.Props & {
	children: ReactNode | (() => ReactNode)
})
{
	//$log("PileRowNode2_2 " + props.tenta)

	return PileRowNode<PileRowNode2_2.Tenta>({

		//tailReexpand: true,

		border: true,
		forefill: true,

		...props,

		tailExpanderRef: props.tenta.tailExpanderRef,
		tailDecorator: PileRowNode2_2.defaultTailDecorator as PileRowNode.TailDecorator,

	});

}






export module PileRowNode2_2
{


	//---




	export interface Props extends PileRowNode.Props<Tenta>
	{
		//tabCount?: number;
	}




	export class Tenta extends PileRowNode.Tenta<{
		tabsIsVisible: boolean
	}>
	{

		//---



		override get maxOpenPhase() { return Math.max(0, this.collectorCount) }

		tailExpanderRef = createRef<ExpanderBaseBehavior | null>();



		//---



		get activeTabIndex() { return Math.max(-1, this.openPhase - 1); }
		get activeTabCollector() { return this.collectors?.[this.activeTabIndex] || null; }
		get activeTabHasTentas() { return !!this.activeTabCollector?.itemCount; }

		get tabsIsVisible() { return this.state.tabsIsVisible; }

		activateTabByIndex(tabIndex: number)
		{
			this.setOpenPhase(tabIndex + 2);
		}



		override collectorIsVisible(collector: Tenta_.Collector)
		{
			return this.tailIsVisible && collector === this.collectors?.[this.activeTabIndex];
		}


		//override get tailIsVisible()
		//{
		//	return this.state.tailIsVisible && !!this.collectors?.[this.state.phase - 2]?.itemCount;
		//}



		//---



		//@$log.m
		override getRestState(
			expandPhase: Tenta_.ExpandPhase,
			openPhase: Tenta_.OpenPhase
		)
		{

			let collapsed = !expandPhase;
			let closed = !openPhase;

			//let tailIsVisible = !closed && this.hasCollectors;
			//let tailIsSeparated = expandPhase === this.maxExpandPhase || this.hasBodySeparatedItems;


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



		override onOpenPhaseChanged()
		{
			//$log("opened", this.opened);
			if (this.tabsIsVisible || this.priorState?.tabsIsVisible)
			{
				//$log(this + " mustReexpand")
				this.tailExpanderRef.current?.mustReexpand();
			}
		}



		//---

	}




	//---




	export class FunctionalTenta extends Tenta_.Functional<
		typeof Tenta, Tenta, typeof PileRowNode2_2
	>(Tenta) { }

	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = Tenta_.Functional.Factory<
		FunctionalTenta, typeof PileRowNode2_2, TArgs
	>;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FunctionalTenta, typeof PileRowNode2_2, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory(FunctionalTenta, PileRowNode2_2, configGetter);
	}




	//---




	export function CollectorTabs({ tenta }: { tenta: Tenta })
	{

		return <NodeTabs
			value={tenta.activeTabIndex}
			onChange={(e, tabIndex) =>
			{
				e.stopPropagation();
				tenta.focusBody();
				tenta.activateTabByIndex(tabIndex);
			}}
		>

			<ZeroNodeTab value={-1} />
			{tenta.collectors?.map((a, i) =>
				<NodeTab key={a.id} value={i} label={a.title() ?? (a.id + "")} />
			)}

		</NodeTabs>;

	}




	export function CollectorTabsRow({ tenta }: { tenta: Tenta })
	{

		let indent = usePileCellIndent();

		return (
			<Pane.Row expanded={tenta.tabsIsVisible} end bt="xs" >
				<Pane start end p8 pl48>
					<Div style={{ width: indent - 24 }} animated />
					<CollectorTabs tenta={tenta} />
				</Pane>
			</Pane.Row>
		);

	}




	var NodeTabs = styled(muiTabs)({

		minHeight: 24,

		">.MuiTabs-indicator": {
			height: "4px!important",
		},

	})



	var NodeTab = styled(Tab)({

		minHeight: 24,
		padding: "6px 24px 6px 0",
		minWidth: 24,
		fontSize: "1em",
	})


	var ZeroNodeTab = styled(Tab)({

		padding: 0,
		minWidth: 0,
	})




	//---




	export function defaultTailDecorator(
		tenta: Tenta,
		renderCol?: (col: Tenta_.Collector) => ReactNode,
	)
	{

		renderCol ??= col => (
			<PileRowNode.Tail
				collector={col}
				cellIndent
				children={col.defaultListElement()}
			/>
		);


		if (tenta.collectorCount === 1)
		{
			let col = tenta.collectors![0];

			return (
				<ErrorBoundary key={col.id}>
					{renderCol!(col)}
				</ErrorBoundary>
			);
		}


		let activeCol = tenta.activeTabCollector;
		//$log("activeCol:", activeCol?.id)

		return <>
			{tenta.collectors?.map(col =>

				<FillFade
					key={col.id}
					id={col.id + ""}
					in={col === activeCol}
					mountOnEnter
					unmountOnExit
				>

					<ErrorBoundary key={col.id}>
						{renderCol!(col)}
					</ErrorBoundary>

				</FillFade>

			)}
		</>;
	}




	//---


}