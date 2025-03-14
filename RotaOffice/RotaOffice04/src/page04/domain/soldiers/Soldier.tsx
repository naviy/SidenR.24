import { Soldier_CallSign } from "./Soldier_CallSign";
import { type DB } from "../_db";
import { Entity } from "../../core/domain";






//===






export class Soldier extends Entity
{

	//---



	surname?: string;
	name?: string;
	patronymic?: string;

	birthday?: Date;

	militaryID?: string;

	phone?: string;


	battalion?: string;
	//company?: string;
	//platoon?: string | number;
	//squad?: number;

	callSign?: string;
	callSigns?: Soldier_CallSign[];



	//---



	static Service(db: DB)
	{

		const all: Soldier[] = [];

		return {


			all,

			add: (fields: Entity.Fields<Soldier>) =>
				db.addTo(all, Soldier, fields)
			,


		};

	}



	//---

}