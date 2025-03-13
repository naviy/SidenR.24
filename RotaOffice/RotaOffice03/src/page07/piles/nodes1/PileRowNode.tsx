
import { ErrorBoundary } from "@app";
import { Div, ExpanderBaseBehavior, Focuser, Pane } from '@libs';
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { useMemo, type ReactNode, type RefObject } from "react";
import { Tenta, Tenta as Tenta_ } from "../../tentas";
import { Pile } from "../core";
import "./PileRowNode.scss";
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

	border?: boolean;
	backfill?: boolean | ((tenta: TTenta) => React.ReactNode);
	forefill?: boolean;

	decorator?: PileRowNode.Decorator<TTenta>;

	tailExpanderRef?: RefObject<ExpanderBaseBehavior | null>;
	tailDecorator?: PileRowNode.TailDecorator<TTenta>;

}





export function PileRowNode<TTenta extends PileRowNodeTenta = PileRowNodeTenta>({

	tenta,

	linkToNext,
	hideChildrenLinks,

	border,
	backfill,
	forefill,

	decorator,

	tailExpanderRef,
	tailDecorator,

	children,

	...rowProps

}: PileRowNodeProps<TTenta> & {

	children?: React.ReactNode | (() => React.ReactNode)

})
{

	tenta.useInNode();


	if (hideChildrenLinks != null)
		tenta.hideChildrenLinks = hideChildrenLinks;

	//_$log("PileNode for " + tenta)

	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;

	let linkLine = tenta.parentTenta?.hideChildrenLinks !== true;

	decorator ??= PileRowNode.defaultDecorator;
	tailDecorator ??= PileRowNode.defaultTailDecorator;

	let backfillRender = (
		backfill === true ? PileRowNode.defaultBackfill :
			typeof backfill === "function" ? backfill :
				null
	);


	let tailMt = !tailIsVisible ? 0 : btmMargin * 12;
	let tailMb = (tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsVisible && tailIsSeparated ? 24 : 0);
	//tailMb *= 3;

	//$log._("btmMargin:", btmMargin);
	//$log._("tailIsVisible:", tailIsVisible);
	//$log._("tailIsSeparated:", tailIsSeparated);
	//$log._("tailMb:", tailMb);

	return (

		<Tenta.ByPhaseProvider tenta={tenta}>

			<Focuser
				ref={tenta.ffRef}
				ghost
			>

				{decorator(tenta, <>


					{linkLine && <Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />}

					{backfillRender?.(tenta)}


					<PileRowNodeAccentor tenta={tenta}>


						<PileRowNodeBody
							tenta={tenta}
							rowProps={rowProps}
							border={border}
							forefill={forefill}
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

								wrapperCls={`mt${tailMt}`}
								mb={tailMb as any}
								addExpandedHeight={tailMt}

							//wrapperCls={`mt${tailMt}`}
							//mb={tailMb as any}
							//addExpandedHeight={tailMt + tailMb}


							//borderGreen border4
							>
								{/*<Div borderBlue border4 m8>*/}
								{tailDecorator(tenta)}
								{/*</Div>*/}
							</Pane.Col>
							{/*</Div>*/}

						</Focuser>


					</PileRowNodeAccentor>


				</>)}

			</Focuser>


		</Tenta.ByPhaseProvider>
	);

}




function PileRowNodeBody({
	tenta,
	rowProps,
	border,
	forefill,
	children,
}: {
	tenta: PileRowNodeTenta;
	rowProps: Pane.RowProps;
	border?: boolean;
	forefill?: boolean;
	children?: React.ReactNode | (() => React.ReactNode)
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


	let bl: Pane.Border = !border ? "" : accent === 2 ? "xl" : accent === 1 ? "lg" : "md";
	let br: Pane.Border = !border ? "" : accent === 2 ? "xl" : accent === 1 ? "lg" : "md";
	let bt: Pane.Border = !border ? "" : topMargin && accent === 2 ? "xl" : topMargin && accent === 1 ? "lg" : topMargin >= 2 ? "md" : topMargin === 1 ? "md" : "sm";
	let bb: Pane.Border = !border ? "" : btmMargin && accent === 2 ? "xl" : btmMargin && accent === 1 ? "lg" : btmMargin >= 2 ? "md" : btmMargin === 1 ? "md" : "";


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

				{forefill && <PileRowNodeForefill
					tenta={tenta}
					bl={bl}
					br={br}
					bt={bt}
					bb={bb}
				/>}

			</Pane.Row>

		</Focuser>

	);

}






export module PileRowNode
{


	//---




	export type Props<TTenta extends Tenta = Tenta> = PileRowNodeProps<TTenta>;

	export import Tenta = PileRowNodeTenta;


	export type Decorator<TTenta extends Tenta_.Base = Tenta_.Base> =
		(tenta: TTenta, children: ReactNode) => ReactNode;
	export type TailDecorator<TTenta extends Tenta_.Base = Tenta_.Base> = (tenta: TTenta) => ReactNode;




	export function defaultDecorator(tenta: PileRowNodeTenta, children: ReactNode)
	{
		return <Div
			relative
			children={children}
		/>;
	}



	//---



	export function defaultBackfill(tenta: Tenta_.Base)
	{
		return <Backfill visible={tenta.tailIsVisibleAndSeparated} />;
	}



	export var Backfill = styled(
		"div",
		{
			target: "pile-row-node-backfill",
			shouldForwardProp: p => p !== "visible",
		}
	)<{
		visible?: boolean;
	}>(props => ({

		"--op": props.visible !== false ? 1 : undefined

	}));



	//---



	export function defaultTailDecorator(
		tenta: Tenta,
		renderCol?: (col: Tenta_.Collector) => ReactNode,
	)
	{

		renderCol ??= (col) => (
			<Tail
				collector={col}
				cellIndent
				children={col.defaultListElement()}
			/>
		);


		return <>
			{tenta.collectors?.map(col =>
				<ErrorBoundary key={col.id}>
					{renderCol!(col)}
				</ErrorBoundary>
			)}
		</>;
	}



	export function Tail({

		collector,

		indent,
		cellIndent,

		children,

		...colProps

	}: Pane.ColProps & {

		collector: Tenta_.Collector;
		indent?: boolean;
		cellIndent?: boolean;

	})
	{


		let parentCellIndent = Pile.useCellIndent();


		let isSeparated = collector.isSeparated();

		indent ??= isSeparated;

		let myIndent = !indent ? 36 : 0;


		return (

			<Pane.Col

				start
				end

				rt={isSeparated ? "lg" : undefined}
				rb={isSeparated ? "lg" : undefined}
				bt={isSeparated ? "md" : undefined}
				bb={isSeparated ? "md" : undefined}

				{...colProps}

				//wrapperCls={clsx(/*"borderRed",*/ indent && `pl${parentCellIndent + 36} pr12`, colProps.wrapperCls)}
				wrapperCls={clsx(/*"borderRed",*/ indent && `pl36 pr12`, colProps.wrapperCls)}

			//border2 borderGreen
			>

				<Pile.Node.LinkLine.OptionsProvider width={indent ? 21 : 0}>

					<Pile.CellIndentProvider indent={!cellIndent ? 0 : parentCellIndent + myIndent}>
						{/*<Pile.CellIndentProvider indent={cellIndent && !indent ? parentCellIndent + 36 : 0}>*/}
						{children}
					</Pile.CellIndentProvider>

				</Pile.Node.LinkLine.OptionsProvider>

			</Pane.Col>

		);

	}



	//---


}