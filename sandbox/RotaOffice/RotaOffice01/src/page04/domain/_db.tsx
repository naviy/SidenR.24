import moment, { type MomentInput } from "moment";

import { DbContext } from "../core/domain";


import { Soldier, Soldier_CallSign } from "./soldiers";

import { Unit, Unit_Name, /*Unit_Status*/ } from "./units";
import { Unit_Subordination } from "./units";







//===






export class DB extends DbContext
{

	//---



	Soldier = Soldier.Service(this);
	Soldier_CallSign = Soldier_CallSign.Service(this);

	Unit = Unit.Service(this);
	Unit_Name = Unit_Name.Service(this);
	//Unit_Status = Unit_Status.Service(this);

	Unit_Subordination = Unit_Subordination.Service(this);



	//---



	#today = moment("2022-02-22");

	get today(): Date { return this.#today.toDate(); };
	set today(value: MomentInput) { this.#today = moment(value); };


	yesterday(date?: Date | null): Date
	{
		return (this.#today || moment(date)).add(-1, "days").toDate();
	}



	//---

}





