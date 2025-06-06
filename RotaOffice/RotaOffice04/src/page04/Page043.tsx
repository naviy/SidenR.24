import { $log, Div, Pane, Route, Txt, ValueFader } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import Button from "@mui/material/Button";
import { useState, type ReactNode } from "react";
import { useData } from "./db";
import { DB, gsm, Unit_Subordination, type Unit } from "./domain";
import { Pile } from "./piles";
import { PileNode1 } from './piles/nodes1/PileNode1';
import { PileNode2_2 } from "./piles/nodes1/PileNode2_2";






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
		//let [tenta] = useState(() => RootUnitTenta(db, units[0]));
		//let [tenta] = useState(() => UnitSubunitTenta(db, units[0].subunits![0]));

		tenta.use({ root: true, });
		//tenta.initPhase({ defaultPhase: 1 });
		tenta.useGlobalState();



		return <>

			<Div mx32 m32>
				{tenta.render()}
			</Div>

		</>;

	}


}






var UnitsPileTenta = PileNode2_2.createFactory((db: DB, units: Unit[]) => [

	"UnitsPile",

	() => units.map(unit => RootUnitTenta(db, unit)),

	(tenta: PileNode2_2.Tenta) =>

		<Pane.Col start end>

			<PileNode2_2 tenta={tenta}>

				<>
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<Txt.H6>{gsm.Unit.$Many}</Txt.H6>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</>

			</PileNode2_2>

		</Pane.Col>

	,

]);






//===






var RootUnitTenta: PileNode2_2.TF<[DB, Unit]> = PileNode2_2.createFactory((db: DB, unit: Unit) => [

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




function UnitBody(
	{
		tenta, db, unit, noindent,
		...props
	}: {
		tenta: PileNode1.Tenta;
		db: DB;
		unit: Unit;
		noindent?: true;
	} & Pane.RowProps
)
{

	let [name, ...masterNames] = unit.allNamesBy(db);


	return <Pane.Row {...props}>

		<Pane flex1 start end>


			<Div vcenter pl8>
				<Pile.PhaseIcon noindent={noindent} />
			</Div>


			<Div flex32px font32px vcenter textCenter>
				{gsm.UnitType.$item(unit.type)!.$icon}
			</Div>


			<Div flex1 p12>

				<Div><em>{name?.shortName}</em> {masterNames.map(a => a.shortName2).join(" ")}</Div>

				<ValueFader value={tenta.collapsed} expander>
					{tentaCollapsed => (tentaCollapsed
						? <Div opacity7 fontSm><em>{name?.name}</em> {masterNames.map(a => a.name2).join(" ")}</Div>
						: <Div opacity7 fontSm><em>{name?.fullName}</em><br/><em>{name?.fullName}</em><br/><em>{name?.fullName}</em> {masterNames.map(a => a.fullName2).join(" ")}</Div>
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

	//$log("*** UnitRow");

	let tenta = PileNode2_2.Tenta.useByPhase();


	return (

		<Pane.Col start end>

			<Pane.Row start end={!tenta.opened}>
				{children}
			</Pane.Row>

			<PileNode2_2.TabsRow tenta={tenta} />

		</Pane.Col>

	);

}


var UnitSubunitTenta: PileNode2_2.TF<[DB, Unit_Subordination]> = PileNode2_2.createFactory(

	(db: DB, { id, unit, dateFrom, dateTo }: Unit_Subordination) => [

		id,

		//() => unit.subunits?.map(a => UnitSubunitTenta(db, a)),

		{
			subunits: {
				title: () => <em>{gsm.Unit.hasSubunits.$one} {unit.subunits?.length || 0} {gsm.Unit.$noun(unit.subunits?.length || 0)}</em>,
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
