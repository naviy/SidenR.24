import { ErrorBoundary } from "@app";
import { Div, ExpanderBaseBehavior, Focuser, Pane } from '@libs';
import { useMemo, type ReactNode, type RefObject } from "react";
import { Tenta, Tenta as Tenta_ } from "../../tentas";
import { Pile } from "../core";
import { PileNodeTail1 } from "./PileRowNodeTail1";
import { PileRowNodeAccentor } from "./PileRowNodeAccentor";
import { PileRowNodeForefill } from "./PileRowNodeForefill";
import { PileRowNodeTenta } from "./PileRowNodeTenta";






//===






export interface PileRowNodeProps<TTenta extends PileRowNodeTenta = PileRowNodeTenta>
	extends Omit<Pane.RowProps, /*"id" | */"children">
{

	tenta: TTenta;

	linkToNext?: boolean;
	hideChildrenLinks?: boolean;
	backfill?: boolean;


	tailExpanderRef?: RefObject<ExpanderBaseBehavior | null>;
	tailReexpand?: boolean;

	tailDecorator?: PileRowNode.TailDecorator<TTenta>;

}





export function PileRowNode({

	tenta,

	linkToNext,
	hideChildrenLinks,
	backfill,

	tailExpanderRef,
	tailReexpand,
	tailDecorator,

	children,

	...rowProps

}: PileRowNodeProps & {

	children?: JSX.Element | (() => JSX.Element)

})
{

	if (hideChildrenLinks != null)
		tenta.hideChildrenLinks = hideChildrenLinks;

	//_$log("PileNode for " + tenta)

	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;

	let linkLine = tenta.parentTenta?.hideChildrenLinks !== true;

	tailDecorator ??= PileRowNode.defaultTailDecorator;

	let tailMt = !tailIsVisible ? 0 : btmMargin * 12;
	let tailMb = (tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsVisible && tailIsSeparated ? 24 : 0);


	return (

		<Tenta.ByPhaseProvider tenta={tenta}>

			<Focuser
				ref={tenta.ffRef}
				ghost
			>

				<Div relative>

					{linkLine && <Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />}

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


						<Focuser ref={tenta.tailFfRef} ghost>

							{/*<Div borderGreen border4 m8>*/}
							<Pane.Col

								id={tenta + ""}
								expanderRef={tailExpanderRef}

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

						</Focuser>


					</PileRowNodeAccentor>

				</Div>

			</Focuser>


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
	children?: JSX.Element | (() => JSX.Element)
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


	return (

		<Focuser
			ref={tenta.bodyFfRef}
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

				bl={bl}
				br={br}
				bt={bt}
				bb={bb}

				{...rowProps}

				ff
			>

				<ErrorBoundary>
					{tenta.toolsIsVisible ? Tenta.Details.wrap(tenta, children2) : children2}
				</ErrorBoundary>

				<PileRowNodeForefill
					tenta={tenta}
					bl={bl}
					br={br}
					bt={bt}
					bb={bb}
				/>

			</Pane.Row>

		</Focuser>

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