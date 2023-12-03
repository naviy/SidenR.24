import { Div, Focuser, Pane } from '@libs';
import { Tenta } from "../../tentas";
import { Pile } from "../core";
import { PileNode1Behavior } from "./PileNode1_Behavior";
import { PileNodeTail1 } from "./PileNodeTail1";
import { ErrorBoundary } from "@app";






//===






export interface PileNode2Props extends Omit<Pane.RowProps, "id" | "children">
{
	readonly id: React.Key;
	readonly collectors?: React.Key[];
	readonly linkToNext?: boolean;
}




export function PileNode2({
	id,
	collectors,
	linkToNext,
	...rowProps
}: PileNode2Props & {
	children: [JSX.Element, JSX.Element]
})
{

	let tenta = Tenta.useById(PileNode1Behavior, id);

	tenta.use({ collectors });

	let { collapsed, expanded, opened, isFirst, isLast, topStage, btmStage } = tenta;

	let parts = rowProps.children;


	return (


		<Pile.Node tenta={tenta}>

			<Focuser ref={tenta.rootFfRef} name={`pile-node#${id}`} ghost focusable>

				<Div
					relative
					pb={btmStage === "expanded" ? 16 : btmStage === "opened" ? 24 : 0}
					animated
				>


					<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />


					<Pane.Ghost
						start={!tenta.collapsed || isFirst || !tenta.prior()?.collapsed}
						end={!tenta.collapsed || isLast || !tenta.next()?.collapsed}
						{...rowProps}
					>

						<Focuser
							ref={tenta.ffRef}
							name={`pile-row-body#${id}`}
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
									start={tenta.opened}
									//end={tenta.opened}
									expanded={!tenta.collapsed}
									indent={tenta.opened}
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






export module PileNode2
{

	//---



	export type Props = PileNode2Props;



	export const newTenta: Tenta.Descriptor["newTenta"] = (collector, props) =>
	{
		return new PileNode1Behavior(collector, props)
	};



	export const getMargin: Tenta.Descriptor["getMargin"] = tenta =>
	{

		let { stage } = tenta;

		return (
			stage === "opened" ? [24, 1] :
				stage === "expanded" ? [12, 0] :
					null
		);

	};



	//---

}
//let qqq: Tenta.Descriptor = PileNode2;