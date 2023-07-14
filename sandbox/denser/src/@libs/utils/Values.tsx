export module Values
{



	//===






	export type One<T> = (
		null |
		undefined |
		T |
		(() => One<T>)
	);






	export function one<T>(source: One<T> | null | undefined): T;

	export function one<T, T2>(source: One<T> | null | undefined, selector: (value: T) => T2): T2;

	export function one(source: One<any> | null | undefined, selector?: (value: any) => any): any
	{

		let value: any = source;


		if (value == null)
		{
			return value;
		}


		if (typeof source === 'function')
		{
			value = one(source());
		}


		if (selector)
		{
			value = selector(value);
		}


		return value;

	}





	export function onen<T>(source: One<T> | null | undefined): T | null | undefined;

	export function onen<T, T2>(source: One<T> | null | undefined, selector: (value: T | null | undefined) => T2 | null | undefined): T2 | null | undefined;

	export function onen(source: One<any> | null | undefined, selector?: (value: any) => any): any
	{

		let value: any = source;


		if (typeof source === 'function')
		{
			value = onen(source());
		}


		if (selector)
		{
			value = selector(value);
		}


		return value;

	}






	//===






	export type Many<T> = (
		null |
		undefined |
		false |
		T |
		Many<T>[] |
		(() => Many<T>)
	);






	export function many<T>(source: Many<T> | null | undefined): T[];

	export function many<T, T2>(source: Many<T> | null | undefined, selector: (value: T) => T2): T2[];

	export function many(source: Many<any> | null | undefined, selector?: (value: any) => any): any[]
	{

		const result: any[] = [];

		append(source);

		return result;



		function append(source: Many<any>)
		{

			if (source == null)
				return;


			if (Array.isArray(source))
			{
				source.forEach(append);
			}

			else if (typeof source === 'function')
			{
				append((source as any)());
			}

			else if (selector)
			{
				result.push(selector(source));
			}

			else
			{
				result.push(source);
			}

		}

	}






	export function manyn<T>(source: Many<T> | null | undefined): (T | null | undefined)[];

	export function manyn<T, T2>(source: Many<T> | null | undefined, selector: (value: T | null | undefined) => T2 | null | undefined): (T2 | null | undefined)[];

	export function manyn(source: Many<any> | null | undefined, selector?: (value: any) => any): any[]
	{

		const result: any[] = [];

		append(source);

		return result;



		function append(source: Many<any>)
		{

			if (Array.isArray(source))
			{
				source.forEach(append);
			}

			else if (typeof source === 'function')
			{
				append((source as any)());
			}

			else if (selector)
			{
				result.push(selector(source));
			}

			else
			{
				result.push(source);
			}

		}

	}






	//===






	export type Name<T = any> = One<keyof T | symbol | { $name?: string; }>;

	export type Names<T = any> = Many<keyof T | symbol | { $name?: string; }>;






	export function name<T>(name: Name<T>): keyof T | symbol | null
	{
		return one(name, nameToString);
	}



	export function names<T>(names: Names<T>): (keyof T)[]
	{
		return many(names, nameToString) as (keyof T)[];
	}



	function nameToString<T>(name: keyof T | symbol | { $name?: string; } | null | undefined): keyof T | symbol | null
	{

		if (!name)
			return null;


		if ((name as any)['$name'])
		{
			return (name as any).$name as keyof T;
		}


		return name as any;

	}





	//===



}
