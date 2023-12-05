import { ErrorBoundary } from "@app";
import { $log, Div, Focuser, Pane, _$log, __$log } from '@libs';
import { Pile } from "../core";
import { PileNode1Tenta } from "./PileNode1_Tenta";
import { PileNodeTail1 } from "./PileNodeTail1";
import { Tenta } from "../../tentas";






//===






export interface PileNode2Props extends Omit<Pane.RowProps, /*"id" | */"children">
{
	readonly tenta: PileNode2.Tenta;
	//readonly id: React.Key;
	//readonly collectors?: React.Key[];
	readonly linkToNext?: boolean;
}




export function PileNode2({
	tenta,
	//id,
	//collectors,
	linkToNext,
	...rowProps
}: PileNode2Props & {
	children: [JSX.Element, JSX.Element]
})
{

	_$log("PileNode2() for " + tenta)

	//let tenta = Tenta.useById(PileNode1Tenta, id);

	//tenta.use({ collectors });
	tenta.use();

	let { collapsed, expanded, opened, isFirst, isLast, } = tenta;

	let parts = rowProps.children;

	//__$log("phase:", tenta.phase);
	//__$log("stage:", tenta.stage);
	//__$log("isFirst:", tenta.isFirst);
	//__$log("isLast:", tenta.isLast);


	//let topIsSeparated = tenta.topIsSeparated();
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
				//name={`pile-node#${tenta.iid}`}
				ghost
				focusable
			>

				<Div
					relative
					pb={tenta.tailIsVisibleAndSeparated() ? undefined : btmMargin * 12 as any}
					animated
				>

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
							//name={`pile-row-body#${tenta.iid}`}
							listener={tenta}
							autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
						>

							<Pane.Row

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
									//id={"tail2 of " + tenta}
									start={tenta.tailIsSeparated()}
									expanded={tenta.tailIsVisible()}
									indent={tenta.tailIsSeparated()}
									rt={tenta.tailIsSeparated() ? "lg" : undefined}
									rb={tenta.tailIsSeparated() ? "lg" : undefined}
									bt={tenta.tailIsSeparated() ? "md" : undefined}
									bb={tenta.tailIsSeparated() ? "md" : undefined}
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






export module PileNode2
{

	//---



	export type Props = PileNode2Props;



	export class Tenta extends PileNode1Tenta
	{

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

	}


	//export const newTenta: Tenta.Descriptor["newTenta"] = (collector, props) =>
	//{
	//	return new PileNode1Tenta(collector, props)
	//};



	//export const getMargin: Tenta.Descriptor["getMargin"] = tenta =>
	//{

	//	let { stage } = tenta;

	//	return (
	//		stage === "opened" ? [24, 1] :
	//			stage === "expanded" ? [12, 0] :
	//				null
	//	);

	//};



	//---

}
//let qqq: Tenta.Descriptor = PileNode2;