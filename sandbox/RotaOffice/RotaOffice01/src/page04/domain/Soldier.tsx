import { SoldierCallSign } from "./Soldier_CallSign";
import { type DB } from "./_db";
import { Entity } from "./core";






//===






export class Soldier extends Entity
{

	//---



	firstName?: string;
	middleName?: string;
	lastName?: string;

	birthday?: Date;


	battalion?: string;
	company?: string;
	platoon?: string | number;
	squad?: number;

	callSign?: string;
	callSigns?: SoldierCallSign[];



	//---



	static Service(db: DB)
	{

		const all: Soldier[] = [];

		return {


			CallSign: SoldierCallSign.Service(db),


			all,

			add: (fields: Entity.Fields<Soldier>) =>
				db.addTo(all, Soldier, fields)
			,


		};

	}



	//---

}