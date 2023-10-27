import { $defaultAnimationDurationMs, Div, Expander, Focuser, GlobalState, Pane, bgColors, useNew } from '@libs';
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React, { useReducer, type ReactNode } from "react";
import { Tenta } from './tentas';
import { TentaStage } from "./tentas/TentaStage";







export function Page03()
{

	return <>

		<GlobalState name="page03">

			<Div mx200 m100>

				<GlobalState name="Rows05Pile">

					<Rows05 root />

				</GlobalState>

			</Div>

		</GlobalState>

	</>;

}



function Rows05({ root }: { root?: boolean })
{
	return <>

		<Pane.Col rounded>

			<Div fill style={{ borderRadius: "inherit", border: `2px solid ${bgColors[2]}` }} />

			<Tenta.Placeholder.Collector
				globalState="rows05"
				root={root}
				//placeholders={[1, 2, 3, 4, 5, 6, 7]}
				placeholders={[1, 2, 3]}
			>

				<Row05 id={1} />
				<Row05 id={2} />
				<Row05 id={3} />
				{/*<Row05 id={4} />*/}
				{/*<Row05 id={5} />*/}
				{/*<Row05 id={6} />*/}
				{/*<Row05 id={7} />*/}

			</Tenta.Placeholder.Collector>

		</Pane.Col>

	</>;
}



function Row05(props: PileRowProps)
{
	//$log("Row05.id:", props.id)


	return <PileRow {...props}>

		<RowBody id={props.id}>

			<>
				<Pane id="pane-1" p12><span>111 1111 11111 111111</span></Pane>
				<Pane p12>222 2222 22222 222222</Pane>
				<Pane p12 textRight>333 3333 33333 333333</Pane>
			</>

			<>
				<Pane p12 vcenter>111 1111 11111 111111</Pane>
				<Pane p12 vcenter>222 2222 22222 222222</Pane>
				<Pane p12 vcenter textRight>
					<div>
						333 3333 33333 333333
						<Cell3 />
					</div>
				</Pane>
			</>

			<>
				<Pane l={1} center vcenter>aaa aaa aaaa</Pane>
			</>

			<>
				<Pane l={1} center vcenter>xxx xxx xxxx</Pane>
				<Pane l={1} center vcenter>yyy yyy yyyy</Pane>
				<Pane l={1} center vcenter>zzz zzz zzzz</Pane>
			</>

			<Pane.Col gap1 flex1>
				<Pane l={1} center vcenter>bbb bbb bbbb</Pane>
				<Pane l={1} center vcenter>ccc ccc cccc</Pane>
			</Pane.Col>

			<>
				<Pane p12 vcenter>222 2222 22222 222222</Pane>
				<Pane end p12 textRight vcenter>333 3333 33333 333333</Pane>
			</>

		</RowBody>


		<>
			<Rows05 />
		</>


	</PileRow>;



	function Cell3()
	{

		let [expanded, toggleExpanded] = useReducer(a => !a, false);
		let [expanded2, toggleExpanded2] = useReducer(a => !a, false);

		return <>
			<Button onClick={e => { e.stopPropagation(); toggleExpanded(); }}>TOGGLE</Button>
			<Expander id="2" expanded={expanded}>
				<div>4444 4 4444 44 4 444444 4 44444 4444</div>
				<Button onClick={e => { e.stopPropagation(); toggleExpanded2(); }}>TOGGLE2</Button>
				{expanded2 && <div>5555 5 5555 55 5 555555 5 55555 5555</div>}
			</Expander>
		</>;

	}


	function RowBody(props: { id: React.Key; children: ReactNode })
	{

		let phase = Tenta.Phase.use();

		let parts = React.Children.toArray(props.children);

		//$log("RowRim", props.id)


		return <>

			<Pane.Col start>

				<Pane.Row start end={phase !== 1}>
					{parts[0]}
				</Pane.Row>

				<Pane.Row end id={`row05-expander #${props.id}`} expanded={phase === 1} wrapperCls="pt1" gap1 noreexpand>
					{parts[1]}
				</Pane.Row>

			</Pane.Col>

			<Pane.Row id="row05-bottom" end gap1>

				{/*<Pane.Col gapi l={120}>*/}
				{/*	<TransitionGroup>*/}
				{/*		{phase !== 1 && <FillFade>{Pane.injectProps(fs[2])}</FillFade>}*/}
				{/*		{phase === 1 && <FillFade>{Pane.injectProps(fs[3])}</FillFade>}*/}
				{/*	</TransitionGroup>*/}
				{/*</Pane.Col>*/}

				{/*<Pane.Col l={120}>*/}
				{/*	<Pane.Row end={phase !== 1}>*/}
				{/*		{fs[2]}*/}
				{/*	</Pane.Row>*/}
				{/*	<Pane.Col l={2} expanded={phase === 1} pt1={phase === 1}>*/}
				{/*		{fs[4]}*/}
				{/*	</Pane.Col>*/}
				{/*</Pane.Col>*/}

				{parts[5]}

			</Pane.Row >

		</>;

	}


}




//---




interface PileRowProps extends Omit<Pane.RowProps, 'id'>
{
	id: React.Key;
}




function PileRow({ id, ...rowProps }: PileRowProps)
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


	let parts = React.Children.toArray(rowProps.children);



	return (


		<GlobalState state={placeholder?.globalState}>

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


								{...tenta.expanded && { e: "L1", mx: -12, }}
								{...tenta.opened && { rounded: true, e: "0", mx: -24, }}

								ppStart
								ppx0={tenta.priorPhase === 1 ? 12 : tenta.priorPhase === 2 ? 24 : 0}
								ppx={tenta.phase === 1 ? 12 : tenta.phase === 2 ? 24 : 0}

								//mt={topStage === "expanded" ? 8 : topStage === "opened" ? 8 : 0}
								mb={btmStage === "expanded" ? 16 : btmStage === "opened" ? 40 : 0}

								cursorPointer
							>

								{/*<TentaItemsBackfill />*/}

								<Focuser
									ref={tenta.ffRef}
									name={`pile-row-body#${id}`}
									padding={tenta.collapsed ? -2 : 0}
									listener={tenta}
								>

									<Pane.Row
										start end
										bg={tenta.opened ? "4" : tenta.expanded ? "3" : "2"}
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

										<Pane.Col
											start end
											expanded={tenta.opened}
											wrapperCls="py24 pl60 pr48"
											children={parts[1]}
										/>

									</Focuser>
								}

							</Pane.Col>

						</Focuser>

					</Div>


				</Tenta.Placeholder.NoCollector>

			</Tenta.Phase.Provider>

		</GlobalState>

	);

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