import { Div, Pane, Route, Txt } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import { useState } from "react";
import { useData } from "./db";
import { Db, Entity, EntityProperty } from "./domain";
import { Pile } from "./piles";
import { PileRowNode2_2 } from "./piles/nodes1/PileRowNode2_2";
import { PileGroupNode1 } from './piles/nodes1/PileGroupNode1';
import * as colors from '@mui/material/colors';






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

		let entities = db.Entity.all;


		let [tenta] = useState(() => EntitiesPileTenta(db, entities));


		tenta.use({

			root: true,

			defaultOpenPhase: 1,

			hideChildrenLinks: true,

		});


		tenta.useGlobalState();



		return <>

			<Div mx200 m100>
				{tenta.render()}
			</Div>

		</>;

	}


}






var EntitiesPileTenta = PileGroupNode1.createFactory((db: Db, entities: Entity[]) => [

	"EntitiesPile",

	() => entities.map(entity => EntityTenta(db, entity)),

	(tenta: PileGroupNode1.Tenta) =>

		<Pane.Col start end>

			<PileGroupNode1 tenta={tenta} backfill color={colors.lime}>

				<>
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<Txt.H3>Entities</Txt.H3>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</>

			</PileGroupNode1>

		</Pane.Col>

	,

]);






//===






var EntityTenta: PileRowNode2_2.TF<[Db, Entity]> = PileRowNode2_2.createFactory((db: Db, entity: Entity) => [

	entity.id,

	() => entity.props?.map(a => EntityPropertyTenta(db, a)),


	(tenta: PileRowNode2_2.Tenta) =>
	{

		//$log("Unit Row " + tenta);


		return <PileRowNode2_2 backfill tenta={tenta}>

			<>

				<Pane flex1 start end>

					<Div vcenter pl8>
						<Pile.PhaseIcon />
					</Div>

					<Div flex1 p12>
						<Div fontLg><em>{entity.title}</em></Div>
					</Div>

				</Pane>

			</>

		</PileRowNode2_2>;

	},



]);




var EntityPropertyTenta: PileRowNode2_2.TF<[Db, EntityProperty]> = PileRowNode2_2.createFactory(

	(db: Db, prop: EntityProperty) => [

		prop.id,

		(tenta: PileRowNode2_2.Tenta) => (

			<PileRowNode2_2 tenta={tenta}>

				<>

					<Pane flex1 start end>

						<Div vcenter pl8>
							<Pile.PhaseIcon />
						</Div>

						<Div flex1 p12>
							<Div fontLg><em>{prop.title}</em></Div>
						</Div>

					</Pane>

				</>

			</PileRowNode2_2>

		)

	]

);
