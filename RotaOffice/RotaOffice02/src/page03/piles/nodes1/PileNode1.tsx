import { Div, Focuser, Pane, useNew } from '@libs';
import { PileNode1Behavior } from "./PileNode1_Behavior";
import { Pile } from "../core";
import { PileNodeRow1 } from "./PileNodeRow1";
import { PileNodeTail1 } from "./PileNodeTail1";






//===






export interface PileNode1Props extends Omit<Pane.RowProps, "id" | "children">
{
	id: React.Key;
	linkToNext?: boolean;
}




export function PileNode1({
	id,
	linkToNext,
	...rowProps
}: PileNode1Props & {
	children: [JSX.Element, JSX.Element]
})
{

	let tenta = useNew(PileNode1Behavior).use({ id });

	let { collapsed, expanded, opened, isFirst, isLast, topStage, btmStage, placeholder } = tenta;

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
						start={!tenta.collapsed || isFirst || !placeholder!.prior!.collapsed}
						end={!tenta.collapsed || isLast || !placeholder!.next!.collapsed}
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
								end={tenta.collapsed}

								bl={!collapsed ? "lg" : undefined}
								br={!collapsed ? "lg" : undefined}
								bt={!collapsed ? "lg" : !isFirst && collapsed && !placeholder!.prior!.collapsed ? "md" : undefined}
								bb={!collapsed ? "lg" : !isLast && collapsed && !placeholder!.next!.collapsed ? "md" : undefined}
								rt={collapsed && !isFirst && !placeholder!.prior!.collapsed ? "xs" : expanded && !isFirst ? "sm" : undefined}
								rb={collapsed && !isLast && !placeholder!.next!.collapsed ? "xs" : expanded && !isLast ? "sm" : undefined}

								e={opened ? "L1" : expanded ? "L2" : btmStage === "expanded" ? "L3b" : btmStage === "opened" ? "L2b" : topStage === "expanded" ? "L3t" : topStage === "opened" ? "L2t" : "0"}
								ff
							>

								{parts[0]}

							</Pane.Row>

						</Focuser>

						{parts[1] &&

							<Focuser ref={tenta.itemsFfRef} ghost>

								<PileNodeTail1
									expanded={tenta.opened}
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