import { Div, Pane, Route, Txt } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import * as colors from '@mui/material/colors';
import { useData } from "./db";
import type { Db, Entity, EntityProperty, ValueType } from "./domain";
import { Pile } from "./piles";
import { PileGroupNode1 } from './piles/nodes1/PileGroupNode1';
import { PileGroupNode2 } from './piles/nodes1/PileGroupNode2';
import { PileRowNode2_2 } from "./piles/nodes1/PileRowNode2_2";
import { useState } from 'react';
import { Tenta } from './tentas';






//===






export module Page061
{


	export var route = Route.create({
		key: "page061",
		icon: <PageIcon />,
		title: "Page 061",
		content: () => <Content />,
	});



	export function Content()
	{

		let { db } = useData();


		//let entitiesTenta = EntitiesPileTenta.use(db, db.Entity.all);

		//let valueTypesTenta = ValueTypesPileTenta.use(db, db.ValueType.all);


		let col = Tenta.Collector.use("root", () => [
			EntitiesPileTenta(db, db.Entity.all),
			ValueTypesPileTenta(db, db.ValueType.all),
		]);


		return <>

			<Div mx200 m100>
				<Tenta.Collector.List bhv={col} />
				{/*{entitiesTenta.render()}*/}
				{/*{valueTypesTenta.render()}*/}
			</Div>

		</>;

	}


}






//===






var EntitiesPileTenta = PileGroupNode1.createFactory((db: Db, entities: Entity[]) => [

	"EntitiesPile",

	{
		cols: () => entities.map(entity => EntityTenta(db, entity)),

		init: tenta => tenta.init({
			defaultOpenPhase: 1,
		}),

		use: tenta => tenta.use({
			root: true,
			globalState: true,
		})
	},

	tenta =>

		<Pane.Col start end>

			<PileGroupNode1 tenta={tenta} backfill color={colors.lime}>

				<>
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<Txt.H5>Entities</Txt.H5>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</>

			</PileGroupNode1>

		</Pane.Col>

	,

]);






var EntityTenta: PileRowNode2_2.TF<[Db, Entity]> = PileRowNode2_2.createFactory((db: Db, entity: Entity) => [

	`Entity ${entity.id}`,

	{
		cols: () => entity.props?.map(a => EntityPropertyTenta(db, a)),

		init: tenta => tenta.init({

			maxExpandPhase: 1,

			defaultOpenPhase: 1,

			restState: () => ({
				bodyIsSeparated: true,
			}),

		}),
	},

	tenta => (

		<PileRowNode2_2 backfill tenta={tenta}>

			<>

				<Pane flex1 start end>

					<Div vcenter pl8>
						<Pile.PhaseIcon />
					</Div>

					<Div flex1 py12>
						<Div fontLg><em>{entity.title}</em></Div>
					</Div>

				</Pane>

			</>

		</PileRowNode2_2>

	),



]);






var EntityPropertyTenta: PileRowNode2_2.TF<[Db, EntityProperty]> = PileRowNode2_2.createFactory((db: Db, prop: EntityProperty) => [

	prop.id,

	tenta => (

		<PileRowNode2_2 tenta={tenta}>

			<>

				<Pane flex1 start end>

					<Div vcenter pl8>
						<Pile.PhaseIcon />
					</Div>

					<Div py12>
						<em>{prop.title}</em>

						{prop.valueType && <>
							&nbsp;: {prop.valueType.renderTitle()}
						</>}

					</Div>
				</Pane>

			</>

		</PileRowNode2_2>

	)

]);






//===






var ValueTypesPileTenta = PileGroupNode1.createFactory((db: Db, types: ValueType[]) => [

	"ValueTypesPile",

	{
		cols: () => types.map(type => ValueTypeTenta(db, type)),

		init: tenta => tenta.init({
			defaultOpenPhase: 1,
		}),
	},

	tenta =>

		<Pane.Col start end>

			<PileGroupNode1 tenta={tenta} backfill color={colors.deepPurple}>

				<>
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<Txt.H5>ValueTypes</Txt.H5>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</>

			</PileGroupNode1>

		</Pane.Col>

	,

]);






var ValueTypeTenta: PileRowNode2_2.TF<[Db, ValueType]> = PileRowNode2_2.createFactory((db: Db, type: ValueType) => [

	`ValueType ${type.id}`,

	{
		init: tenta => tenta.init({

			maxExpandPhase: 1,

			defaultOpenPhase: 1,

			//restState: () => ({
			//	bodyIsSeparated: true,
			//}),

		}),
	},

	tenta =>
	{

		//$log("Unit Row " + tenta);


		return <PileRowNode2_2 backfill tenta={tenta}>

			<>

				<Pane flex1 start end>

					<Div vcenter pl8>
						<Pile.PhaseIcon />
					</Div>

					<Div flex1 py12>
						{type.renderTitle()}
					</Div>

				</Pane>

			</>

		</PileRowNode2_2>;

	},



]);