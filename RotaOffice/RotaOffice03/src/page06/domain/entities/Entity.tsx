import type { Db } from "../_db";
import { DbEntity } from "../_dbEntity";
import { EntityProperty } from "./EntityProperty";






//===






export class Entity extends DbEntity
{

	//---



	constructor(
		public title: string
	)
	{
		super();
	}



	//---



	props: EntityProperty[] = [];


	addProp(
		title: string,
		fields?: EntityProperty.RestFields | null,
		init?: (prop: EntityProperty) => void
	)
	{
		let prop = new EntityProperty(this, title);

		fields && Object.assign(prop, fields);

		init?.(prop);


		this.props.push(prop);


		return prop;

	}


	//---

}






//===






export module Entity
{


	export type RestFields = Partial<Omit<Entity, "id" | "title">>;


	export function Service(db: Db)
	{


		const all: Entity[] = [];


		return {


			all,


			add(
				title: string,
				fields?: Partial<Entity> | null,
				init?: (entity: Entity) => void
			): Entity
			{

				let entity = new Entity(title);

				fields && Object.assign(this, fields);

				init?.(entity);


				all.push(entity);


				return entity;

			},


		};


	}

}



