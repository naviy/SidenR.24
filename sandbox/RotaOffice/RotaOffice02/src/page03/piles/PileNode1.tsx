import { $defaultAnimationDurationMs, $log, Div, Focuser, GlobalState, Pane, _$log, bgColors, useNew } from "@libs";
import { styled } from "@mui/material/styles";
import { clsx } from "clsx";
import React, { type ReactNode } from "react";
import { Tenta, TentaPhase, TentaStage } from "../tentas";






//===






export interface PileNode1Props extends Omit<Pane.RowProps, "id" | "children" | "start" | "end">
{

	id?: React.Key;

	start?: Tenta.PhaseTarget;
	end?: Tenta.PhaseTarget;

	rowStart?: Tenta.PhaseTarget;
	rowEnd?: Tenta.PhaseTarget;

	linkLine?: Tenta.PhaseTarget;
	linkToNext?: boolean;

	maxPhase?: TentaPhase;

}






export function PileNode1({

	id,

	start,
	end,
	rowStart,
	rowEnd,

	linkLine,
	linkToNext,

	maxPhase,

	...rowProps

}: PileNode1Props & {

	children: JSX.Element | [JSX.Element, JSX.Element];

})
{

	//$log("PileRow.id:", id)


	let placeholder = Tenta.Placeholder.use(id);

	let tenta = useNew(Tenta.Behavior1).use({ maxPhase, placeholder });


	let isFirst = !placeholder?.prior || placeholder.prior.opened;
	let isLast = !placeholder?.next || placeholder.next.opened;


	let topStage = placeholder?.prior ? null : tenta.stage;
	let btmStage = isLast ? "collapsed" : TentaStage.max(tenta.stage, placeholder?.next?.stage);



	let byParent = Tenta.PhaseTarget.useConvert({ linkLine, start, end });

	let start2 = byParent.start ?? (tenta.opened || isFirst);
	let end2 = byParent.end ?? (tenta.opened || isLast);

	let rowStart2 = Tenta.PhaseTarget.convert(rowStart, tenta) ?? true;
	let rowEnd2 = Tenta.PhaseTarget.convert(rowEnd, tenta) ?? true;


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

									//rounded={tenta.opened}

									start={start2}
									end={end2}

									{...rowProps}

									mb={btmStage === "expanded" ? 16 : btmStage === "opened" ? 24 : 0}

									cursorPointer
								>

									{/*<TentaItemsBackfill />*/}

									<Focuser
										ref={tenta.ffRef}
										name={`pile-node-body${id ? '#' + id : ''}`}
										listener={tenta}
										autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
									>

										<Pane.Row
											start={rowStart2}
											end={rowEnd2}

											e={tenta.opened ? "L2" : tenta.expanded ? "L1b" : end2 || btmStage !== "collapsed" ? "L1b" : "0"}
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
	return { borderRadius: row && Pane.Radius.css(row.rtl, row.rtr, row.rbr, row.rbl, 2) };
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