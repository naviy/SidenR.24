import { ErrorBoundary } from "@app";
import { Div, Focuser, Pane } from '@libs';
import { Tenta } from "../../tentas";
import { Pile } from "../core";
import { PileNode1Tenta } from "./PileNode1_Tenta";
import { PileNodeTail1 } from "./PileNodeTail1";






//===






export interface PileNode2Props extends Omit<Pane.RowProps, /*"id" | */"children">
{
	tenta: PileNode2.Tenta;
	linkToNext?: boolean;
	backfill?: boolean;
}




export function PileNode2({
	tenta,
	linkToNext,
	backfill,
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
	let isAccented = tenta.isAccented();

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

				<Div relative>

					<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />

					{/*<Pile.ListBackfill mb={!tenta.parent ? 0 : 24} />*/}
					{backfill && <Pile.Backfill mb={tailIsVisible ? 24 : 48} />}


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

							rt={topMargin >= 2 ? "md" : topMargin === 1 ? "sm" : ""}
							rb={btmMargin >= 2 ? "md" : btmMargin === 1 ? "sm" : ""}

							bl={isAccented ? "lg" : undefined}
							br={isAccented ? "lg" : undefined}
							bt={topMargin && isAccented ? "lg" : topMargin >= 2 ? "md" : topMargin === 1 ? "md" : "sm"}
							bb={btmMargin && isAccented ? "lg" : btmMargin >= 2 ? "md" : btmMargin === 1 ? "md" : ""}

							e={isAccented ? "L2" : undefined}

							{...rowProps}

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
								start={tailIsSeparated}
								expanded={tailIsVisible}
								indent={tailIsSeparated}
								rt={tailIsSeparated ? "lg" : undefined}
								rb={tailIsSeparated ? "lg" : undefined}
								bt={tailIsSeparated ? "md" : undefined}
								bb={tailIsSeparated ? "md" : undefined}
								cellIndent
								pt={!tailIsVisible || !parts[1] ? 0 : btmMargin * 12 as any}
								mb={(tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsSeparated ? 24 : 0) as any}
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



		override onPhaseUp()
		{

			//_$log("onPhaseUp " + this)

			this.forEachTenta(a =>
				this.collapsed && a.open() || a.repaintNearests()
			);

		}


		override onPhaseDown()
		{

			//_$log("onPhaseDown " + this)

			this.forEachTenta(a =>
				!this.opened && a.collapse() || a.repaintNearests()
			);

		}



		override onItemPhaseUp(item: Tenta.Base)
		{

			//_$log("onItemPhaseUp " + this)

			if (item.opened)
			{
				this.open();
			}

			//this.forEachTenta(a =>
			//	!this.opened && a.collapse()
			//);

		}


		override onItemPhaseDown(item: Tenta.Base)
		{

			//_$log("onItemPhaseDown " + this)

			if (item.collapsed && this.allTentas(a => a.collapsed))
			{
				this.expand();
			}

			//this.forEachTenta(a =>
			//	!this.opened && a.collapse()
			//);

		}



		//---

	}




	//---


}