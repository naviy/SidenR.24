import { Expander, Focuser, Pane, useNew } from '@libs';
import { Button } from "@mui/material";
import { useReducer } from "react";
import { Tenta } from './tentas';






export function Page02()
{

	return <>

		<Pane.Col mx48 m100 rounded e={0} p2 gap1>

			<Row05 start end />

			{/*<Row03 start />*/}
			{/*<Row03 />*/}
			{/*<Row03 />*/}

			{/*<Row04 />*/}
			{/*<Row04 />*/}
			{/*<Row04 />*/}
			{/*<Row04 end />*/}

		</Pane.Col>

	</>;

}



function Row03(props: Pane.RowProps)
{

	return <PileRow {...props}>

		<Pane l={300} p24>111 1111 11111 111111</Pane>
		<Pane p24>222 2222 22222 222222</Pane>
		<Pane l={300} p24 textRight>333 3333 33333 333333</Pane>

	</PileRow>;

}



function Row04(props: Pane.RowProps)
{

	return <PileRow {...props}>

		<Pane.Col gapi l={560}>

			<Pane.Row end={false}>
				<Pane p24>111 1111 11111 111111</Pane>
				<Pane p24>222 2222 22222 222222</Pane>
				<Pane p24 textRight>333 3333 33333 333333</Pane>
			</Pane.Row>

			<Pane.Row gap1>
				<Pane p24>111 1111 11111 111111</Pane>
				<Pane p24>222 2222 22222 222222</Pane>
				<Pane p24 textRight>333 3333 33333 333333</Pane>
			</Pane.Row>

		</Pane.Col>

		<Pane.Row gapi l={2}>
			<Pane.Col gapi l={150}>
				<Pane end={false} p8 center vcenter>aaa aaa aaaa</Pane>
				<Pane.Col gap1>
					<Pane p8 center vcenter>bbb bbb bbbb</Pane>
					<Pane p8 center vcenter>ccc ccc cccc</Pane>
				</Pane.Col>
			</Pane.Col>
			<Pane p24 vcenter>222 2222 22222 222222</Pane>
			<Pane p24 textRight vcenter>333 3333 33333 333333</Pane>
		</Pane.Row>

	</PileRow>;

}



function Row05(props: Pane.RowProps)
{

	let [expanded, toggleExpanded] = useReducer(a => !a, false);
	let [expanded2, toggleExpanded2] = useReducer(a => !a, false);


	function endOnPhaseNot1()
	{
		return Tenta.Phase.useProps(phase => ({ end: phase !== 1 }));
	}

	function expandedOnPhase1()
	{
		return Tenta.Phase.useProps(phase => ({ expanded: phase === 1 }));
	}


	return <PileRow {...props}>

		<Pane.Col gapi>

			<Pane.Row use={endOnPhaseNot1}>
				<Pane p24>111 1111 11111 111111</Pane>
				<Pane p24>222 2222 22222 222222</Pane>
				<Pane p24 textRight>333 3333 33333 333333</Pane>
			</Pane.Row>

			<Expander use={expandedOnPhase1} noreexpand>
				<Pane.Row gap1>
					<Pane p24>111 1111 11111 111111</Pane>
					<Pane p24>222 2222 22222 222222</Pane>
					<Pane p24 textRight>
						333 3333 33333 333333
						<Button onClick={e => { e.stopPropagation(); toggleExpanded(); }}>TOGGLE</Button>
						<Expander id="2" expanded={expanded}>
							<div>4444 4 4444 44 4 444444 4 44444 4444</div>
							<Button onClick={e => { e.stopPropagation(); toggleExpanded2(); }}>TOGGLE2</Button>
							{expanded2 && <div>5555 5 5555 55 5 555555 5 55555 5555</div>}
						</Expander>
					</Pane>
				</Pane.Row>
			</Expander>

		</Pane.Col>

		<Pane.Row gapi>
			<Pane.Col gapi l={150}>
				<Pane end={false} l={1} p8 center vcenter>aaa aaa aaaa</Pane>
				<Expander use={expandedOnPhase1} flex2 wrapperCls="flex1 vflex">
					<Pane.Col gap1 flex1>
						<Pane p8 center vcenter>bbb bbb bbbb</Pane>
						<Pane p8 center vcenter>ccc ccc cccc</Pane>
					</Pane.Col>
				</Expander>
			</Pane.Col>
			<Pane p24 vcenter>222 2222 22222 222222</Pane>
			<Pane p24 textRight vcenter>333 3333 33333 333333</Pane>
		</Pane.Row>

	</PileRow>;

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
					{...props}
					gap1
					{...bhv.expanded && { rounded: true, p: 2, e: 1, mx: -12, my: 12 }}
					{...bhv.opened && { rounded: true, p: 2, e: 3, mx: -24, my: 36 }}
					cursorPointer
				>
					<Focuser.Caret />
					{props.children}
				</Pane.Row>

			</Focuser>

		</Tenta.Phase.Provider>

	);

}

