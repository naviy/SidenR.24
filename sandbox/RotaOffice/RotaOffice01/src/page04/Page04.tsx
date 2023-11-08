import { $log, Div, GlobalState, Pane, Route, Txt, VR } from '@libs';

import FestivalIcon from '@mui/icons-material/Festival';
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { useData } from "./db";
import { Unit_Subordination, type Unit } from "./domain";
import { Pile } from "./piles";
import { gsm } from "./semantics";
import { Tenta } from './tentas';






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

				<UnitsPile />

			</GlobalState>

		</Div>

	</>;

}




export module Page04
{
	export const route = pageRoute;
}






//===





function UnitsPile()
{

	let { db } = useData();


	//let units = db.Unit.all.filter(a => a.type === UnitType.Squad);
	let units = db.Unit.roots();


	return <>

		<Pane.Col rounded>

			<Pile.ListBackfill />

			<Tenta.Placeholder.Collector
				globalState="units"
				root
				placeholders={units.map(a => a.id)}
			>

				{units.map(a => <UnitRow key={a.id} r={a} />)}


			</Tenta.Placeholder.Collector>

		</Pane.Col>

	</>;
}






function UnitRow({ r, ...props }: Pile.Row1Props & { r: Unit })
{

	let { db } = useData();


	//$log("masters:",  r.masters)





	return <Pile.Row1 id={r.id} {...props}>


		<>
			<Pane>

				<ListItem>
					<ListItemIcon><Div flex1 font48px textCenter pr8>{gsm.UnitType.$item(r.type)!.$icon}</Div></ListItemIcon>
					<ListItemText
						primary={<Txt.Button>{r.shortNamesBy(db).join(" ")}</Txt.Button>}
						secondary={r.namesBy(db).join(" ")}
					/>
				</ListItem>
			</Pane>

			<Pane>
				<Button onClick={() => $log(`unit #${r.id}:`, r)}>$LOG</Button>
			</Pane>

		</>

		{(r.masters?.length || r.subordinates?.length) && <>

			{r.masters?.length && <UnitMastersPile list={r.masters} />}

			{r.subordinates?.length && <UnitSubordinationsPile list={r.subordinates} />}

		</>}


	</Pile.Row1>;

}






function UnitMastersPile({ list }: { list: Unit_Subordination[] })
{

	return (

		<Pane.Col rounded>

			<Pile.ListBackfill />

			<Tenta.Placeholder.Collector
				globalState="unit-masters"
				placeholders={list.map(a => a.id)}
			>

				{list.map(a => <UnitMasterRow key={a.id} r={a} />)}

			</Tenta.Placeholder.Collector>

		</Pane.Col>

	);

}



function UnitMasterRow({ r }: { r: Unit_Subordination })
{

	return <Pile.Row1 id={r.id}>


		<>
			{/*<Pane p12>*/}
			{/*	<div>*/}
			{/*		<div>{r.shortName}</div>*/}
			{/*		<div>{r.name}</div>*/}
			{/*		<div>{r.fullName}</div>*/}
			{/*	</div>*/}
			{/*</Pane>*/}

			<Pane flex2 p12>
				<div>
					<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
					<div><Txt.Date>{r.dateTo}</Txt.Date></div>
				</div>
			</Pane>

		</>


		<>

			<Pane.Col rounded>

				<Pile.ListBackfill />

				<Tenta.Placeholder.Collector
					globalState="unit"
					placeholders={[r.unit.id]}
				>

					<UnitRow r={r.unit} />

				</Tenta.Placeholder.Collector>

			</Pane.Col>

		</>


	</Pile.Row1>;

}




function UnitSubordinationsPile({ list }: { list: Unit_Subordination[] })
{

	return (

		<Pane.Col rounded>

			<Pile.ListBackfill />

			<Tenta.Placeholder.Collector
				globalState="unit-subordinations"
				placeholders={list.map(a => a.id)}
			>

				{list.map(a => <UnitSubordinationRow key={a.id} r={a} />)}

			</Tenta.Placeholder.Collector>

		</Pane.Col>

	);

}



function UnitSubordinationRow({ r }: { r: Unit_Subordination })
{

	let { db } = useData();


	return <Pile.Row1 id={r.id}>


		<>
			{/*<Pane p12>*/}
			{/*	<div>*/}
			{/*		<div>{r.shortName}</div>*/}
			{/*		<div>{r.name}</div>*/}
			{/*		<div>{r.fullName}</div>*/}
			{/*	</div>*/}
			{/*</Pane>*/}

			<Pane flex2 p12>
				<div>
					<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
					<div><Txt.Date>{r.dateTo}</Txt.Date></div>

				</div>

			</Pane>

		</>


		<>

			<Pane.Col rounded>

				<Pile.ListBackfill />

				<Tenta.Placeholder.Collector
					globalState="unit"
					placeholders={[r.unit.id]}
				>

					<UnitRow r={r.unit} />

				</Tenta.Placeholder.Collector>

			</Pane.Col>

		</>


	</Pile.Row1>;

}