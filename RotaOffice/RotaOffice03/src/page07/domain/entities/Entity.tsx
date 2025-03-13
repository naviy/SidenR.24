import { type Db } from "../db";
import { DbEntity } from "../dbEntity";
import type { ValueType } from "../valueTypes";
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
		valueType?: ValueType,
		fields?: EntityProperty.RestFields | null,
		init?: (prop: EntityProperty) => void
	)
	{
		return DbEntity.addTo(
			new EntityProperty(this, title, valueType),
			this.props,
			fields, init
		);
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
				fields?: RestFields | null,
				init?: (entity: Entity) => void
			): Entity
			{
				return DbEntity.addTo(new Entity(title), all, fields, init);
			},


		};


	}

}



