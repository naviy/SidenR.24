import { $log, Div, Expander, FillFade, Focuser, Pane, TransitionGroup, _$log, __$log, useNew } from '@libs';
import { Button } from "@mui/material";
import React, { type ReactNode, useReducer, type Key } from "react";
import { Tenta } from './tentas';
import { TentaStage } from "./tentas/TentaStage";







export function Page03()
{

	return <>

		<Pane.Col mx48 m100 rounded elevation={0} p2 gap1>

			<Rows05 />

		</Pane.Col>

	</>;

}



function Rows05()
{
	return <>

		<Tenta.Placeholder.Collector placeholders={[1, 2, 3, 4, 5, 6, 7]}>

			<Row05 id={1} />
			<Row05 id={2} />
			<Row05 id={3} />
			<Row05 id={4} />
			<Row05 id={5} />
			<Row05 id={6} />
			<Row05 id={7} />

		</Tenta.Placeholder.Collector>

	</>;
}


function Row05(props: PileRowProps)
{
	//$log("Row05.id:", props.id)


	return <PileRow {...props}>

		<RowRim id={props.id}>

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

		</RowRim>

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


	function RowRim(props: { id: React.Key; children: ReactNode })
	{

		let phase = Tenta.Phase.use();

		let fs = React.Children.toArray(props.children);

		//$log("RowRim", props.id)


		return <>

			<Pane.Col start end gapi>

				<Pane.Row gapi end>

					<Pane.Col>

						<Pane.Row end={phase !== 1}>
							{fs[0]}
						</Pane.Row>

						<Pane.Row id={`row05-expander #${props.id}`} expanded={phase === 1} wrapperCls="pt1" gap1 noreexpand>
							{fs[1]}
						</Pane.Row>

					</Pane.Col>

					<Pane.Row id="row05-bottom" gapi end>

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

						{fs[5]}

					</Pane.Row >

				</Pane.Row>


				<Pane.Col expanded={phase === 2} wrapperCls="p8 pl32">

					<Rows05 />

				</Pane.Col>


			</Pane.Col>


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
	let tenta = useNew(Tenta.Behavior).use({
		placeholder,
	});


	let topStage = placeholder?.prior ? null : tenta.stage;
	let btmStage = TentaStage.max(tenta.stage, placeholder?.next?.stage);

	let start = tenta.opened || !placeholder?.prior || placeholder.prior.opened;
	let end = tenta.opened || !placeholder?.next || placeholder.next.opened;


	return (

		<Tenta.Phase.Provider phase={tenta.phase}>

			<Focuser
				ref={tenta.ffRef}
				padding={tenta.collapsed ? -2 : 0}
				listener={tenta}
			>

				<Pane.Row
					//debug
					id={`pile-row #${id}`}

					start={start}
					end={end}

					{...rowProps}

					gap1

					//elevation={btmStage !== "collapsed" ? 1 : undefined}

					{...tenta.expanded && { elevation: 1, mx: -12, p: 2 }}
					{...tenta.opened && { rounded: true, elevation: 3, mx: -24, p: 2 }}
					ppx0={tenta.priorPhase === 1 ? 10 : tenta.priorPhase === 2 ? 22 : 0}
					ppx={tenta.phase === 1 ? 10 : tenta.phase === 2 ? 22 : 0}

					mt={topStage === "expanded" ? 4 : topStage === "opened" ? 36 : 0}
					mb={btmStage === "expanded" ? 4 : btmStage === "opened" ? 36 : 0}

					cursorPointer
					zIndex1={tenta.expanded}
				>

					<Tenta.Placeholder.NoCollector>

						<Focuser.Caret
							use={usePileRowCaretProps}
						//color={props.start ? "green" : props.end ? "red" : undefined }
						/>
						{rowProps.children}

					</Tenta.Placeholder.NoCollector>

				</Pane.Row>

			</Focuser>

		</Tenta.Phase.Provider>

	);

}



function usePileRowCaretProps()
{
	let row = Pane.ContainerInfo.use();
	return { borderRadius: row?.cssBorderRadius };
}
