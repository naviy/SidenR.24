import { Entity } from "../../core/domain";
import { UnitType } from "./UnitType";
import type { UnitMasterFilter, Unit_Subordination } from "./Unit_Subordination";
import { type DB } from "../_db";
import type { UnitNameFilter, Unit_Name } from "./Unit_Name";






//===






export class Unit extends Entity
{

	//---



	type!: UnitType;


	name?: Unit_Name;
	names?: Unit_Name[];


	master?: Unit_Subordination;
	masters?: Unit_Subordination[];
	subunits?: Unit_Subordination[];


	formationDate?: Date;
	disbandingDate?: Date;



	//---



	allMastersBy<TResult = Unit>(
		db: DB,
		filter?: UnitMasterFilter,
		selector?: (master: Unit_Subordination) => TResult
	): TResult[]
	{
		return db.Unit_Subordination.mastersBy(this.masters, filter, selector);
	}


	allNamesBy<TResult = Unit_Name>(
		db: DB,
		filter?: UnitNameFilter,
		selector?: (name: Unit_Name, index: number) => TResult
	): TResult[]
	{
		return db.Unit_Name.namesBy(this.names, filter, selector);
	}


	shortNamesBy(db: DB, filter?: UnitNameFilter): string[]
	{
		return this.allNamesBy(db, filter, (a, i) => !i ? a.shortName : a.shortName2);
	}

	namesBy(db: DB, filter?: UnitNameFilter): string[]
	{
		return this.allNamesBy(db, filter, (a, i) => !i ? a.name : a.name2);
	}

	fullNamesBy(db: DB, filter?: UnitNameFilter): string[]
	{
		return this.allNamesBy(db, filter, (a, i) => !i ? a.fullName : a.fullName2);
	}



	//---

}






//===






export module Unit
{

	export function Service(db: DB)
	{


		const all: Unit[] = [];


		return {


			all,


			roots: () => all.filter(a => !a.master),



			add(

				master: Unit | null,

				type: UnitType,

				names: [string, string, string],
				names2: [string, string, string],


				fields?: Pick<Unit, "formationDate" | "disbandingDate">

			): Unit
			{

				let unit = db.addTo(all, Unit, {

					type,

					...fields

				});


				db.Unit_Name.add(unit, names, names2);

				master && db.Unit_Subordination.add(unit, master);


				return unit;

			},







		};


	}

}



