import { Div, Expander, FillFade, GlobalState, Pane, Route, TransitionGroup } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import Button from "@mui/material/Button";
import { useReducer } from "react";
import { Pile, type PileNode1Props } from "./piles";
import { PileNode2 } from "./piles/nodes1/PileNode2";
import { PileNode3 } from "./piles/nodes1/PileNode3";
import { Tenta } from './tentas';






//===






export module Page033
{


	export var route = Route.create({
		key: "page033",
		icon: <PageIcon />,
		title: "Page 033",
		content: () => <Content />,
	});


	export function Content()
	{

		return <>

			<GlobalState name="page03">

				<Div mx200 m100>

					<GlobalState name="Rows05Pile">

						<Pane.Col start end b="md" r="lg">
							<Pane.Ghost start end b="sm" r="">
								<Rows05 />
							</Pane.Ghost>
						</Pane.Col>

					</GlobalState>

				</Div>

			</GlobalState>

		</>;

	}


}






//===






function Rows05()
{

	let qqq: Tenta.Placeholder.DefaultProps

	return <>

		<Pane.Col start end>

			<Pile.ListBackfill />

			<Tenta.Placeholders
				id="rows05"
				//placeholders={[1, 2, 3, 4, 5, 6, 7]}
				placeholders={[[PileNode2, 1], [PileNode2, 2],]}
			>

				<Row05 id={1} />
				<Row05 id={2} />
				{/*<Row05 id={3} />*/}
				{/*<Row05 id={4} />*/}
				{/*<Row05 id={5} />*/}
				{/*<Row05 id={6} />*/}
				{/*<Row05 id={7} />*/}

			</Tenta.Placeholders>

		</Pane.Col>

	</>;
}



function Row05(props: PileNode1Props)
{
	//$log("Row05.id:", props.id)


	return <PileNode2 collectors={["subnodes"]} {...props}>

		<RowBody id={props.id}>

			<>
				<Pane start p12>
					<Pile.PhaseIcon />
					<span>111 1111 11111 111111</span>
				</Pane>
				<Pane end p12 textRight>222 2222 22222 222222</Pane>
			</>

			<>
				<Pane start p12 vcenter>aaa aaaaa aaaaaaa aaaaaaaa</Pane>
				<Pane p12 vcenter>bbbb bbbb bbbbb bbbbbbbbb bbb</Pane>
				<Pane p12 vcenter>ccc cccc cccccc cccccccc cccc ccccccc</Pane>
				<Pane end p12 vcenter textRight>
					<div>
						333 3333 33333 333333
						<Cell3 />
					</div>
				</Pane>
			</>

			<>
				<Pane l={1} start end center p12 >aaa aaa</Pane>
			</>

			<>
				<Pane l={1} start center vcenter>xxx xxx xxxx</Pane>
				<Pane l={1} center vcenter>yyy yyy yyyy</Pane>
				<Pane l={1} end center vcenter>zzz zzz zzzz</Pane>
			</>

			<Pane.Col flex1 end>
				<Pane l={1} start center vcenter>bbb bbb bbbb</Pane>
				<Pane l={1} end center vcenter>ccc ccc cccc</Pane>
			</Pane.Col>

			<>
				<Pane start p12 vcenter>222 2222 22222 222222</Pane>
				<Pane end p12 textRight vcenter>333 3333 33333 333333</Pane>
			</>

		</RowBody>


		<>
			<Tenta.Placeholders id="subnodes" placeholders={[[PileNode3, "ctg1"], [PileNode3, "ctg2"]]}>
				<Catagory1Node id="ctg1" />
				<Catagory2Node id="ctg2" />
			</Tenta.Placeholders>
		</>


	</PileNode2>;



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


	function RowBody(props: { id: React.Key; children: [JSX.Element, JSX.Element, JSX.Element, JSX.Element, JSX.Element, JSX.Element] })
	{

		let tenta = Tenta.useByPhase()!;
		let { phase } = tenta;
		let parts = props.children;

		//$log("RowRim", props.id)


		return <>

			<Pane.Col start>

				<Pane.Row start end={phase !== 1}>
					{parts[0]}
				</Pane.Row>

				<Pane.Row
					end
					id={`row05-expander #${props.id}`}
					expanded={phase === 1}
				//noreexpand
				>
					{parts[1]}
				</Pane.Row>

			</Pane.Col>

			<Pane.Row id="row05-bottom" end>

				<Pane.Col start l={120}>
					<TransitionGroup>
						{phase !== 1 && <FillFade>{parts[2]}</FillFade>}
						{phase === 1 && <FillFade>{parts[3]}</FillFade>}
					</TransitionGroup>
				</Pane.Col>

				<Pane.Col l={120}>
					<Pane.Row start end={phase !== 1}>
						{parts[2]}
					</Pane.Row>
					<Pane.Col end l={2} expanded={phase === 1}>
						{parts[4]}
					</Pane.Col>
				</Pane.Col>

				{parts[5]}

			</Pane.Row >

		</>;

	}


}




function Catagory1Node(props: PileNode3.Props)
{

	return (

		<PileNode3 {...props} collectors={["rows05"]}>

			<>
				<Pane.Ghost start end b="">
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<em>CATAGORY 111</em>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</Pane.Ghost>

			</>

			<>
				<Rows05 />
			</>

		</PileNode3>

	);

}




function Catagory2Node(props: PileNode3.Props)
{

	return (

		<PileNode3 {...props} collectors={["rows05"]}>

			<>
				<Pane.Ghost start end b="">
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<em>CATAGORY 2222</em>
					</Pane>
					<Pane end p12 textRight vcenter>222 2222 22222 222222</Pane>
				</Pane.Ghost>

			</>

			<>
				<Rows05 />
			</>

		</PileNode3>

	);

}










