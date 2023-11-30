import type { Constructor } from "@libs";
import type { Entity } from "./Entity";






//===






export class DbContext
{

	//---



	addTo<TEntityBase extends Entity, TEntity extends TEntityBase>(
		all: TEntityBase[],
		entityType: Constructor<TEntity>,
		fields?: Entity.Fields<TEntity>
	)
	{

		let entity = new entityType();

		fields && Object.assign(entity, fields);

		//entity.db = this;


		all.push(entity);


		return entity;

	}



	//---

}
