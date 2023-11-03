import type { DB } from ".";
import type { Soldier } from "./Soldier";
import { Entity } from "./core";






//===






export class SoldierCallSign extends Entity
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

		const all: SoldierCallSign[] = [];

		return {

			all,

			add(soldier: Soldier, callSignFields: Entity.Fields<Soldier>)
			{

				let callSign = db.addTo(all, SoldierCallSign, callSignFields);


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