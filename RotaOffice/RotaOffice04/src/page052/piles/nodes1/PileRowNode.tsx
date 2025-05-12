import { ErrorBoundary } from "@app";
import { Div, ExpanderBaseBehavior, Focuser, Pane } from '@libs';
import { useMemo, type ReactNode, type RefObject } from "react";
import { Tenta, Tenta as Tenta_ } from "../../tentas";
import { Pile } from "../core";
import { PileNodeTail1 } from "./PileNodeTail1";
import { PileRowNodeAccentor } from "./PileRowNodeAccentor";
import { PileRowNodeForefill } from "./PileRowNodeForefill";
import { PileRowNodeTenta } from "./PileRowNodeTenta";






//===






export interface PileRowNodeProps<TTenta extends PileRowNodeTenta = PileRowNodeTenta>
	extends Omit<Pane.RowProps, /*"id" | */"children">
{

	tenta: TTenta;

	linkToNext?: boolean;
	backfill?: boolean;

	tailReexpand?: boolean;

	tailDecorator?: PileRowNode.TailDecorator<TTenta>;

}





export function PileRowNode({

	tenta,

	linkToNext,
	backfill,

	tailReexpand,
	tailDecorator,

	children,

	...rowProps

}: PileRowNodeProps & {

	children?: ReactNode | (() => ReactNode)

})
{

	//_$log("PileNode for " + tenta)

	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;
	//let isAccented = tenta.isAccented();


	//__$log("topMargin:", topMargin);
	//__$log("btmMargin:", btmMargin);
	//___$log("next.bodyTopMargin:", tenta.next()?.bodyTopMargin());
	//___$log("parentTailBtmMargin:", tenta.parentTailBtmMargin());


	tailDecorator ??= PileRowNode.defaultTailDecorator;

	//let hasVisibleTentas = tailIsVisible && tenta.hasVisibleTentas();
	//$log(tenta + "")
	//$log._("tailIsVisible:", tailIsVisible);
	//$log._("hasVisibleTentas: ", hasVisibleTentas);
	//$log._("btmMargin: ", btmMargin);

	let tailMt = !tailIsVisible ? 0 : btmMargin * 12;
	let tailMb = (tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsVisible && tailIsSeparated ? 24 : 0);
	//$log._("tailM:", tailMt, tailMb);

	//tailMt *= 4;


	tenta.ff = Focuser.useGhost({
		name: `pile-row-node \ ff#${tenta.id}`,
		//focusable: true,
	});

	tenta.tailFf = Focuser.useGhost({
		name: `pile-row-node \ tailFf#${tenta.id}`,
	});


	return (

		<Tenta.ByPhaseProvider tenta={tenta}>

			<Focuser.Area ff={tenta.ff}>

				<Div relative>

					<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />

					{/*<Pile.ListBackfill mb={!tenta.parent ? 0 : 24} />*/}
					{backfill && <Pile.Node.Backfill
						mb={tailIsVisible ? 24 : 48}
						visible={tailIsSeparated}
					/>}


					<PileRowNodeAccentor tenta={tenta}>


						<PileRowNodeBody
							tenta={tenta}
							rowProps={rowProps}
							children={children}
						/>


						<Focuser.Area ff={tenta.tailFf}>

							{/*<Div borderGreen border4 m8>*/}
							<Pane.Col

								id={tenta + ""}
								expanderRef={tenta.tailExpanderRef}

								start={tailIsSeparated}
								expanded={tailIsVisible}
								noreexpand
								//noreexpand={!tailReexpand}

								wrapperCls={`mt${tailMt}`}
								mb={tailMb as any}
								addExpandedHeight={tailMt + tailMb}


							//borderGreen border4
							>
								{/*<Div borderBlue border4 m8>*/}
								{tailDecorator(tenta)}
								{/*</Div>*/}
							</Pane.Col>
							{/*</Div>*/}

						</Focuser.Area>


					</PileRowNodeAccentor>

				</Div>

			</Focuser.Area>


		</Tenta.ByPhaseProvider>
	);

}




function PileRowNodeBody({
	tenta,
	rowProps,
	children,
}: {
	tenta: PileRowNodeTenta;
	rowProps: Pane.RowProps;
	children?: ReactNode | (() => ReactNode)
})
{

	let accent = Tenta.Accent.use();

	let topMargin = tenta.topMargin();
	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;

	let children2 = (typeof children === "function"
		? useMemo(children, [tenta.expandPhase, tenta.openPhase])
		: children
	);


	let bl: Pane.Border = accent === 2 ? "xl" : accent === 1 ? "lg" : "md";
	let br: Pane.Border = accent === 2 ? "xl" : accent === 1 ? "lg" : "md";
	let bt: Pane.Border = topMargin && accent === 2 ? "xl" : topMargin && accent === 1 ? "lg" : topMargin >= 2 ? "md" : topMargin === 1 ? "md" : "sm";
	let bb: Pane.Border = btmMargin && accent === 2 ? "xl" : btmMargin && accent === 1 ? "lg" : btmMargin >= 2 ? "md" : btmMargin === 1 ? "md" : "";


	tenta.bodyFf = Focuser.use({
		name: `pile-row-node \ bodyFf#${tenta.id}`,
		listener: tenta,
		autoFocus: tenta.getGlobalProp("focused") ? 200 : undefined,
	});


	return (

		<Focuser.Area ff={tenta.bodyFf}>

			<Pane.Row

				ref={tenta.bodyFf.divRef}

				//debug
				start
				end={!tailIsVisible || tailIsSeparated}

				rt={topMargin >= 2 ? "md" : topMargin === 1 ? "sm" : ""}
				rb={btmMargin >= 2 ? "md" : btmMargin === 1 ? "sm" : ""}

				bl={bl}
				br={br}
				bt={bt}
				bb={bb}

				{...rowProps}

				ffCaret
			>

				<ErrorBoundary>
					{tenta.toolsIsVisible ? Tenta.Details.wrap(tenta, children2) : children2}
					{/*<Div absolute top0 style={{left: 40} }>tailFf: {tenta.tailFf + ""}</Div>*/}
				</ErrorBoundary>

				<PileRowNodeForefill
					tenta={tenta}
					bl={bl}
					br={br}
					bt={bt}
					bb={bb}
					//bt={topMargin ? bt : ""}
					//bb={btmMargin ? bb : ""}
				/>

			</Pane.Row>

		</Focuser.Area>

	);

}






export module PileRowNode
{


	//---




	export type Props<TTenta extends Tenta = Tenta> = PileRowNodeProps<TTenta>;

	export import Tenta = PileRowNodeTenta;


	export type TailDecorator<TTenta extends Tenta_.Base = Tenta_.Base> = (tenta: TTenta) => ReactNode;




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