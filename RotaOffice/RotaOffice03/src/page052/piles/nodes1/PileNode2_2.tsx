import Tab from "@mui/material/Tab";
import muiTabs from "@mui/material/Tabs";
import { styled } from "@mui/material/styles";
import { Tenta as Tenta_ } from "../../tentas";
import { PileRowNode } from "./PileRowNode";
import { $log, Div, FillFade, Pane } from "@libs";
import { PileNodeTail1 } from "./PileNodeTail1";
import { usePileCellIndent } from "../core/PileCellIndent";






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




	export class Tenta extends PileRowNode.Tenta<{
		tabsIsVisible: boolean
	}>
	{

		//---



		static useByPhase(): Tenta
		{
			let tenta = Tenta_.useByPhase()!;

			if (!tenta || !(tenta instanceof PileNode2_2.Tenta))
				throw Error(`tenta is ${tenta}`);

			return tenta;
		}



		//---



		override get maxOpenPhase() { return Math.max(0, this.collectorCount) }



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

			let tailIsVisible = !closed && this.hasCollectors;
			let tailIsSeparated = expandPhase === this.maxExpandPhase || this.hasBodySeparatedItems;


			return {

				bodyIsSeparated: !collapsed,

				tailIsVisible,
				tailIsSeparated,

				//tabsIsVisible: tailIsVisible && (tailIsSeparated || openPhase > 1),
				tabsIsVisible: this.hasCollectors && (!collapsed || !closed && openPhase > 1),

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


		//@$log.m
		treeCollapse()
		{

			if (this.collapse())
				return true;


			if (this.hasBodySeparatedItems)
			{
				//this.forEachTenta(a => a.bodyDeseparate())
				this.forEachTenta(treeBodyDesaparate);
				return true;
			}

			//this.parentTenta?.refresh();

			return false;


			function treeBodyDesaparate(tenta: Tenta_.Base)
			{
				tenta.forEachTenta(treeBodyDesaparate)
				tenta.bodyDeseparate();
			}

		}




		//---



		protected override async onRightKey()
		{

			if (!this.closed && this.collapsed)
				this.expand();

			if (this.open())
				return;


			if (await this.scrollIntoViewTop())
				return;


			if (await this.focusTail())
				return;


			await this.shakeBody();

		}



		protected override async onLeftClick()
		{

			if (!this.bodyIsFocused)
			{
				await this.focusBody();
				return;
			}


			if (this.open())
				return;


			if (await this.scrollIntoViewTop())
				return;


			await this.shakeBody();

		}



		//---



		override  async onLeftKey()
		{

			this.close();

			if (this.closed && !this.collapsed)
				this.collapse();

			this.scrollIntoView();

		}



		override async onRightClick()
		{

			if (!this.bodyIsFocused)
			{
				await this.focusBody();
			}
			else if (this.close())
			{
				await this.scrollIntoView();
			}
			else
			{
				await this.unfocusBody();
			}

		}



		//---



		override async onEnter()
		{

			if (this.expand())
			{
				if (this.expanded)
				{
					this.closed && this.open();
					await this.scrollIntoViewTop();
				}
			}
			else
			{
				!this.opened && this.open();
				await this.scrollIntoViewTop();
			}

		}



		override async onExit()
		{

			if (this.treeCollapse())
			{
				await this.scrollIntoView();
			}
			else
			{
				await this.unfocusBody();
			}

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