import { Expander, FillFade, Focuser, Pane, TransitionGroup, useNew } from '@libs';
import { Button } from "@mui/material";
import React, { ReactNode, useReducer } from "react";
import { ContainerInfo } from "../@libs/components/pane/ContainerInfo";
import { Tenta } from './tentas';







export function Page02()
{

	return <>

		<Pane.Col mx48 m100 rounded e={0} p2 gap1>

			{/*<Row051 start end />*/}
			<Row05 start end />

			{/*<Row05 start />*/}
			{/*<Row05 />*/}
			{/*<Row05 />*/}
			{/*<Row05 />*/}
			{/*<Row05 end />*/}

		</Pane.Col>

	</>;

}



function Row05(props: Pane.RowProps)
{

	return <PileRow {...props}>
		<RowRim>

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


	function RowRim(props: { children: ReactNode })
	{

		let phase = Tenta.Phase.use();

		let fs = React.Children.toArray(props.children);


		return <>

			<Pane.Col start>

				<Pane.Row end={phase !== 1}>
					{fs[0]}
				</Pane.Row>

				<Pane.Row expanded={phase === 1} wrapperCls="pt1" gap1 noreexpand>
					{fs[1]}
				</Pane.Row>

			</Pane.Col>

			<Pane.Row gapi end>

				<Pane.Col gapi l={120}>
					<TransitionGroup>
						{phase !== 1 && <FillFade>{Pane.injectProps(fs[2])}</FillFade>}
						{phase === 1 && <FillFade>{Pane.injectProps(fs[3])}</FillFade>}
					</TransitionGroup>
				</Pane.Col>

				<Pane.Col l={120}>
					<Pane.Row end={phase !== 1}>
						{fs[2]}
					</Pane.Row>
					<Pane.Col l={2} expanded={phase === 1} pt1={phase === 1}>
						{fs[4]}
					</Pane.Col>
				</Pane.Col>

				{fs[5]}

			</Pane.Row >

		</>;

	}


}



function Row051(props: Pane.RowProps)
{

	return <PileRow {...props}>
		<RowRim>

			<>
				<Pane p12>111 1111 11111 111111</Pane>
				<Pane p12>222 2222 22222 222222</Pane>
				<Pane p12 textRight>333 3333 33333 333333</Pane>
			</>

			<Pane id="2" p12 vcenter>111 1111 11111 111111</Pane>

		</RowRim>

	</PileRow>;



	function RowRim(props: { children: ReactNode })
	{

		let phase = Tenta.Phase.use();

		let fs = React.Children.toArray(props.children);


		return <>

			<Pane.Col start end>

				<Pane.Row end={phase !== 1} gapi>
					{fs[0]}
				</Pane.Row>

				<Pane.Row id="row51-2" expanded={phase === 1} wrapperCls="pt1" gapi noreexpand>
					{fs[1]}
				</Pane.Row>

			</Pane.Col>

		</>;

	}


}



//---



function PileRow(props: Pane.RowProps)
{

	let bhv = useNew(Tenta.Behavior).use();


	return (

		<Tenta.Phase.Provider bhv={bhv}>

			<Focuser
				ref={bhv.ffRef}
				padding={bhv.collapsed ? -2 : 0}
				listener={bhv}
			>

				<Pane.Row
					//debug
					id="pile-row"
					{...props}

					gap1
					{...bhv.expanded && { rounded: true, e: 1, mx: -12, my: 4, p: 2 }}
					{...bhv.opened && { rounded: true, e: 3, mx: -24, my: 36, p: 2 }}
					ppx0={bhv.priorPhase === 1 ? 10 : bhv.priorPhase === 2 ? 22 : 0}
					ppx={bhv.phase === 1 ? 10 : bhv.phase === 2 ? 22 : 0}

					//gap1 pg={1}
					//{...bhv.expanded && { rounded: true, e: 1, mx: -12, my: 4, p: 3, gap: 3, pg: 0, }}
					//{...bhv.opened && { rounded: true, e: 3, mx: -24, my: 36, p: 3, gap: 3, pg: 0 }}
					//ppx0={bhv.priorPhase === 1 ? 9 : bhv.priorPhase === 2 ? 22 : 0}
					//ppx={bhv.phase === 1 ? 9 : bhv.phase === 2 ? 21 : 0}

					cursorPointer
					zIndex1={bhv.expanded}
				>
					<Focuser.Caret
						use={usePileRowCaretProps}
					//color={props.start ? "green" : props.end ? "red" : undefined }
					/>
					{props.children}
				</Pane.Row>

			</Focuser>

		</Tenta.Phase.Provider>

	);

}



function usePileRowCaretProps()
{
	let row = ContainerInfo.use();
	return { borderRadius: row?.cssBorderRadius };
}
