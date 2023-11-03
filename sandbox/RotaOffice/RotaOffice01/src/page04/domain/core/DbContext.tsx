import type { Entity } from ".";
import type { Constructor } from "../../../@libs";






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

		fields && Object.assign(this, fields);

		entity.db = this;


		all.push(entity);


		return entity;

	}



	//---

}
