import { Div, Focuser, Pane, useNew } from '@libs';
import { PileNode1Behavior } from "./PileNode1_Behavior";
import { Pile } from "../core";






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

	let { isFirst, isLast, topStage, btmStage, placeholder } = tenta;

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
								end
								bl={!tenta.collapsed ? "lg" : undefined}
								br={!tenta.collapsed ? "lg" : undefined}
								bt={!tenta.collapsed ? "lg" : !isFirst && tenta.collapsed && !placeholder!.prior!.collapsed ? "md" : undefined}
								bb={!tenta.collapsed ? "lg" : !isLast && tenta.collapsed && !placeholder!.next!.collapsed ? "md" : undefined}
								rt={tenta.collapsed && !isFirst && !placeholder!.prior!.collapsed ? "xs" : tenta.expanded && !isFirst ? "sm" : undefined}
								rb={tenta.collapsed && !isLast && !placeholder!.next!.collapsed ? "xs" : tenta.expanded && !isLast ? "sm" : undefined}

								e={tenta.opened ? "L1" : tenta.expanded ? "L2" : btmStage === "expanded" ? "L3b" : btmStage === "opened" ? "L2b" : topStage === "expanded" ? "L3t" : topStage === "opened" ? "L2t" : "0"}

							>

								<Focuser.Caret />

								{parts[0]}

							</Pane.Row>

						</Focuser>

						{parts[1] &&

							<Focuser ref={tenta.itemsFfRef} ghost>

								<Pile.TailCol
									start end
									expanded={tenta.opened}
									indent
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