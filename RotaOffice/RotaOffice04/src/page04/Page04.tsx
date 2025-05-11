import { $log, Div, Expander, Pane, Route } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import Button from "@mui/material/Button";
import { useReducer, useState, type ReactNode } from "react";
import { Pile } from "./piles";
import { PileNode2 } from "./piles/nodes1/PileNode2";
import { PileNode3 } from "./piles/nodes1/PileNode3";
import { PileNode4 } from "./piles/nodes1/PileNode4";
import { PileTabsNode } from './piles/nodes1/PileTabsNode';
import { Tenta } from './tentas';






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

			<Div mx200 m100>
				<Rows05Pile />
			</Div>

		</>;

	}


}






//===






//const myData = [1, 2,3,4,5,6,7];
const myData = [1, 2,];






//class Rows05PileTenta extends PileNode4.Tenta
//{

//	constructor(data: typeof myData)
//	{
//		super("root");

//		this.addCollector("root-rows", () =>
//			data.map(a => Row05Tenta(a))
//		);

//	}

//}


var Rows05PileTenta = PileNode4.createFactory((data: typeof myData) => [
	"Rows05Pile",
	() => data.map(Row05Tenta),
	Rows05Pile,
]);



function Rows05Pile()
{

	let [tenta] = useState(() => Rows05PileTenta(myData));

	tenta.use({ root: true });
	tenta.useGlobalState();

	//$log("Rows05Pile " + tenta);


	return (

		<Pane.Col start end b="md" r="lg">
			<Pane.Ghost start end b="sm" r="">

				<Pane.Col start end>

					<PileNode4 tenta={tenta}>

						<>
							<Pane start p12 vcenter>
								<Pile.PhaseIcon />
								<em>MY DATA</em>
							</Pane>
							<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
						</>

					</PileNode4>

				</Pane.Col>

			</Pane.Ghost>
		</Pane.Col>

	);

}






//===






var Row05Tenta: PileNode2.TF<[number]> = PileNode2.createFactory((id: number) => [

	id,

	() => [
		Catagory1Tenta(myData),
		Catagory2Tenta(myData),
		Catagory3Tenta(myData.map(a => a * 10)),
	],

	tenta =>
	{

		$log("Row05 " + tenta);
		//$log("Row05" )


		return <PileNode2 backfill tenta={tenta}>

			<RowBody>

				<>
					<Pane start p12>
						<Pile.PhaseIcon />
						<em>{"".padEnd(20, id + " ")}#{tenta.iid}</em>
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
					<Pane start p12 vcenter l={2}>222 2222 22222 222222</Pane>
					<Pane end p12 textRight l={1} vcenter>333 3333 33333 333333</Pane>
				</>

			</RowBody>

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


		function RowBody(props: { children: [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode] })
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


	},



]);







var Catagory1Tenta = PileNode3.createFactory((data: typeof myData) => [

	"ctg1",

	() => data.map(Row05Tenta),

	tenta => <PileNode3 tenta={tenta}>
		<>

			<Pane start p12 vcenter>
				<Pile.PhaseIcon />
				<em>CATAGORY 111</em>
			</Pane>

			<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>

		</>
	</PileNode3>,

]);




var Catagory2Tenta = PileNode3.createFactory((data: typeof myData) => [
	"ctg2",
	() => data.map(Row05Tenta),
	tenta => 
	{
		//$log("Catagory2Node " + props.tenta);
		return <PileNode3 tenta={tenta}>
			<>

				<Pane start p12 vcenter>
					<Pile.PhaseIcon />
					<em>CATAGORY 2222</em>
				</Pane>

				<Pane end p12 textRight vcenter>222 2222 22222 222222</Pane>

			</>
		</PileNode3>;
	}

]);




var Catagory3Tenta = PileTabsNode.createFactory((data: typeof myData) => [

	"ctg3",

	{
		tab1: {
			title: () => "TAB 111",
			tentas: () => data.map(Row05Tenta),
		},
		tab2: {
			title: () => "TAB 222",
			tentas: () => [...data, ...data.map(a => a + 5)].map(a => a * 10).map(Row05Tenta),
		},
	},

	tenta => <PileTabsNode tenta={tenta} />,

]);
