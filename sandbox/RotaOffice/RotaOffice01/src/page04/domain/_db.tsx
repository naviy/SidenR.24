import { Soldier } from "./Soldier";
import { SoldierCallSign } from "./Soldier_CallSign";
import { Unit } from "./Unit";
import { DbContext } from "./core";






//===






export * from "./core/Entity";






//===






export class DB extends DbContext
{

	Soldier = Soldier.Service(this);
	SoldierCallSign = SoldierCallSign.Service(this);

	Unit = Unit.Service(this);

}
