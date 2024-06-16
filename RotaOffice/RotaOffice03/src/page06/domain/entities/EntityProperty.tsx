import { DbEntity } from "../_dbEntity";
import type { Entity } from "./Entity";






//===






export class EntityProperty extends DbEntity
{

	constructor(
		public entity: Entity,
		public title: string
	)
	{
		super();
	}


}




export module EntityProperty
{

	
	export type RestFields = Partial<Omit<EntityProperty, "id" | "entity" | "title">>;


}
