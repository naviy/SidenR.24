import { ErrorBoundary } from "@app";
import { Div, Focuser, Pane } from '@libs';
import { Tenta, Tenta as Tenta_ } from "../../tentas";
import { Pile } from "../core";
import { PileRowNodeTenta } from "./PileRowNodeTenta";
import { PileNodeTail1 } from "./PileNodeTail1";
import type { ReactNode } from "react";






//===






export interface PileRowNodeProps extends Omit<Pane.RowProps, /*"id" | */"children">
{

	tenta: PileRowNodeTenta;

	linkToNext?: boolean;
	backfill?: boolean;

	tailDecorator?: PileRowNode.TailDecorator;

}





export function PileRowNode({

	tenta,

	linkToNext,
	backfill,

	tailDecorator,

	children,

	...rowProps

}: PileRowNodeProps & {

	children?: JSX.Element

})
{

	//_$log("PileNode for " + tenta)

	tenta.use();


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


	tailDecorator ??= PileRowNode.defaultTailDecorator;


	return (

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
								{tenta.toolsIsVisible ? Tenta.Details.wrap(tenta, children) : children}
							</ErrorBoundary>

						</Pane.Row>

					</Focuser>


					<Focuser ref={tenta.itemsFfRef} ghost>

						<Pane.Col
							start={tailIsSeparated}
							expanded={tailIsVisible}
							noreexpand

							pt={!tailIsVisible/* || !tail*/ ? 0 : btmMargin * 12 as any}
							mb={(tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsSeparated ? 24 : 0) as any}
						>
							{tailDecorator(tenta)}
						</Pane.Col>

					</Focuser>


				</Div>

			</Focuser>


		</Tenta.ByPhaseProvider>
	);

}






export module PileRowNode
{

	//---



	export type Props = PileRowNodeProps;

	export import Tenta = PileRowNodeTenta;


	export type TailDecorator = (tenta: Tenta_.Base) => ReactNode;




	export function defaultTailDecorator(tenta: Tenta_.Base)
	{
		return <>
			{tenta.collectors?.map(col =>
				<PileNodeTail1
					key={col.id}
					collector={col}
					cellIndent
					children={col.defaultListElement()}
				/>
			)}
		</>;
	}



	//---

}