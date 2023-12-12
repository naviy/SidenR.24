import { $log, Div, Expander, GlobalState, Pane, Route } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import Button from "@mui/material/Button";
import React, { useReducer, useState } from "react";
import { Pile } from "./piles";
import { PileNode2 } from "./piles/nodes1/PileNode2";
import { PileNode3 } from "./piles/nodes1/PileNode3";
import { Tenta } from './tentas';
import { PileNode4 } from "./piles/nodes1/PileNode4";






//===






export module Page04
{


	export var route = Route.create({
		key: "page04",
		icon: <PageIcon />,
		title: "Page 04",
		content: () => <Content />,
	});



	export function Content()
	{

		return <>

			<Pile.GlobalStyles />

			<GlobalState name="page03">
				<Div mx200 m100>
					<Rows05Pile />
				</Div>
			</GlobalState>

		</>;

	}


}






//===






//const myData = [1, 2,3,4,5,6,7];
const myData = [1, 2,];






class Rows05PileTenta extends PileNode4.Tenta
{

	constructor(data: typeof myData)
	{
		super("root");

		this.addCollector("root-rows", () =>
			data.map(a => new Row05Tenta(a))
		);

	}

}



function Rows05Pile()
{

	let [tenta] = useState(() => new Rows05PileTenta(myData));

	let globalState = GlobalState.use("Rows05Pile");
	tenta.setGlobalState(globalState);

	//$log("Rows05Pile " + tenta);


	return (
		<Pane.Col start end b="md" r="lg">
			<Pane.Ghost start end b="sm" r="">

				<Pane.Col start end>

					<PileNode4 tenta={tenta}>

						<>
							<Pane.Ghost start end b="">
								<Pane start p12 vcenter>
									<Pile.PhaseIcon />
									<em>MY DATA</em>
								</Pane>
								<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
							</Pane.Ghost>

						</>

						<>
							<Tenta.Collection id="root-rows" />
						</>

					</PileNode4>

				</Pane.Col>

			</Pane.Ghost>
		</Pane.Col>

	);

}






//===






//function Rows05()
//{

//	return <>

//		<Pane.Col start end>

//			<Pile.ListBackfill />

//			<Tenta.Collection
//				id="rows05"
//				tentas={[[PileNode2, 1], [PileNode2, 2],]}
//			>

//				<Row05 id={1} />
//				<Row05 id={2} />
//				{/*<Row05 id={3} />*/}
//				{/*<Row05 id={4} />*/}
//				{/*<Row05 id={5} />*/}
//				{/*<Row05 id={6} />*/}
//				{/*<Row05 id={7} />*/}

//			</Tenta.Collection>

//		</Pane.Col>

//	</>;
//}





//===






class Row05Tenta extends PileNode2.Tenta
{
	constructor(id: React.Key)
	{
		super(id);

		this.addCollector("catagories", () => [
			new Catagory1Tenta(myData),
			new Catagory2Tenta(myData)
		]);
	}

	override render()
	{
		return <Row05 key={this.id} tenta={this} />
	}

}


function Row05(props: PileNode2.Props)
{

	//$log("Row05 " + props.tenta);


	return <PileNode2 backfill {...props}>

		<RowBody>

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
			<Tenta.Collection id="catagories" />
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


	function RowBody(props: { children: [JSX.Element, JSX.Element, JSX.Element, JSX.Element, JSX.Element, JSX.Element] })
	{

		let tenta = Tenta.useByPhase()!;
		let { phase } = tenta;
		let parts = props.children;

		//$log("RowRim", props.id)


		return <>

			<Pane.Col start>

				<Pane.Row start end={!phase}>
					{parts[0]}
				</Pane.Row>

				<Pane.Row
					end
					//id={`row05-expander #${tenta.id}`}
					expanded={!!phase}
				//noreexpand
				>
					{parts[1]}
				</Pane.Row>

			</Pane.Col>

			<Pane.Row id="row05-bottom" end>

				{/*<Pane.Col start l={120}>*/}
				{/*	<TransitionGroup>*/}
				{/*		{phase !== 1 && <FillFade>{parts[2]}</FillFade>}*/}
				{/*		{phase === 1 && <FillFade>{parts[3]}</FillFade>}*/}
				{/*	</TransitionGroup>*/}
				{/*</Pane.Col>*/}

				{/*<Pane.Col l={120}>*/}
				{/*	<Pane.Row start end={phase !== 1}>*/}
				{/*		{parts[2]}*/}
				{/*	</Pane.Row>*/}
				{/*	<Pane.Col end l={2} expanded={phase === 1}>*/}
				{/*		{parts[4]}*/}
				{/*	</Pane.Col>*/}
				{/*</Pane.Col>*/}

				{parts[5]}

			</Pane.Row >

		</>;

	}


}





class Catagory1Tenta extends PileNode3.Tenta
{

	constructor(public data: typeof myData)
	{
		super("ctg1");

		this.addCollector("rows1", () =>
			data.map(a => new Row05Tenta(a))
		);
	}

	override render()
	{
		return <Catagory1Node key={this.id} tenta={this} />
	}

}



function Catagory1Node(props: PileNode3.Props)
{

	//$log("Catagory1Node " + props.tenta);

	return (

		<PileNode3 {...props}>

			<>
				<Pane.Ghost start end b="">
					<Pane start p12 vcenter>
						{/*<div>##{props.tenta.iid}</div>*/}
						<Pile.PhaseIcon />
						<em>CATAGORY 111</em>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</Pane.Ghost>

			</>

			<>
				<Tenta.Collection id="rows1" />
			</>

		</PileNode3>

	);

}




class Catagory2Tenta extends PileNode3.Tenta
{

	constructor(public data: typeof myData)
	{
		super("ctg2");

		this.addCollector("rows2", () =>
			data.map(a => new Row05Tenta(a))
		);
	}

	override render()
	{
		return <Catagory2Node key={this.id} tenta={this} />
	}

}




function Catagory2Node(props: PileNode3.Props)
{

	//$log("Catagory2Node " + props.tenta);

	return (

		<PileNode3 {...props}>

			<>
				<Pane.Ghost start end b="">
					<Pane start p12 vcenter>
						{/*<div>##{props.tenta.iid}</div>*/}
						<Pile.PhaseIcon />
						<em>CATAGORY 2222</em>
					</Pane>
					<Pane end p12 textRight vcenter>222 2222 22222 222222</Pane>
				</Pane.Ghost>

			</>

			<>
				<Tenta.Collection id="rows2" />
			</>

		</PileNode3>

	);

}










