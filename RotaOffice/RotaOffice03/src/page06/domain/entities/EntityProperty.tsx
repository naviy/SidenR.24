import { type Db } from "../db";
import { DbEntity } from "../dbEntity";
import type { ValueType } from "../valueTypes";
import type { Entity } from "./Entity";






//===






export class EntityProperty extends DbEntity
{

	constructor(
		public entity: Entity,
		public title: string,
		public valueType?: ValueType,
	)
	{
		super();
	}


}




export module EntityProperty
{

	
	export type RestFields = Partial<Omit<EntityProperty, "id" | "entity" | "title">>;


}
