import { ErrorBoundary } from "@app";
import { Div, Focuser, GlobalState, Pane } from '@libs';
import { Tenta, Tenta as Tenta_ } from "../../tentas";
import { Pile } from "../core";
import { PileNodeBaseTenta } from "./PileNodeBaseTenta";
import { PileNodeTail1 } from "./PileNodeTail1";






//===






export interface PileNodeBaseProps extends Omit<Pane.RowProps, /*"id" | */"children">
{
	tenta: PileNodeBaseTenta;
	linkToNext?: boolean;
	backfill?: boolean;
}





export function PileNodeBase({
	tenta,
	linkToNext,
	backfill,
	...rowProps
}: PileNodeBaseProps & {
	children: JSX.Element | [JSX.Element, JSX.Element]
})
{

	//_$log("PileNode for " + tenta)

	tenta.use();


	let [body, tail] = Array.isArray(rowProps.children) ? rowProps.children : [rowProps.children, undefined];

	if (tail === undefined && tenta.collectorCount === 1)
	{
		tail = tenta.collectors![0].defaultProviderElement();
	}


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

		<GlobalState state={tenta.globalState}>

			<Tenta.Provider tenta={tenta}>
				<Tenta.ByPhaseProvider tenta={tenta}>


					<Focuser
						ref={tenta.rootFfRef}
						//name={`pile-node#${id}`}
						ghost
						focusable
					>

						<Div relative>

							<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />

							{/*<Pile.ListBackfill mb={!tenta.parent ? 0 : 24} />*/}
							{backfill && <Pile.Node.Backfill mb={tailIsVisible ? 24 : 48} />}


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

									//e={isAccented ? "L2" : undefined}

									{...rowProps}

									ff
								>

									<ErrorBoundary>
										{tenta.toolsIsVisible ? Tenta_.Details.wrap(tenta, body) : body}
									</ErrorBoundary>

								</Pane.Row>

							</Focuser>


							{tail !== undefined &&

								<Focuser ref={tenta.itemsFfRef} ghost>

									<PileNodeTail1

										start={tailIsSeparated}
										expanded={tailIsVisible}
										indent={tailIsSeparated}
										cellIndent

										rt={tailIsSeparated ? "lg" : undefined}
										rb={tailIsSeparated ? "lg" : undefined}
										bt={tailIsSeparated ? "md" : undefined}
										bb={tailIsSeparated ? "md" : undefined}

										pt={!tailIsVisible || !tail ? 0 : btmMargin * 12 as any}
										mb={(tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsSeparated ? 24 : 0) as any}

										children={tail}
									/>

								</Focuser>

							}


						</Div>

					</Focuser>


				</Tenta.ByPhaseProvider>
			</Tenta.Provider>

		</GlobalState>
	);

}






export module PileNodeBase
{


	export type Props = PileNodeBaseProps;

	export import Tenta = PileNodeBaseTenta;


}