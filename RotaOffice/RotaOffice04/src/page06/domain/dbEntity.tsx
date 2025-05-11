//import { Db } from "./db";






//===






export class DbEntity
{

	constructor()
	{
		this.id = DbEntity.newId();
	}


	readonly id: DbEntity.Id;

}






export module DbEntity
{


	//---



	export type Id = `${string}-${string}-${string}-${string}-${string}`;



	var crypto = window["crypto"] as Crypto;


	export function newId(): Id
	{
		return crypto.randomUUID();
	}



	//---



	export function addTo<TEntity extends DbEntity>(
		entity: TEntity,
		list: TEntity[],
		fields?: Partial<TEntity> | null,
		init0?: (entity: TEntity) => void,
		init1?: (entity: TEntity) => void,
	): TEntity
	{

		fields && Object.assign(entity, fields);
		init0?.(entity);
		init1?.(entity);

		list?.push(entity);

		return entity;

	}



	export function addTo2<TEntity extends DbEntity>(
		entity: TEntity,
		list0: TEntity[],
		list1: DbEntity[],
		fields?: Partial<TEntity> | null,
		init0?: (entity: TEntity) => void,
		init1?: (entity: TEntity) => void,
	): TEntity
	{

		fields && Object.assign(entity, fields);
		init0?.(entity);
		init1?.(entity);

		list0?.push(entity);
		list1?.push(entity);

		return entity;

	}



	//---


}