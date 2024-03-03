import { $log, Div, Pane, Route, Txt, ValueFader } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import Button from "@mui/material/Button";
import { useState } from "react";
import { useData } from "./db";
import { DB, Unit_Subordination, type Unit } from "./domain";
import { Pile } from "./piles";
import { PileNode1 } from './piles/nodes1/PileNode1';
import { PileNode2_1 } from "./piles/nodes1/PileNode2_1";
import { PileNode4 } from "./piles/nodes1/PileNode4";
import { gsm } from "./semantics";






//===






export module Page043
{


	export var route = Route.create({
		key: "page043",
		icon: <PageIcon />,
		title: "Page 043",
		content: () => <Content />,
	});



	export function Content()
	{

		let { db } = useData();

		//let units = db.Unit.all.filter(a => a.type === UnitType.Squad);
		let units = db.Unit.roots();


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






var UnitTenta: PileNode2_1.TF<[DB, Unit]> = PileNode2_1.createFactory((db: DB, unit: Unit) => [

	unit.id,

	() => unit.subunits?.map(a => UnitSubunitTenta(db, a)),


	//() => [
	//	//(unit.hasSubunits || unit.hasMasters) && UnitSubordinationsTenta(db, unit),
	//	unit.hasSubunits && UnitSubordinationsTenta(db, unit),
	//],

	(tenta: PileNode2_1.Tenta) =>
	{

		//$log("Unit Row " + tenta);


		return <PileNode2_1 backfill tenta={tenta}>

			{() => <>
				<UnitBody tenta={tenta} db={db} unit={unit} start />
				<UnitActions db={db} unit={unit} end />
			</>}

		</PileNode2_1>;

	},



]);




function UnitBody({ tenta, db, unit, ...props }: { tenta: PileNode1.Tenta; db: DB, unit: Unit } & Pane.RowProps)
{

	let [name, ...masterNames] = unit.allNamesBy(db);


	return <Pane.Row {...props}>

		<Pane flex1 start end>

			<Div vcenter pl8>
				<Pile.PhaseIcon />
			</Div>

			<Div flex64px font54px vcenter textCenter>{gsm.UnitType.$item(unit.type)!.$icon}</Div>
			<Div flex1 p12>
				<Div fontLg><em>{name?.shortName}</em> {masterNames.map(a => a.shortName2).join(" ")}</Div>
				<ValueFader value={tenta.collapsed} expander>
					{(collapsed) => (collapsed
						? <Div opacity7><em>{name?.name}</em> {masterNames.map(a => a.name2).join(" ")}</Div>
						: <Div opacity7><em>{name?.fullName}</em> {masterNames.map(a => a.fullName2).join(" ")}</Div>
					)}
				</ValueFader>
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




//var UnitSubordinationsTenta = PileTabsNode.createFactory((db: DB, unit: Unit) => [

//	"subordinations",

//	{
//		subunits: unit.hasSubunits && {
//			title: () => <em>{gsm.Unit.hasSubunits.$one} {unit.subunits?.length} {gsm.Unit.$noun(unit.subunits?.length)}</em>,
//			tentas: () => unit.subunits?.map(a => UnitSubunitTenta(db, a)),
//		},

//		masters: unit.hasMasters && {
//			title: () => <em>{gsm.Unit.hasMasters.$one} {unit.masters?.length} {gsm.Unit.$noun3(unit.masters?.length)}</em>,
//			tentas: () => unit.masters?.map(a => UnitMasterTenta(db, a)),
//		},
//	},

//	tenta => <PileTabsNode tenta={tenta} />,

//]);



var UnitSubunitTenta: PileNode2_1.TF<[DB, Unit_Subordination]> = PileNode2_1.createFactory((db: DB, r: Unit_Subordination) => [

	r.id,

	() => r.unit.subunits?.map(a => UnitSubunitTenta(db, a)),
	//() => [
	//	(r.unit.hasSubunits || r.unit.hasMasters) && UnitSubordinationsTenta(db, r.unit),
	//],

	(tenta: PileNode2_1.Tenta) => (

		<PileNode2_1 tenta={tenta}>

			<>

				<UnitBody tenta={tenta} db={db} unit={r.unit} start />

				<Pane flex0 p12>
					<div>
						<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
						<div><Txt.Date>{r.dateTo}</Txt.Date></div>
					</div>
				</Pane>

				<UnitActions db={db} unit={r.unit} end />

			</>

		</PileNode2_1>

	)

]);


//var UnitMasterTenta: PileNode2.TF<[DB, Unit_Subordination]> = PileNode2.createFactory((db: DB, r: Unit_Subordination) => [

//	r.id,

//	() => [
//		(r.master.hasSubunits || r.master.hasMasters) && UnitSubordinationsTenta(db, r.master),
//	],

//	(tenta: PileNode2.Tenta) => (

//		<PileNode2 tenta={tenta}>

//			<>

//				<UnitBody tenta={tenta} db={db} unit={r.master} start />

//				<Pane flex0 p12>
//					<div>
//						<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
//						<div><Txt.Date>{r.dateTo}</Txt.Date></div>
//					</div>
//				</Pane>

//				<UnitActions db={db} unit={r.master} end />

//			</>

//		</PileNode2>

//	)

//]);
