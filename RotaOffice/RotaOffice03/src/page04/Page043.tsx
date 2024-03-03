import { $log, Div, HR, Pane, Route, Txt, ValueFader } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import Button from "@mui/material/Button";
import { useState, type ReactNode } from "react";
import { useData } from "./db";
import { DB, Unit_Subordination, type Unit } from "./domain";
import { Pile } from "./piles";
import { PileNode1 } from './piles/nodes1/PileNode1';
import { PileNode2_2 } from "./piles/nodes1/PileNode2_2";
import { PileNode4 } from "./piles/nodes1/PileNode4";
import { gsm } from "./semantics";
import { Tenta } from './tentas';
import Alert from '@mui/material/Alert';






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






var UnitTenta: PileNode2_2.TF<[DB, Unit]> = PileNode2_2.createFactory((db: DB, unit: Unit) => [

	unit.id,

	() => unit.subunits?.map(a => UnitSubunitTenta(db, a)),


	//() => [
	//	//(unit.hasSubunits || unit.hasMasters) && UnitSubordinationsTenta(db, unit),
	//	unit.hasSubunits && UnitSubordinationsTenta(db, unit),
	//],

	(tenta: PileNode2_2.Tenta) =>
	{

		//$log("Unit Row " + tenta);


		return <PileNode2_2 backfill tenta={tenta}>

			{() => <>
				<UnitBody tenta={tenta} db={db} unit={unit} start />
				<UnitActions db={db} unit={unit} end />
			</>}

		</PileNode2_2>;

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



function UnitRow({ children }: { children: ReactNode })
{

	let tenta = Tenta.useByPhase()!;

	if (!(tenta instanceof PileNode2_2.Tenta))
		return <Alert severity="error">tenta is {tenta + ''}</Alert>;



	return (

		<Pane.Col start end>

			<Pane.Row start end={!tenta.opened}>
				{children}
			</Pane.Row>

			<HR/>

			<Pane.Row expanded={tenta.opened} end>
				<Pane start end p8 pl48>
					<PileNode2_2.Tabs tenta={tenta} />
				</Pane>
			</Pane.Row>

		</Pane.Col>

	);

}


var UnitSubunitTenta: PileNode2_2.TF<[DB, Unit_Subordination]> = PileNode2_2.createFactory(

	(db: DB, { id, unit, dateFrom, dateTo }: Unit_Subordination) => [

		id,

		//() => unit.subunits?.map(a => UnitSubunitTenta(db, a)),

		{
			subunits: unit.hasSubunits && {
				title: () => <em>{gsm.Unit.hasSubunits.$one} {unit.subunits?.length} {gsm.Unit.$noun(unit.subunits?.length)}</em>,
				tentas: () => unit.subunits?.map(a => UnitSubunitTenta(db, a)),
			},

			masters: unit.hasMasters && {
				title: () => <em>{gsm.Unit.hasMasters.$one} {unit.masters?.length} {gsm.Unit.$noun3(unit.masters?.length)}</em>,
				tentas: () => unit.masters?.map(a => UnitMasterTenta(db, a)),
			},
		},


		(tenta: PileNode2_2.Tenta) => (

			<PileNode2_2 tenta={tenta}>

				<UnitRow>

					<UnitBody tenta={tenta} db={db} unit={unit} start />

					<Pane flex0 p12>
						<div>
							<div><Txt.Date>{dateFrom}</Txt.Date></div>
							<div><Txt.Date>{dateTo}</Txt.Date></div>
						</div>
					</Pane>

					<UnitActions db={db} unit={unit} end />

				</UnitRow>

			</PileNode2_2>

		)

	]

);



var UnitMasterTenta: PileNode2_2.TF<[DB, Unit_Subordination]> = PileNode2_2.createFactory(

	(db: DB, { id, master, dateFrom, dateTo }: Unit_Subordination) => [

		id,

		//() => r.unit.subunits?.map(a => UnitSubunitTenta(db, a)),
		//() => [
		//	(r.unit.hasSubunits || r.unit.hasMasters) && UnitSubordinationsTenta(db, r.unit),
		//],

		{
			subunits: master.hasSubunits && {
				title: () => <em>{gsm.Unit.hasSubunits.$one} {master.subunits?.length} {gsm.Unit.$noun(master.subunits?.length)}</em>,
				tentas: () => master.subunits?.map(a => UnitSubunitTenta(db, a)),
			},

			//masters: master.hasMasters && {
			//	title: () => <em>{gsm.Unit.hasMasters.$one} {master.masters?.length} {gsm.Unit.$noun3(master.masters?.length)}</em>,
			//	tentas: () => master.masters?.map(a => UnitMasterTenta(db, a)),
			//},
		},


		(tenta: PileNode2_2.Tenta) => (

			<PileNode2_2 tenta={tenta}>

				<>

					<UnitBody tenta={tenta} db={db} unit={master} start />

					<Pane flex0 p12>
						<div>
							<div><Txt.Date>{dateFrom}</Txt.Date></div>
							<div><Txt.Date>{dateTo}</Txt.Date></div>
						</div>
					</Pane>

					<UnitActions db={db} unit={master} end />

				</>

			</PileNode2_2>

		)

	]

);


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
