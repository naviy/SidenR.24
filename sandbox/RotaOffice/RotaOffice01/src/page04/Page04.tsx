import { $log, Div, GlobalState, Pane, Route, Span, Txt, VR } from '@libs';

import FestivalIcon from '@mui/icons-material/Festival';
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useData } from "./db";
import { Unit_Subordination, type Unit, DB } from "./domain";
import { Pile } from "./piles";
import { gsm } from "./semantics";
import { Tenta } from './tentas';
import { db } from "./data/_db";






//===






const pageRoute = Route.create({
	key: "page04",
	icon: <FestivalIcon />,
	title: "Page 04",
	content: () => <Page04 />,
});






export function Page04()
{

	return <>

		<Div mx200 m100>

			<GlobalState name="Rows05Pile">

				<UnitsPile start end />

			</GlobalState>

		</Div>

	</>;

}




export module Page04
{
	export const route = pageRoute;
}






//===





function UnitsPile(props: Pane.ColProps)
{

	let { db } = useData();


	//let units = db.Unit.all.filter(a => a.type === UnitType.Squad);
	let units = db.Unit.roots();


	return <>

		<Pane.Col rounded {...props}>

			<Pile.ListBackfill />

			<Tenta.Placeholder.Collector
				globalState="units"
				root
				placeholders={units.map(a => a.id)}
			>

				{units.map((a, i, arr) => <UnitRow key={a.id} db={db} r={a} start={i === 0} end={i === arr.length - 1} />)}


			</Tenta.Placeholder.Collector>

		</Pane.Col>

	</>;
}






function UnitRow({ db, r, ...props }: Pile.Row1Props & { db: DB, r: Unit })
{

	return <Pile.Row1 id={r.id} {...props}>

		<>
			<UnitRowBody db={db} r={r} start />
			<UnitRowActions db={db} r={r} end />
		</>

		<UnitRowContent db={db} r={r} />

	</Pile.Row1>;

}




function UnitRowBody({ db, r, ...props }: { db: DB, r: Unit } & Pane.RowProps)
{

	let [name, ...masterNames] = r.allNamesBy(db);


	return <Pane.Row {...props}>

		<Pane flex1 start end>

			<Div flex64px font54px textCenter pl8>{gsm.UnitType.$item(r.type)!.$icon}</Div>
			<Div flex1 p12>
				<Div fontLg><em>{name?.shortName}</em> {masterNames.map(a => a.shortName2).join(" ")}</Div>
				<Div opacity7><em>{name?.fullName}</em> {masterNames.map(a => a.fullName2).join(" ")}</Div>
			</Div>
		</Pane>

	</Pane.Row>

}


function UnitRowActions({ db, r, ...props }: { db: DB, r: Unit } & Pane.Props)
{

	return <>

		<Pane flex0 {...props}>
			<Button onClick={() => $log(`unit #${r.id}:`, r)}>$LOG</Button>
		</Pane>

	</>;

}


function UnitRowContent({ db, r }: { db: DB, r: Unit })
{

	let hasMasters = r.masters?.length;
	let hasSubunits = r.subunits?.length

	if (!hasMasters && !hasSubunits)
		return null;


	return <>

		{hasMasters && <UnitMastersPile db={db} list={r.masters!} />}
		{hasMasters && hasSubunits && <Div p12 />}
		{hasSubunits && <UnitSubunitsPile db={db} list={r.subunits!} />}

	</>

}





function UnitMastersPile({ db, list }: { db: DB, list: Unit_Subordination[] })
{

	return (

		<Pane.Col rounded>

			<Pile.ListBackfill />

			<Tenta.Placeholder.Collector
				globalState="unit-masters"
				placeholders={["$H", ...list.map(a => a.id)]}
			>

				<Pane p12 start m2 mb0>
					<Span em>MASTERS</Span>
				</Pane>

				{list.map((a, i, arr) => <UnitMasterRow key={a.id} db={db} r={a} start={false} end={i === arr.length - 1} />)}

			</Tenta.Placeholder.Collector>

		</Pane.Col>

	);

}



function UnitMasterRow({ db, r, ...props }: { db: DB, r: Unit_Subordination } & Pile.Row1Props)
{

	return <Pile.Row1 id={r.id} {...props}>

		<>

			<UnitRowBody db={db} r={r.master} start />

			<Pane flex0 p12>
				<div>
					<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
					<div><Txt.Date>{r.dateTo}</Txt.Date></div>
				</div>
			</Pane>

			<UnitRowActions db={db} r={r.master} end />

		</>


		<UnitRowContent db={db} r={r.master} />


	</Pile.Row1>;

}




function UnitSubunitsPile({ db, list }: { db: DB; list: Unit_Subordination[] })
{

	return (

		<Pane.Col rounded>

			<Pile.ListBackfill />


			<Tenta.Placeholder.Collector
				globalState="unit-subordinations"
				placeholders={["$H", ...list.map(a => a.id)]}
			>

				<Pane p12 start m2 mb0>
					<Span em>SUBUNITS</Span>
				</Pane>


				{list.map((a, i, arr) => <UnitSubunitRow key={a.id} db={db} r={a} start={false} end={i === arr.length - 1} />)}

			</Tenta.Placeholder.Collector>

		</Pane.Col>

	);

}



function UnitSubunitRow({ db, r, ...props }: { db: DB, r: Unit_Subordination } & Pile.Row1Props)
{

	return <Pile.Row1 id={r.id} {...props}>

		<>

			<UnitRowBody db={db} r={r.unit} start />

			<Pane flex0 p12>
				<div>
					<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
					<div><Txt.Date>{r.dateTo}</Txt.Date></div>
				</div>
			</Pane>

			<UnitRowActions db={db} r={r.unit} end />

		</>


		<UnitRowContent db={db} r={r.unit} />


	</Pile.Row1>;

}