import { ErrorBoundary } from "@app";
import { $log, Div, Focuser, Pane, _$log, __$log } from '@libs';
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

	_$log("PileNode3() for " + tenta)
	//let tenta = Tenta.useById(PileNode1Tenta, id);

	//tenta.use({ collectors });
	tenta.use();

	let { collapsed, expanded, opened, isFirst, isLast, topStage, btmStage, prior, next } = tenta;

	let parts = rowProps.children;

	//__$log("phase:", tenta.phase);
	//__$log("stage:", tenta.stage);

	let topMargin = tenta.topMargin();
	let btmMargin = tenta.btmMargin();

	//__$log("topIsSeparated:", topIsSeparated);
	__$log("topMargin:", topMargin);
	__$log("btmMargin:", btmMargin);
	//__$log("btmStage:", btmStage);


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
					pb={tenta.tailIsVisibleAndSeparated() ? undefined : btmMargin * 12 as any}
					animated
				>

					{/*<Pile.ListBackfill visible={tenta.opened && (!tenta.parent || tenta.parent.opened)} />*/}

					<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />


					<Pane.Col
						start={!!topMargin}
						end={!!btmMargin}
						rt={topMargin >= 2 ? "lg" : topMargin === 1 ? "sm" : undefined}
						rb={btmMargin >= 2 ? "lg" : btmMargin === 1 ? "sm" : undefined}
						bt={topMargin >= 2 ? "md" : topMargin === 1 ? "sm" : undefined}
						bb={btmMargin >= 2 ? "md" : btmMargin === 1 ? "sm" : undefined}

						{...rowProps}
					>

						<Pile.ListBackfill visible={tenta.collector?.isVisibleAndSeparated() !== false} />

						<Focuser
							ref={tenta.ffRef}
							//name={`pile-row-body#${id}`}
							listener={tenta}
							autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
						>

							<Pane.Row
								//debug
								start
								end={!!btmMargin || tenta.tailIsSeparated()}

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

						{parts[1] &&

							<Focuser ref={tenta.itemsFfRef} ghost>

								<PileNodeTail1
									//debug
									//id={"tail3 of " + tenta}
									start={tenta.tailIsSeparated()}
									expanded={tenta.tailIsVisible()}
									indent={tenta.tailIsSeparated()}
									rt={tenta.tailIsSeparated() ? "lg" : undefined}
									rb={tenta.tailIsSeparated() ? "lg" : undefined}
									bt={tenta.tailIsSeparated() ? "md" : undefined}
									bb={tenta.tailIsSeparated() ? "md" : undefined}
									cellIndent
									children={parts[1]}
								/>

							</Focuser>
						}

					</Pane.Col>


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

		override tailIsVisible()
		{
			return !this.collapsed;
		}

		override bodyIsSeparated()
		{
			let { parent } = this;
			return parent ? parent.opened && this.opened : this.opened;
		}

		override tailIsSeparated()
		{
			return this.opened;
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