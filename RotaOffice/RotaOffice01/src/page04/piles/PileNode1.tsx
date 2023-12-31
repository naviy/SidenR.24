import { $defaultAnimationDurationMs, $log, Div, Focuser, GlobalState, Pane, _$log, bgColors, useNew } from "@libs";
import { styled } from "@mui/material/styles";
import { clsx } from "clsx";
import React, { type ReactNode } from "react";
import { Tenta, TentaPhase, TentaStage } from "../tentas";






//===






export interface PileNode1Props extends Omit<Pane.RowProps, "id" | "children">
{

}






export function PileNode1({

	id,

	noFirst,
	noLast,

	linkLine,
	linkToNext,

	maxPhase,

	...rowProps

}: PileNode1Props & {

	id?: React.Key;

	noFirst?: boolean;
	noLast?: boolean;

	linkLine?: Tenta.PhaseTarget;
	linkToNext?: boolean;

	maxPhase?: TentaPhase;

	children: JSX.Element | [JSX.Element, JSX.Element];

})
{

	//$log("PileRow.id:", id)


	let placeholder = Tenta.Placeholder.use(id);

	let tenta = useNew(Tenta.Behavior1).use({ maxPhase, placeholder });


	let isFirst = !noFirst && !placeholder?.prior;  // || placeholder.prior.opened;
	let isLast = !noLast && !placeholder?.next;	    // || placeholder.next.opened;


	let topStage = placeholder?.prior ? null : tenta.stage;
	let btmStage = isLast ? "collapsed" : TentaStage.max(tenta.stage, placeholder?.next?.stage);


	let start = tenta.opened || isFirst;
	let end = tenta.opened || isLast;

	let byParent = Tenta.PhaseTarget.useConvert({ linkLine });

	let linkLine2 = byParent?.linkLine ?? (!placeholder || !placeholder.collector.root);


	let parts = Array.isArray(rowProps.children) ? rowProps.children : [rowProps.children];
	//let parts = React.Children.toArray(rowProps.children);


	return (


		<GlobalState state={placeholder?.globalState}>

			<Tenta.Stage.Provider stage={tenta.stage}>
				<Tenta.Phase.Provider phase={tenta.phase}>

					<Tenta.Placeholder.NoCollector>


						<Div relative>


							<PileNodeLinkLine width={linkLine2 ? 36 : 0}>

								{isFirst && <div className="line-to-root" />}
								<div className="angle" />
								{(!isLast || linkToNext) && <div className="line-to-next" />}

							</PileNodeLinkLine>


							<Focuser ref={tenta.rootFfRef} name={`pile-node#${id}`} ghost focusable>


								<Pane.Col
									//debug
									id={`pile-node#${id}`}

									rounded={tenta.opened}

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
									mb={btmStage === "expanded" ? 16 : btmStage === "opened" ? 24 : 0}

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
											//mx={tenta.opened ? -24 : tenta.expanded ? 0 : 0}
											//ppx0={tenta.priorPhase === 2 ? 24 : tenta.priorPhase === 1 ? 0 : 0}
											//ppx={tenta.phase === 2 ? 24 : tenta.phase === 1 ? 0 : 0}


											gap1
											px2
											pt={tenta.opened ? 2 : tenta.expanded ? 2 : start ? 2 : 1}
											pb={tenta.opened ? 2 : tenta.expanded ? 2 : end ? 2 : btmStage !== "collapsed" ? 1 : 0}
											e={tenta.opened ? "L2" : tenta.expanded ? "L1b" : end || btmStage !== "collapsed" ? "L1b" : "0"}
										>


											<Focuser.Caret
												use={usePileRowCaretProps}
											//color={props.start ? "green" : props.end ? "red" : undefined }
											>
												<Focuser.Caret.LineIndicator1 value={tenta.phase} max={tenta.expandedPhase} max2={tenta.openedPhase} />
											</Focuser.Caret>

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






function usePileRowCaretProps()
{
	let row = Pane.ContainerInfo.use();
	return { borderRadius: row?.cssBorderRadius };
}




const PileNodeLinkLine = styled(
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
	opacity: width ? 1 : 0,

	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,


	"> .angle": {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 24,

		border: `${thickness || 3}px solid ${bgColors[3]}`,
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
		borderLeft: `${thickness || 3}px solid ${bgColors[3]}`,
	},

	"> .line-to-next": {
		position: "absolute",
		inset: 0,
		borderLeft: `${thickness || 3}px solid ${bgColors[3]}`,
	},

}));