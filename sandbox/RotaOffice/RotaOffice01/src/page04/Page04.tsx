import { $log, Div, GlobalState, Pane, Route, Span, Txt } from '@libs';

import FestivalIcon from '@mui/icons-material/Festival';
import Button from "@mui/material/Button";
import Badge from '@mui/material/Badge';

import { useData } from "./db";
import { DB, Unit_Subordination, type Unit } from "./domain";
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

				{units.map(a => <UnitNode key={a.id} db={db} r={a} />)}


			</Tenta.Placeholder.Collector>

		</Pane.Col>

	</>;
}






function UnitNode({ db, r, ...props }: Pile.Node1Props & { db: DB, r: Unit })
{
	return <Pile.Node1 id={r.id} {...props}>

		<>
			<UnitBody db={db} r={r} start />
			<UnitActions db={db} r={r} end />
		</>

		<UnitTail db={db} r={r} />

	</Pile.Node1>;

}




function UnitBody({ db, r, ...props }: { db: DB, r: Unit } & Pane.RowProps)
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


function UnitActions({ db, r, ...props }: { db: DB, r: Unit } & Pane.Props)
{

	return <>

		<Pane flex0 {...props}>
			<Button onClick={() => $log(`unit #${r.id}:`, r)}>$LOG</Button>
		</Pane>

	</>;

}


function UnitTail({ db, r }: { db: DB, r: Unit })
{

	let hasMasters = !!r.masters?.length;
	let hasSubunits = !!r.subunits?.length

	if (!hasMasters && !hasSubunits)
		return null;


	return <>

		{hasMasters && <UnitMastersNode db={db} list={r.masters!} noLast={hasSubunits} />}
		{hasSubunits && <UnitSubunitsNode db={db} list={r.subunits!} />}

	</>

}





function UnitMastersNode({
	db, list, noLast
}: {
	db: DB;
	list: Unit_Subordination[];
	noLast: boolean;
})
{

	return (

		<Pile.Col expanded="opened" indent="opened" start end wrapperCls="pb0">

			<Pile.Node1 start end linkLine="opened" linkToNext={noLast}>

				<Pane p12 start end>					
					<Span em upperCase opacity7>{gsm.Unit.hasMasters.$One}</Span>&nbsp;у&nbsp;<em>{list.length}</em><Span>&nbsp;{gsm.Unit.$noun6(list.length)}</Span>
				</Pane>

				<Pile.Col expanded="opened" indent="opened" start end>
					<Div flexi relative>
						<Pile.ListBackfill />
						<Nodes />
					</Div>
				</Pile.Col>

			</Pile.Node1>

		</Pile.Col>

	);


	function Nodes()
	{
		return <Tenta.Placeholder.Collector
			globalState="unit-masters"
			placeholders={list.map(a => a.id)}
			children={list.map(a => <UnitMasterNode key={a.id} db={db} r={a} />)}
		/>
	}

}



function UnitMasterNode({ db, r, ...props }: { db: DB, r: Unit_Subordination } & Pile.Node1Props)
{

	return <Pile.Node1 id={r.id} {...props} linkLine="opened">

		<>

			<UnitBody db={db} r={r.master} start />

			<Pane flex0 p12>
				<div>
					<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
					<div><Txt.Date>{r.dateTo}</Txt.Date></div>
				</div>
			</Pane>

			<UnitActions db={db} r={r.master} end />

		</>


		<UnitTail db={db} r={r.master} />


	</Pile.Node1>;

}




function UnitSubunitsNode({ db, list }: { db: DB; list: Unit_Subordination[] })
{

	return (

		<Pile.Col expanded="opened" indent="opened" start end>

			<Pile.Node1 start end linkLine="opened">

				<Pane p12 start end>
					<Span em>{gsm.Unit.hasSubunits.$Many} {list.length} {gsm.Unit.$noun(list.length)}</Span>
				</Pane>

				<Pile.Col expanded="opened" indent="opened" start end wrapperCls="pb0">
					<Div flexi relative>
						<Pile.ListBackfill />
						<Nodes />
					</Div>
				</Pile.Col>

			</Pile.Node1>

		</Pile.Col>

	);


	function Nodes()
	{
		return <Tenta.Placeholder.Collector
			globalState="unit-subordinations"
			placeholders={list.map(a => a.id)}
			children={list.map(a => <UnitSubunitNode key={a.id} db={db} r={a} />)}
		/>
	}

}



function UnitSubunitNode({ db, r, ...props }: { db: DB, r: Unit_Subordination } & Pile.Node1Props)
{

	return <Pile.Node1 id={r.id} {...props} linkLine="opened">

		<>

			<UnitBody db={db} r={r.unit} start />

			<Pane flex0 p12>
				<div>
					<div><Txt.Date>{r.dateFrom}</Txt.Date></div>
					<div><Txt.Date>{r.dateTo}</Txt.Date></div>
				</div>
			</Pane>

			<UnitActions db={db} r={r.unit} end />

		</>


		<UnitTail db={db} r={r.unit} />


	</Pile.Node1>;

}