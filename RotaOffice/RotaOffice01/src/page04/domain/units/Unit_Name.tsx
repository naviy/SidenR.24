import type { Unit } from "./Unit";
import { type DB } from "../_db";
import { Entity } from "../../core/domain";
import type { Unit_Subordination } from "./Unit_Subordination";






//===






export class Unit_Name extends Entity
{

	unit!: Unit;

	dateFrom!: Date;
	dateTo?: Date | null;

	shortName!: string;
	shortName2!: string;

	name!: string;
	name2!: string;

	fullName!: string;
	fullName2!: string;

	createDate!: Date;

}






//===






export module Unit_Name
{

	export function Service(db: DB)
	{

		//--



		const all: Unit_Name[] = [];



		//---



		function byDate(
			names: Unit_Name[] | null | undefined,
			date?: Date | null
		): Unit_Name | null
		{

			if (!names)
				return null;

			if (!date)
				return names.at(-1) || null;


			return names.findLast(a =>
				(!a.dateFrom || a.dateFrom <= date) &&
				(!a.dateTo || date <= a.dateTo)
			) || null;

		}



		//---



		return {

			//---


			all,


			//---



			byDate,



			namesBy<TResult = Unit_Name>(
				names: Unit_Name[] | null | undefined,
				filter?: UnitNameFilter,
				selector?: (name: Unit_Name, index: number, all: Unit_Name[]) => TResult
			): TResult[]
			{

				let result: Unit_Name[] = [];


				let date = filter?.date;
				let skip = filter?.skip || 0;


				let iterationCount = 0;


				while (names?.length)
				{

					let name = byDate(names, date);

					if (!name)
						break;


					if (iterationCount >= skip)
						result.push(name);


					let master = db.Unit_Subordination.byDate(name.unit.masters, date);

					if (!master)
						break;


					names = master.master.names;


					if (++iterationCount > 16)
						break;

				}


				return selector ? result.map(selector) : result as TResult[];

			},



			//---



			add(
				unit: Unit,

				names: [string, string, string?],
				names2?: [string, string, string?],

				fields?: Pick<
					Unit_Name,
					"dateFrom" | "dateTo"
				>

			): Unit_Name
			{

				let r = db.addTo(all, Unit_Name, {

					shortName: names[0],
					name: names[1],
					fullName: names[2] || names[1],

					shortName2: names2?.[0] || names[0],
					name2: names2?.[1] || names[1],
					fullName2: names2?.[2] || names2?.[1] || names[2] || names[1],

					dateFrom: db.today,

					...fields,

					createDate: db.today,

				});


				r.unit = unit;
				(unit.names ??= []).push(r);

				if (unit.name && !unit.name.dateTo)
				{
					unit.name.dateTo = db.yesterday();
				}

				unit.name = r;



				return r;

			}



			//---

		};


	}

}






//===






export interface UnitNameFilter
{
	date?: Date;
	skip?: number;
}


