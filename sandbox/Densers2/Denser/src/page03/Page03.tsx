import { $defaultAnimationDurationMs, Div, Expander, Focuser, Pane, bgColors, elevaltionShadows, useNew } from '@libs';
import { Button, styled } from "@mui/material";
import React, { useReducer, type ReactNode } from "react";
import { Tenta } from './tentas';
import { TentaStage } from "./tentas/TentaStage";







export function Page03()
{

	return <>

		<Div fill overflowAutoX scrollY bg1>

			<Focuser cursor ghost>

				<Div mx200 m100>

					<Rows05 root />

				</Div>

			</Focuser>

		</Div>

	</>;

}



//function Rows05()
//{
//	return <>

//		<Tenta.Placeholder.Collector placeholders={[1]}>
//			<Row05 id={1} />
//		</Tenta.Placeholder.Collector>

//	</>;
//}


function Rows05({ root }: { root?: boolean })
{
	return <>


		<Pane.Col rounded>

			<Div fill style={{ borderRadius: "inherit", border: `2px solid ${bgColors[2]}`} }  />

			<Tenta.Placeholder.Collector
				root={root}
				placeholders={[1, 2, 3, 4, 5, 6, 7]}
			>

				<Row05 id={1} />
				<Row05 id={2} />
				<Row05 id={3} />
				<Row05 id={4} />
				<Row05 id={5} />
				<Row05 id={6} />
				<Row05 id={7} />

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
				<Pane p12>111 1111 11111 111111</Pane>
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

	let tenta = useNew(Tenta.Behavior1).use({
		placeholder,
	});


	let topStage = placeholder?.prior ? null : tenta.stage;
	let btmStage = TentaStage.max(tenta.stage, placeholder?.next?.stage);

	let start = tenta.opened || !placeholder?.prior || placeholder.prior.opened;
	let end = tenta.opened || !placeholder?.next;// || placeholder.next.opened;


	let parts = React.Children.toArray(rowProps.children);


	return (

		<Tenta.Phase.Provider phase={tenta.phase}>

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
					ppx0={tenta.priorPhase === 1 ? 12 : tenta.priorPhase === 2 ? 24 : 0}
					ppx={tenta.phase === 1 ? 12 : tenta.phase === 2 ? 24 : 0}

					//mt={topStage === "expanded" ? 8 : topStage === "opened" ? 8 : 0}
					mb={btmStage === "expanded" ? 8 : btmStage === "opened" ? 40 : 0}

					cursorPointer
				>

					{/*<TentaItemsBackfill />*/}

					<Tenta.Placeholder.NoCollector>

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
								pb={tenta.opened ? 2 : tenta.expanded ? 2 : end ? 2 : 0 }
								e={tenta.opened ? "L2" : "0"}
							>

								{(!placeholder || !placeholder.collector.root) &&
									<TentaItemsLinkLine
										width={tenta.opened ? 12 : tenta.expanded ? 24 : 36}
										thickness={tenta.opened ? 2 : tenta.expanded ? 2 : 2}
									/>
								}

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
									start
									end
									expanded={tenta.opened}
									wrapperCls="p24 pl60"

								>

									{parts[1]}
								</Pane.Col>

							</Focuser>
						}

					</Tenta.Placeholder.NoCollector>

				</Pane.Col>

			</Focuser>

		</Tenta.Phase.Provider>

	);

}



function usePileRowCaretProps()
{
	let row = Pane.ContainerInfo.use();
	return { borderRadius: row?.cssBorderRadius };
}



//const TentaItemsBackfill = styled("div")({
//	position: "absolute",
//	//inset: "2px 2px 3px 4px",
//	inset: "0 0 2px 0",
//	background: bgColors[1],
//	border: `2px solid ${bgColors[2]}`,
//	borderLeftWidth: "2px",
//	//margin: "0 6px 0 22px",
//	borderRadius: 15,
//	boxShadow: elevaltionShadows.L1,
//})



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
	top: 12,
	height: 12,
	width: width,
	border: `${thickness || 1}px solid ${bgColors[3]}`,
	borderTopWidth: 0,
	borderRightWidth: 0,
	borderBottomLeftRadius: 12,
	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,
}));