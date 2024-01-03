import { $log, Div, Expander, Pane, Route } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import Button from "@mui/material/Button";
import { useReducer, useState } from "react";
import { useData } from "./db";
import { DB, Unit_Subordination, type Unit, UnitType } from "./domain";
import { Pile } from "./piles";
import { gsm } from "./semantics";
import { PileNode2 } from "./piles/nodes1/PileNode2";
import { PileNode3 } from "./piles/nodes1/PileNode3";
import { PileNode4 } from "./piles/nodes1/PileNode4";
import { PileTabsNode } from './piles/nodes1/PileTabsNode';
import { Tenta } from './tentas';
import { PileNode1 } from './piles/nodes1/PileNode1';






//===






export module Page041
{


	export var route = Route.create({
		key: "page041",
		icon: <PageIcon />,
		title: "Page 041",
		content: () => <Content />,
	});



	export function Content()
	{

		let { db } = useData();

		let units = db.Unit.all.filter(a => a.type === UnitType.Squad);
		//let units = db.Unit.roots();


		let [tenta] = useState(() => UnitsPileTenta(db, units));

		tenta.use({ root: true });
		tenta.useGlobalState();


		return <>

			<Div mx200 m100>
				{tenta.render()}
			</Div>

		</>;

	}


}






var UnitsPileTenta = PileNode4.createFactory((db: DB, units: Unit[]) => [

	"UnitsPile",

	() => units.map(unit => UnitTenta(db, unit)),

	(tenta: PileNode4.Tenta) =>

		<Pane.Col start end>

			<PileNode4 tenta={tenta}>

				<>
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<em>{gsm.Unit.$Many}</em>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</>

			</PileNode4>

		</Pane.Col>

	,

]);






//===






var UnitTenta: PileNode1.TF<[DB, Unit]> = PileNode1.createFactory((db: DB, unit: Unit) => [

	unit.id,

	//() => [
	//	Catagory1Tenta(myData),
	//	Catagory2Tenta(myData),
	//	Catagory3Tenta(myData.map(a => a * 10)),
	//],

	(tenta: PileNode1.Tenta) =>
	{

		//$log("Unit Row " + tenta);


		return <PileNode2 backfill tenta={tenta}>

			<>
				<UnitBody db={db} unit={unit} start />
				<UnitActions db={db} unit={unit} end />
			</>

		</PileNode2>;

	},



]);




function UnitBody({ db, unit, ...props }: { db: DB, unit: Unit } & Pane.RowProps)
{

	let [name, ...masterNames] = unit.allNamesBy(db);


	return <Pane.Row {...props}>

		<Pane flex1 start end>

			<Div vcenter pl8>
				<Pile.PhaseIcon />
			</Div>

			<Div flex64px font54px vcenter textCenter pl8>{gsm.UnitType.$item(unit.type)!.$icon}</Div>
			<Div flex1 p12>
				<Div fontLg><em>{name?.shortName}</em> {masterNames.map(a => a.shortName2).join(" ")}</Div>
				<Div opacity7><em>{name?.fullName}</em> {masterNames.map(a => a.fullName2).join(" ")}</Div>
			</Div>
		</Pane>

	</Pane.Row>

}


function UnitActions({ db, unit, ...props }: { db: DB, unit: Unit } & Pane.Props)
{

	return <>

		<Pane flex0 {...props}>
			<Button onClick={() => $log(`unit #${unit.id}:`, unit)}>$LOG</Button>
		</Pane>

	</>;

}





//var Catagory1Tenta = PileNode3.createFactory((data: typeof myData) => [

//	"ctg1",

//	() => data.map(Row05Tenta),

//	tenta => <PileNode3 tenta={tenta}>
//		<>

//			<Pane start p12 vcenter>
//				<Pile.PhaseIcon />
//				<em>CATAGORY 111</em>
//			</Pane>

//			<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>

//		</>
//	</PileNode3>,

//]);




//var Catagory2Tenta = PileNode3.createFactory((data: typeof myData) => [
//	"ctg2",
//	() => data.map(Row05Tenta),
//	tenta =>
//	{
//		//$log("Catagory2Node " + props.tenta);
//		return <PileNode3 tenta={tenta}>
//			<>

//				<Pane start p12 vcenter>
//					<Pile.PhaseIcon />
//					<em>CATAGORY 2222</em>
//				</Pane>

//				<Pane end p12 textRight vcenter>222 2222 22222 222222</Pane>

//			</>
//		</PileNode3>;
//	}

//]);




//var Catagory3Tenta = PileTabsNode.createFactory((data: typeof myData) => [

//	"ctg3",

//	{
//		tab1: {
//			title: () => "TAB 111",
//			tentas: () => data.map(Row05Tenta),
//		},
//		tab2: {
//			title: () => "TAB 222",
//			tentas: () => [...data, ...data.map(a => a + 5)].map(a => a * 10).map(Row05Tenta),
//		},
//	},

//	tenta => <PileTabsNode tenta={tenta} />,

//]);
