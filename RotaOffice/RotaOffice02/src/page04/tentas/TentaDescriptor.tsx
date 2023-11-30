import type { TentaPlaceholder } from "./TentaPlaceholder";






//===






export interface TentaDescriptor
{

	getMargin: (phr: TentaPlaceholder) => TentaDescriptor.MarginAlias

}




export module TentaDescriptor
{

	//---



	export interface Margin
	{
		top: number;
		bottom: number;
		tailTop: 0 | 1;
		tailBottom: 0 | 1;
	};



	export type MarginAlias = (
		Margin |
		null | [
			top: number,
			bottom: number,
			tailTop: 0 | 1,
			tailBottom: 0 | 1,
		] | [
			top: number,
			tailTop: 0 | 1,
		]
	);


	export function Margin(m: MarginAlias | undefined): Margin
	{

		if (!m)
		{
			return {
				top: 0,
				bottom: 0,
				tailTop: 0,
				tailBottom: 0,
			};
		}


		if (Array.isArray(m))
		{
			if (m.length === 4)
			{
				return {
					top: m[0],
					bottom: m[1],
					tailTop: m[2],
					tailBottom: m[3],
				};
			}
			else
			{
				return {
					top: m[0],
					bottom: m[0],
					tailTop: m[1],
					tailBottom: m[1],
				};
			}
		}


		return m;

	}



	//---

}