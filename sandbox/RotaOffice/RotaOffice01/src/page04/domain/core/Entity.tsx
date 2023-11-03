import type { DbContext } from "./DbContext";






//===






export class Entity<TDbContext extends DbContext = DbContext>
{

	//---



	constructor(id?: Entity.Id)
	{
		this.id = id ?? Entity.newId();
	}



	//---



	db!: TDbContext;
	readonly id: Entity.Id;



	//---

}






export module Entity
{


	//---



	export type Id = `${string}-${string}-${string}-${string}-${string}`;



	const crypto = new Crypto();


	export function newId(): Id
	{
		return crypto.randomUUID();
	}



	//---



	export type Fields<T extends Entity> = Partial<T>;



	//---


}