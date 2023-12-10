import { ErrorBoundary } from "@app";
import { $log, Div, Focuser, Pane, _$log, __$log, ___$log } from '@libs';
import { Pile } from "../core";
import { PileNode1Tenta } from "./PileNode1_Tenta";
import { PileNodeTail1 } from "./PileNodeTail1";
import { Tenta } from "../../tentas";






//===






export interface PileNode2Props extends Omit<Pane.RowProps, /*"id" | */"children">
{
	readonly tenta: PileNode2.Tenta;
	readonly linkToNext?: boolean;
}




export function PileNode2({
	tenta,
	linkToNext,
	...rowProps
}: PileNode2Props & {
	children: [JSX.Element, JSX.Element]
})
{

	//_$log("PileNode for " + tenta)

	tenta.use();

	let parts = rowProps.children;

	let topMargin = tenta.topMargin();
	let btmMargin = tenta.btmMargin();
	let tailIsVisible = tenta.tailIsVisible();
	let tailIsSeparated = tenta.tailIsSeparated();

	//__$log("topMargin:", topMargin);
	//__$log("btmMargin:", btmMargin);
	//___$log("next.bodyTopMargin:", tenta.next()?.bodyTopMargin());
	//___$log("parentTailBtmMargin:", tenta.parentTailBtmMargin());


	//let isLastest = !tenta.next();


	return (


		<Pile.Node tenta={tenta}>

			<Focuser
				ref={tenta.rootFfRef}
				//name={`pile-node#${id}`}
				ghost
				focusable
			>

				<Div
					relative
					animated
				>

					<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />

					{/*<Pile.ListBackfill mb={!tenta.parent ? 0 : 24} />*/}
					<Pile.ListBackfill mb={24} />


					<Focuser
						ref={tenta.ffRef}
						//name={`pile-row-body#${id}`}
						listener={tenta}
						autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
					>

						<Pane.Row
							//debug
							start
							end={!tailIsVisible || tailIsSeparated}

							rt={topMargin >= 2 ? "lg" : topMargin === 1 ? "sm" : ""}
							rb={btmMargin >= 2 ? "lg" : btmMargin === 1 ? "sm" : ""}

							bt={topMargin >= 2 ? "md" : topMargin === 1 ? "md" : "sm"}
							bb={btmMargin >= 2 ? "md" : btmMargin === 1 ? "md" : ""}

							//e={topMargin === 2 && btmMargin >= 1 || topMargin >= 1 && btmMargin === 2 ? "L1" : topMargin === 1 && btmMargin === 1 ? "L2" : btmMargin === 1 ? "L3b" : btmMargin === 2 ? "L2b" : topMargin === 1 ? "L3t" : topMargin === 2 ? "L2t" : "0"}

							{...rowProps}

							//bl={!collapsed ? "lg" : undefined}
							//br={!collapsed ? "lg" : undefined}
							//bt={!collapsed ? "lg" : !isFirst && collapsed && !placeholder!.prior!.collapsed ? "md" : undefined}
							//bb={!collapsed ? "lg" : !isLast && collapsed && !placeholder!.next!.collapsed ? "md" : undefined}
							//rt={collapsed && !isFirst && !placeholder!.prior!.collapsed ? "xs" : expanded && !isFirst ? "sm" : undefined}
							//rb={collapsed && !isLast && !placeholder!.next!.collapsed ? "xs" : expanded && !isLast ? "sm" : undefined}

							//e={opened ? "L1" : expanded ? "L2" : btmStage === "expanded" ? "L3b" : btmStage === "opened" ? "L2b" : topStage === "expanded" ? "L3t" : topStage === "opened" ? "L2t" : "0"}
							ff
						>

							<ErrorBoundary>
								{tenta.toolsIsVisible ? Tenta.Details.wrap(tenta, parts[0]) : parts[0]}
							</ErrorBoundary>

						</Pane.Row>

					</Focuser>


					{parts[1] !== undefined &&

						<Focuser ref={tenta.itemsFfRef} ghost>

							<PileNodeTail1
								//debug
								//id={"tail3 of " + tenta}
								start={tailIsSeparated}
								expanded={tailIsVisible}
								indent={tailIsSeparated}
								rt={tailIsSeparated ? "lg" : undefined}
								rb={tailIsSeparated ? "lg" : undefined}
								bt={tailIsSeparated ? "md" : undefined}
								bb={tailIsSeparated ? "md" : undefined}
								cellIndent

								mt={!tailIsVisible ? 0 : btmMargin * 12 as any}
								mb={tailIsVisible ? 0 : btmMargin * 12 as any}

								children={parts[1]}
							/>

						</Focuser>
					}


				</Div>

			</Focuser>

		</Pile.Node>

	);

}






export module PileNode2
{


	//---




	export type Props = PileNode2Props;




	export class Tenta extends PileNode1Tenta
	{

		//---



		override bodyIsSeparated()
		{
			return !this.collapsed;
		}

		override tailIsVisible()
		{
			return !this.collapsed;
		}

		override tailIsSeparated()
		{
			return this.opened;
		}



		//---



		override onItemDecompressed(item: Tenta.Base)
		{

			if (item.opened)
			{
				this.open();
			}

		}


		override onDecompressed()
		{

			if (this.opened)
			{
				this.forEachTenta(a =>
					a.expanded && a.open()
				);
			}

		}



		override onItemCompressed(item: Tenta.Base)
		{

			if (!item.collapsed)
			{
				this.expand();

				this.forEachTenta(a =>
					a.opened && a.expand()
				);
			}

		}


		override onCompressed()
		{

			if (this.expanded)
			{
				this.forEachTenta(a =>
					a.opened && a.expand()
				);
			}

		}



		//---

	}




	//---


}