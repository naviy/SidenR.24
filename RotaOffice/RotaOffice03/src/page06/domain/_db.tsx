import { DbContext } from "../core/domain";

import { Entity } from "./entities";







//===






export class Db extends DbContext
{

	//---



	Entity = Entity.Service(this);



	//---

}





export module Db
{

	//---



	export type Id = `${string}-${string}-${string}-${string}-${string}`;



	var crypto = window["crypto"] as Crypto;


	export function newId(): Id
	{
		return crypto.randomUUID();
	}



	//---

}