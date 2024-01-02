import { Entity } from "../../core/domain";
import { type DB } from "../_db";
import type { Unit } from "./Unit";
import type { UnitType } from "./UnitType";






//===






export class Unit_Subordination extends Entity
{

	unit!: Unit;

	dateFrom!: Date;
	dateTo?: Date | null;

	master!: Unit;

	createDate!: Date;

}






//===






export module Unit_Subordination
{

	export function Service(db: DB)
	{

		//---



		const all: Unit_Subordination[] = [];



		//---



		function byDate(
			arr: Unit_Subordination[] | null | undefined,
			date?: Date | null
		)
		{

			if (!date)
			{
				return arr?.at(-1);
			}


			return arr?.findLast(a =>
				(!a.dateFrom || a.dateFrom <= date) &&
				(!a.dateTo || date <= a.dateTo)
			);

		}



		//---



		return {


			//---


			all,


			//---



			byDate(
				arr: Unit_Subordination[] | null | undefined,
				date?: Date | null
			)
			{

				if (!date)
				{
					return arr?.at(-1);
				}


				return arr?.findLast(a =>
					(!a.dateFrom || a.dateFrom <= date) &&
					(!a.dateTo || date <= a.dateTo)
				);

			},


			mastersBy: function mastersBy<TResult = Unit_Subordination>(
				masters: Unit_Subordination[] | null | undefined,
				filter?: UnitMasterFilter,
				selector?: (master: Unit_Subordination, index: number, all: Unit_Subordination[]) => TResult
			): TResult[]
			{

				let result: Unit_Subordination[] = [];


				let date = filter?.date;
				let maxUnitType = filter?.maxUnitType;


				let master: Unit_Subordination | undefined = undefined;
				let iterationCount = 0;


				while (masters?.length)
				{

					master = byDate(masters, date);

					if (!master)
						break;


					if (maxUnitType && master.master.type > maxUnitType)
						break;


					result.push(master);


					masters = master.master.masters;


					if (++iterationCount > 16)
						break;

				}


				return selector ? result.map(selector) : result as TResult[];

			},



			//---



			add(
				unit: Unit,
				master: Unit,

				fields?: Pick<
					Unit_Subordination,
					"dateFrom" | "dateTo"
				>

			): Unit_Subordination
			{

				let r = db.addTo(all, Unit_Subordination, {

					unit,
					master,

					dateFrom: db.today,

					...fields,

					createDate: db.today,

				});


				(master.subunits ??= []).push(r);
				(unit.masters ??= []).push(r);


				if (unit.master && !unit.master.dateTo)
				{
					unit.master.dateTo = db.yesterday();
				}

				unit.master = r;


				return r;

			}



			//---

		};


	}

}






//===






export interface UnitMasterFilter
{
	date: Date;
	maxUnitType: UnitType;
}