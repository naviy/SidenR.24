import { ErrorBoundary } from "@app";
import { Div, Focuser, Pane } from '@libs';
import { Tenta } from "../../tentas";
import { Pile } from "../core";
import { PileNode1Tenta } from "./PileNode1_Tenta";
import { PileNodeTail1 } from "./PileNodeTail1";






//===






interface PileNode3Props extends Omit<Pane.RowProps, /*"id" |*/ "children">
{
	readonly tenta: PileNode3.Tenta;
	readonly linkToNext?: boolean;
}




export function PileNode3({
	tenta,
	linkToNext,
	...rowProps
}: PileNode3Props & {
	children: [JSX.Element, JSX.Element]
})
{

	//let tenta = Tenta.useById(PileNode1Tenta, id);

	//tenta.use({ collectors });
	tenta.use();

	let { collapsed, expanded, opened, isFirst, isLast, topStage, btmStage, prior, next } = tenta;

	let parts = rowProps.children;


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
					pb={btmStage === "expanded" ? 16 : btmStage === "opened" ? 24 : 0}
					animated
				>

					<Pile.ListBackfill visible={tenta.opened && (!tenta.parent || tenta.parent.opened)} />

					<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />


					<Pane.Ghost
						start={!tenta.collapsed || isFirst || !tenta.prior()?.collapsed}
						end={!tenta.collapsed || isLast || !tenta.next()?.collapsed}
						{...rowProps}
					>

						<Focuser
							ref={tenta.ffRef}
							//name={`pile-row-body#${id}`}
							listener={tenta}
							autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
						>

							<Pane.Row

								start
								end={!tenta.expanded}

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

									{parts[0]}
									{/*<Pane.Col start end>*/}
									{/*	<Pane.Row start end>*/}
									{/*		{parts[0]}*/}
									{/*		<Div pl4 fill><b>#{tenta.iid}</b></Div>*/}
									{/*	</Pane.Row>*/}
									{/*	<Div pl48>*/}
									{/*		<Tenta.Details tenta={tenta} />*/}
									{/*	</Div>*/}
									{/*</Pane.Col>*/}

								</ErrorBoundary>

							</Pane.Row>

						</Focuser>

						{parts[1] &&

							<Focuser ref={tenta.itemsFfRef} ghost>

								<PileNodeTail1
									bt={tenta.opened ? "md" : "sm"}
									rt={tenta.opened ? "lg" : ""}
									start={tenta.opened}
									expanded={!tenta.collapsed}
									indent={tenta.opened}
									cellIndent
									children={parts[1]}
								/>

							</Focuser>
						}

					</Pane.Ghost>


				</Div>

			</Focuser>

		</Pile.Node>

	);

}






export module PileNode3
{

	//---



	export type Props = PileNode3Props;


	export class Tenta extends PileNode1Tenta
	{
		override collectorIsVisible()
		{
			return this.expanded;
		}
	}



	//export const newTenta: Tenta.Descriptor["newTenta"] = (collector, props) =>
	//{
	//	return new PileNode1Tenta(collector, props)
	//};



	//export const getMargin: Tenta.Descriptor["getMargin"] = tenta =>
	//{

	//	let { stage } = tenta;

	//	return stage === "opened" ? [24, 1] : null;

	//};



	//---

}
//let qqq: Tenta.Descriptor = PileNode3;