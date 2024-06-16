import { Db } from "./_db";






//===






export class DbEntity
{

	constructor()
	{
		this.id = Db.newId();
	}


	readonly id: Db.Id;

}
