import Tab from "@mui/material/Tab";
import muiTabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";
import { TentaStage, Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";
import { $log, FillFade } from "@libs";
import { PileNodeTail1 } from "./PileNodeTail1";






//===






export function PileNode2_2(props: PileNode2_2.Props & {
	children: JSX.Element | (() => JSX.Element)
})
{
	//$log("PileNode2_2 " + props.tenta)

	props.tenta.use();


	return PileRowNode({

		//tailReexpand: true,

		...props,

		tailExpanderRef: props.tenta.tailExpanderRef,
		tailDecorator: PileNode2_2.defaultTailDecorator as PileRowNode.TailDecorator,

	});

}






export module PileNode2_2
{


	//---




	export interface Props extends PileRowNode.Props<Tenta>
	{
		//tabCount?: number;
	}




	export class Tenta extends PileRowNode.Tenta
	{

		//---



		override init()
		{
			this.initPhase({ maxPhase: 1 + Math.max(1, this.collectorCount) });
		}



		//---



		get activeTabIndex() { return Math.max(0, this.phase - 2); }
		get activeTabCollector() { return this.collectors?.[this.activeTabIndex] || null; }
		get activeTabHasTentas() { return !!this.activeTabCollector?.itemCount; }



		activateTabByIndex(tabIndex: number)
		{
			this.setPhase(tabIndex + 2);
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



		override getRestState(stage: TentaStage)
		{

			let collapsed = stage === "collapsed";
			let opened = stage === "opened";


			return {
				//bodyIsSeparated: opened && this.hasSeparatedItems,
				bodyIsSeparated: opened,
				tailIsVisible: !collapsed && this.hasCollectors,
				//tailIsSeparated: opened,
				tailIsSeparated: opened || this.hasSeparatedItems,
				isSeparated: opened,
			};

		}


		override onItemDeseparated()
		{
			this.refresh();
		}


		override onItemSeparated()
		{
			this.refresh();
		}


		override onDecPhase()
		{
			this.hasSeparatedItems && this.forEachTenta(a => a.bodyDeseparate());
			this.parent?.refresh();
		}



		//---



		override onPhaseChanged(priorPhase: number)
		{
			//$log("opened", this.opened);
			if (priorPhase > this.openedPhase || this.phase > this.openedPhase)
			{
				$log(this + " mustReexpand")
				this.tailExpanderRef.current?.mustReexpand();
			}
		}



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



	export function Tabs({ tenta }: { tenta: Tenta })
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

			{tenta.collectors?.map(a =>
				<NodeTab key={a.id} label={a.title() ?? (a.id + "")} />
			)}

		</NodeTabs>;

	}




	var NodeTabs = styled(muiTabs)({

		minHeight: 24,

		">.MuiTabs-indicator": {
			height: "4px!important",
		},

	})



	var NodeTab = styled(Tab)({

		minHeight: 24,
		padding: "6px 12px 6px 0",
		minWidth: 24,
		fontSize: "1em",
	})




	//---




	export function defaultTailDecorator(tenta: Tenta)
	{

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

					<PileNodeTail1
						key={col.id}
						collector={col}
						cellIndent
						children={col.defaultListElement()}
					//children={<Tenta_.Collector.List bhv={col} />}
					/>

				</FillFade>

			)}
		</>;
	}




	//---


}