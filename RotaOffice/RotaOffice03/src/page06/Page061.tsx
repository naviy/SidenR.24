import { Div, Pane, Route, Txt } from '@libs';
import PageIcon from '@mui/icons-material/Analytics';
import { useState } from "react";
import { useData } from "./db";
import { Db, Entity, EntityProperty } from "./domain";
import { Pile } from "./piles";
import { PileNode2_2 } from "./piles/nodes1/PileNode2_2";
import { GroupAreaNode1 } from './piles/groupAreas/GroupAreaNode1';






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

			defaultExpandPhase: 2,
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






var EntitiesPileTenta = GroupAreaNode1.createFactory((db: Db, entities: Entity[]) => [

	"EntitiesPile",

	() => entities.map(entity => EntityTenta(db, entity)),

	(tenta: GroupAreaNode1.Tenta) =>

		<Pane.Col start end>

			<GroupAreaNode1 tenta={tenta} backfill>

				<>
					<Pane start p12 vcenter>
						<Pile.PhaseIcon />
						<Txt.H3>Entities</Txt.H3>
					</Pane>
					<Pane end p12 textRight vcenter>111 1111 11111 111111</Pane>
				</>

			</GroupAreaNode1>

		</Pane.Col>

	,

]);






//===






var EntityTenta: PileNode2_2.TF<[Db, Entity]> = PileNode2_2.createFactory((db: Db, entity: Entity) => [

	entity.id,

	() => entity.props?.map(a => EntityPropertyTenta(db, a)),


	(tenta: PileNode2_2.Tenta) =>
	{

		//$log("Unit Row " + tenta);


		return <PileNode2_2 backfill tenta={tenta}>

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

		</PileNode2_2>;

	},



]);




var EntityPropertyTenta: PileNode2_2.TF<[Db, EntityProperty]> = PileNode2_2.createFactory(

	(db: Db, prop: EntityProperty) => [

		prop.id,

		(tenta: PileNode2_2.Tenta) => (

			<PileNode2_2 tenta={tenta}>

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

			</PileNode2_2>

		)

	]

);
