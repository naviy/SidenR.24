import type { DB } from "..";
import type { Soldier } from "./Soldier";
import { Entity } from "../../core/domain";






//===






export class Soldier_CallSign extends Entity
{

	//---



	soldier?: Soldier;

	name?: string;

	startDate?: Date;
	endDate?: Date;

	createDate?: Date;



	//---



	static Service(db: DB)
	{

		const all: Soldier_CallSign[] = [];

		return {

			all,

			add(soldier: Soldier, callSignFields: Entity.Fields<Soldier>)
			{

				let callSign = db.addTo(all, Soldier_CallSign, callSignFields);


				callSign.soldier = soldier;

				soldier.callSigns ??= [];
				soldier.callSigns.push(callSign)


				soldier.callSign = callSign.name;


				return callSign;

			},

		};

	}



	//---

}