import { $log, Div, FillFade, Pane, Route, Span, Txt } from '@libs';

import FestivalIcon from '@mui/icons-material/Festival';
import Button from "@mui/material/Button";

import { useData } from "./db";
import { DB, Unit_Subordination, type Unit } from "./domain";
import { Pile } from "./piles";
import { gsm } from "./semantics";
import { Tenta } from './tentas';
import { Tabs, Tab } from "@mui/material";






//===






export module Page041
{

	export var route = Route.create({
		key: "page041",
		icon: <FestivalIcon />,
		title: "Page 04.1",
		content: () => <Content />,
	});


	export function Content()
	{
		return <>
			<Div mx200 m100>
				<UnitsPile start end />
			</Div>
		</>;
	}

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

		<UnitSubordinations db={db} r={r} />

	</Pile.Node1>;

}




function UnitBody({ db, r, ...props }: { db: DB, r: Unit } & Pane.RowProps)
{

	let [name, ...masterNames] = r.allNamesBy(db);


	return <Pane.Row {...props}>

		<Pane flex1 start end>

			<Pile.PhaseIcon />

			<Div flex64px font54px vcenter textCenter pl8>{gsm.UnitType.$item(r.type)!.$icon}</Div>
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


function UnitSubordinations({ db, r }: { db: DB, r: Unit })
{

	let { masters, subunits } = r;

	let hasMasters = !!masters?.length;
	let hasSubunits = !!subunits?.length

	if (!hasMasters && !hasSubunits)
		return null;



	return (

		<Pile.Col expanded="opened" indent="opened" start end wrapperCls="pb0">

			<Pile.Node1 start end linkLine="opened" maxPhase={hasMasters && hasSubunits ? 2 : 1}>

				<Pane start end>
									
					<UnitTabs />

				</Pane>

				<UnitPanels />

			</Pile.Node1>

		</Pile.Col>

	);



	function UnitTabs()
	{

		let phase = Tenta.Phase.use();


		return (
			<Tabs value={phase} variant="scrollable" scrollButtons="auto">

				<Tab value={0} label={<Pile.PhaseIcon />} />

				{hasSubunits && <Tab
					value={1}
					label={<Span em>{gsm.Unit.hasSubunits.$Many} {subunits!.length} {gsm.Unit.$noun(subunits!.length)}</Span>}
				/>}

				{hasMasters && <Tab
					value={2}
					label={<Span nowrap><Span em upperCase opacity7>{gsm.Unit.hasMasters.$One}</Span>&nbsp;у&nbsp;<em>{masters!.length}</em><Span>&nbsp;{gsm.Unit.$noun6(masters!.length)}</Span></Span>}
				/>}

			</Tabs>
		);

	}


	function UnitPanels()
	{

		let phase = Tenta.Phase.use();

		return <>

			<Pile.Col collapsed={phase === 0} indent start end>
				<Div flexi relative>

					<Pile.ListBackfill />

					{hasSubunits && <FillFade key={1} in={phase === 1}>
						<Tenta.Placeholder.Collector
							globalState="subunits"
							placeholders={subunits!.map(a => a.id)}
							children={subunits!.map(a => <UnitSubunitNode key={a.id} db={db} r={a} />)}
						/>
					</FillFade>}

					{hasMasters && <FillFade key={2} in={phase === 2}>
						<Tenta.Placeholder.Collector
							globalState="masters"
							placeholders={masters!.map(a => a.id)}
							children={masters!.map(a => <UnitMasterNode key={a.id} db={db} r={a} />)}
						/>
					</FillFade>}

				</Div>
			</Pile.Col>

		</>;

	}


}





function UnitMasterNode({ db, r, ...props }: { db: DB, r: Unit_Subordination } & Pile.Node1Props)
{

	return <Pile.Node1 id={r.id} {...props}>

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


		<UnitSubordinations db={db} r={r.master} />


	</Pile.Node1>;

}




function UnitSubunitNode({ db, r, ...props }: { db: DB, r: Unit_Subordination } & Pile.Node1Props)
{

	return <Pile.Node1 id={r.id} {...props}>

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


		<UnitSubordinations db={db} r={r.unit} />


	</Pile.Node1>;

}