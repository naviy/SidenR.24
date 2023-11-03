import type { Constructor } from "@libs";
import type { Soldier } from "./Soldier";
import { BattalionName, CompanyName, PlatoonName, RegimentName, SquadName, UnitType } from "./UnitType";
import { type DB } from "./_db";
import { Entity } from "./core";






//===






export abstract class Unit<TName = any> extends Entity
{

	parent?: Unit | null;
	items?: Unit[];


	type!: UnitType;


	shortName!: TName;
	name!: TName;
	fullName!: TName;


	abstract getNameForGetter(): (unitType: UnitType | undefined, name: TName) => string;


	shortNameIn(unitType?: UnitType): string
	{
		return this.getNameForGetter()(unitType, this.shortName)
	}
	nameIn(unitType?: UnitType): string
	{
		return this.getNameForGetter()(unitType, this.name)
	}
	fullNameIn(unitType?: UnitType): string
	{
		return this.getNameForGetter()(unitType, this.fullName)
	}


	dateFrom?: Date;
	dateTo?: Date;


	soldiers?: Soldier[];

}






//===






export class Regiment extends Unit<RegimentName>
{

	override type = UnitType.Regiment;

	override getNameForGetter() { return RegimentName.nameFor; }

}




export class Battalion extends Unit<BattalionName>
{

	override type = UnitType.Battalion;

	override getNameForGetter() { return BattalionName.nameFor; }

}




export class Company extends Unit<CompanyName>
{

	override type = UnitType.Company;

	override getNameForGetter() { return CompanyName.nameFor; }

}




export class Platoon extends Unit<PlatoonName>
{

	override type = UnitType.Platoon;

	override getNameForGetter() { return PlatoonName.nameFor; }

}




export class Squad extends Unit<SquadName>
{

	override type = UnitType.Squad;

	override getNameForGetter() { return SquadName.nameFor; }

}






//===






export module Unit
{

	export function Service(db: DB)
	{


		const all: Unit[] = [];



		function add<
			TUnit extends Unit<TName>,
			TParent extends Unit,
			TName,
		>(
			parent: TParent | null,
			unitType: Constructor<TUnit>,
			names: [TName, TName, TName],
			fields?: Entity.Fields<TUnit>
		): TUnit
		{
			let unit = db.addTo<Unit, Unit<TName>>(all, unitType, {

				parent: parent!,

				shortName: names[0],
				name: names[1],
				fullName: names[2],

				...fields

			}) as TUnit;


			parent && (parent.items ??= []).register(unit);


			return unit;

		}



		return {

			all,


			addRegiment(
				parent: Unit | null,
				names: [RegimentName, RegimentName, RegimentName],
				fields?: Entity.Fields<Regiment>
			)
			{
				return add(parent, Regiment, names, fields);
			},


			addBattalion(
				parent: Regiment | null,
				names: [BattalionName, BattalionName, BattalionName],
				fields?: Entity.Fields<Battalion>
			)
			{
				return add(parent, Battalion, names, fields);
			},


			addCompany(
				parent: Battalion | null,
				names: [CompanyName, CompanyName, CompanyName],
				fields?: Entity.Fields<Company>
			)
			{
				return add(parent, Company, names, fields);
			},


			addPlatoon(
				parent: Battalion | Company | null,
				names: [PlatoonName, PlatoonName, PlatoonName],
				fields?: Entity.Fields<Platoon>
			)
			{
				return add(parent, Platoon, names, fields);
			},


			addSquad(
				parent: Platoon | null,
				names: [SquadName, SquadName, SquadName],
				fields?: Entity.Fields<Squad>
			)
			{
				return add(parent, Squad, names, fields);
			},


			roots: () => all.filter(a => !a.parent),

		};


	}

}