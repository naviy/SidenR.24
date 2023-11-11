import { $defaultAnimationDurationMs, Div, Focuser, GlobalState, Pane, bgColors, useNew } from "@libs";
import { styled } from "@mui/material/styles";
import React, { type ReactNode } from "react";
import { Tenta, TentaPhase, TentaStage } from "../tentas";






//===






export interface PileRow1Props extends Omit<Pane.RowProps, "id" | "children">
{

}






export function PileRow1({

	id,

	...rowProps

}: PileRow1Props & {

	id: React.Key;

	children: [ReactNode, ReactNode?];

})
{

	//$log("PileRow.id:", id)


	let placeholder = Tenta.Placeholder.use(id);

	let tenta = useNew(Tenta.Behavior1).use({ placeholder });


	let topStage = placeholder?.prior ? null : tenta.stage;
	let btmStage = TentaStage.max(tenta.stage, placeholder?.next?.stage);

	let isFirst = !placeholder?.prior;
	let isLast = !placeholder?.next;
	let start = tenta.opened || isFirst;// || placeholder.prior.opened;
	let end = tenta.opened || isLast;// || placeholder.next.opened;


	let parts = rowProps.children;
	//let parts = React.Children.toArray(rowProps.children);



	return (


		<GlobalState state={placeholder?.globalState}>

			<Tenta.Stage.Provider stage={tenta.stage}>
				<Tenta.Phase.Provider phase={tenta.phase}>

					<Tenta.Placeholder.NoCollector>


						<Div relative>


							{(!placeholder || !placeholder.collector.root) &&

								<TentaItemsLinkLine
									width={36}
									thickness={tenta.opened ? 2 : tenta.expanded ? 2 : 2}
								>

									{isFirst && <div className="line-to-root" />}
									<div className="angle" />
									{!isLast && <div className="line-to-next" />}

								</TentaItemsLinkLine>

							}


							<Focuser ref={tenta.rootFfRef} name={`pile-row#${id}`} ghost focusable>


								<Pane.Col
									//debug
									id={`pile-row#${id}`}

									start={start}
									end={end}

									{...rowProps}

									//elevation={btmStage !== "collapsed" ? 1 : undefined}


									//{...tenta.expanded && { e: "L1", mx: -12, }}
									//{...tenta.opened && { rounded: true, e: "0", mx: -24, }}

									//ppStart
									//ppx0={tenta.priorPhase === 1 ? 12 : tenta.priorPhase === 2 ? 24 : 0}
									//ppx={tenta.phase === 1 ? 12 : tenta.phase === 2 ? 24 : 0}

									//mt={topStage === "expanded" ? 8 : topStage === "opened" ? 8 : 0}
									mb={btmStage === "expanded" ? 16 : btmStage === "opened" ? 40 : 0}

									cursorPointer
								>

									{/*<TentaItemsBackfill />*/}

									<Focuser
										ref={tenta.ffRef}
										name={`pile-row-body#${id}`}
										listener={tenta}
										autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
									>

										<Pane.Row
											start end
											bg={tenta.opened ? "4" : tenta.expanded ? "3" : "2"}

											rounded={tenta.opened}

											ppStart
											mx={tenta.opened ? -24 : tenta.expanded ? -12 : 0}
											ppx0={tenta.priorPhase === 1 ? 12 : tenta.priorPhase === 2 ? 24 : 0}
											ppx={tenta.phase === 1 ? 12 : tenta.phase === 2 ? 24 : 0}


											gap1
											px2
											pt={tenta.opened ? 2 : tenta.expanded ? 2 : start ? 2 : 1}
											pb={tenta.opened ? 2 : tenta.expanded ? 2 : end ? 2 : btmStage !== "collapsed" ? 1 : 0}
											e={tenta.opened ? "L2" : tenta.expanded ? "L1b" : end || btmStage !== "collapsed" ? "L1b" : "0"}
										>


											<Focuser.Caret
												use={usePileRowCaretProps}
											//color={props.start ? "green" : props.end ? "red" : undefined }
											/>

											{parts[0]}

										</Pane.Row>

									</Focuser>


									{parts[1] &&

										<Focuser ref={tenta.itemsFfRef} ghost>
											{parts[1]}
										</Focuser>
									}


								</Pane.Col>

							</Focuser>


						</Div>


					</Tenta.Placeholder.NoCollector>

				</Tenta.Phase.Provider>
			</Tenta.Stage.Provider>

		</GlobalState>

	);

}





export type TentaExpanderProps = (
	{ expanded?: boolean } | { expanded: TentaPhase } | { expanded: TentaStage } |
	{ collapsed?: boolean } | { collapsed: TentaPhase } | { collapsed: TentaStage }
);


export module TentaExpanderProps
{

	//---



	export function useExpanded(props: TentaExpanderProps): boolean | undefined
	{

		let { expanded, collapsed } = props as any;

		if (expanded === undefined && collapsed === undefined)
		{
			return undefined;
		}


		let phase: number | undefined = undefined;

		if (typeof expanded === "number" || typeof collapsed === "number")
		{
			phase = TentaPhase.use();
		}


		let stage: TentaStage | undefined = undefined;

		if (typeof expanded === "string" || typeof collapsed === "string")
		{
			stage = TentaStage.use();
		}



		if (phase === null && stage === null)
		{
			return undefined;
		}



		if (typeof expanded === "number" && phase != null)
		{
			return expanded === phase;
		}

		if (typeof expanded === "string" && stage != null)
		{
			return expanded === stage;
		}


		if (typeof collapsed === "number" && phase != null)
		{
			return collapsed !== phase;
		}

		if (typeof collapsed === "string" && stage != null)
		{
			return collapsed !== stage;
		}


		return undefined;

	}



	//---

}




export type PileColProps = Omit<Pane.ColProps, "expanded"> & TentaExpanderProps;


export function PileCol(props: PileTailColProps)
{

	let { expanded, collapsed, ...colProps } = props as any;

	let expanded2 = TentaExpanderProps.useExpanded({ expanded, collapsed } as TentaExpanderProps);

	return <Pane.Col
		expanded={expanded2}
		{...colProps}
	/>;

}




export type PileTailColProps = Omit<Pane.ColProps, "expanded"> & TentaExpanderProps;


export function PileTailCol(props: PileTailColProps)
{

	let { expanded, collapsed, ...colProps } = props as any;

	let expanded2 = TentaExpanderProps.useExpanded({ expanded, collapsed } as TentaExpanderProps);

	return <Pane.Col
		expanded={expanded2}
		wrapperCls="py24 pl36 pr12"
		{...colProps}
	/>;

}




function usePileRowCaretProps()
{
	let row = Pane.ContainerInfo.use();
	return { borderRadius: row?.cssBorderRadius };
}




const TentaItemsLinkLine = styled(
	"div",
	{ shouldForwardProp: p => p !== "width" && p !== "thickness" }
)<{
	width: number;
	thickness?: number;
}>(({ width, thickness }) =>
({

	position: "absolute",
	left: -width,
	top: 0,
	bottom: 0,
	width,

	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,


	"> .angle": {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 24,

		border: `${thickness || 2}px solid ${bgColors[3]}`,
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderBottomLeftRadius: 12,
	},

	"> .line-to-root": {
		position: "absolute",
		left: 0,
		right: 0,
		top: -24,
		height: 24,
		borderLeft: `${thickness || 2}px solid ${bgColors[3]}`,
	},

	"> .line-to-next": {
		position: "absolute",
		inset: 0,
		borderLeft: `${thickness || 2}px solid ${bgColors[3]}`,
	},

}));