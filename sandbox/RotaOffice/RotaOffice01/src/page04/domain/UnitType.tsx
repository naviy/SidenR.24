export enum UnitType
{

	/** полк */
	Regiment = 1000,

	/** батальйон */
	Battalion = 300,

	/** рота */
	Company = 100,

	/** взвод */
	Platoon = 32,

	//** відділення */
	Squad = 10,


}






//===






export type RegimentName = [
	me: string
];




export function RegimentName(
	me: string
): RegimentName
{
	return [me];
}




export module RegimentName
{
	export function nameFor(unitType: UnitType | undefined, name: RegimentName)
	{
		return name[0];
	}
}






//===






export type BattalionName = [
	me: string,
	forRegiment: string | null
];




export function BattalionName(
	me: string,
	forRegiment: string | null
): BattalionName
{
	return [me, forRegiment];
}




export module BattalionName
{
	export function nameFor(unitType: UnitType | undefined, name: BattalionName): string
	{
		return (
			!unitType || unitType <= UnitType.Battalion ? name[0] :
				name[1] || name[0]
		);
	}
}






//===






export type CompanyName = [
	me: string,
	forBattalion: string | null,
	forRegiment: string | null
];




export function CompanyName(
	me: string,
	forBattalion: string | null,
	forRegiment: string | null
): CompanyName
{
	return [me, forBattalion, forRegiment];
}




export module CompanyName
{
	export function nameFor(unitType: UnitType | undefined, name: CompanyName): string
	{
		return (
			!unitType || unitType <= UnitType.Company ? name[0] :
				unitType === UnitType.Battalion ? name[1] || name[0] :
					name[2] || name[1] || name[0]
		);
	}
}






//===






export type PlatoonName = [
	me: string,
	forCompany: string | null,
	forBattalion: string | null,
	forRegiment: string | null
];




export function PlatoonName(
	me: string,
	forCompany: string | null,
	forBattalion: string | null,
	forRegiment: string | null
): PlatoonName
{
	return [me, forCompany, forBattalion, forRegiment];
}




export module PlatoonName
{
	export function nameFor(unitType: UnitType | undefined, name: PlatoonName): string
	{
		return (
			!unitType || unitType <= UnitType.Platoon ? name[0] :
				unitType === UnitType.Company ? name[1] || name[0] :
					unitType === UnitType.Battalion ? name[2] || name[1] || name[0] :
						name[3] || name[2] || name[1] || name[0]
		);
	}

}






//===






export type SquadName = [
	me: string,
	forPlatoon: string | null,
	forCompany: string | null,
	forBattalion: string | null,
	forRegiment: string | null
];




export function SquadName(
	me: string,
	forPlatoon: string | null,
	forCompany: string | null,
	forBattalion: string | null,
	forRegiment: string | null
): SquadName
{
	return [me, forPlatoon, forCompany, forBattalion, forRegiment];
}




export module SquadName
{
	export function nameFor(unitType: UnitType | undefined, name: SquadName): string
	{
		return (
			!unitType || unitType <= UnitType.Squad ? name[0] :
				unitType === UnitType.Platoon ? name[1] || name[0] :
					unitType === UnitType.Company ? name[2] || name[1] || name[0] :
						unitType === UnitType.Battalion ? name[3] || name[2] || name[1] || name[0] :
							name[4] || name[3] || name[2] || name[1] || name[0]
		);
	}
}
