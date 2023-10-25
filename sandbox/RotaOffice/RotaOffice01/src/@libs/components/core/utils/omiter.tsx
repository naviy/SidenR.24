export class Omiter<T = any, T2 = any>
{

	//---



	constructor(keys: (Omiter<Partial<T>> | keyof T)[])
	{
		this.append(keys);
	}



	//---



	keys!: Array<keyof T>;



	//---



	append(keys: (Omiter<Partial<T>> | keyof T)[])
	{

		let keys2 = this.keys;

		if (!keys2)
		{
			this.keys = keys2 = [] as any;
		}


		for (let key of keys)
		{

			if (key instanceof Omiter)
			{
				key.keys && keys2.push(...key.keys);
			}
			else
			{
				keys2.push(key);
			}

		}


		return this;

	}



	omit(obj: T)
	{

		let keys = this.keys;

		let result: Partial<T> | undefined = undefined;



		for (let prop in obj) 
		{

			if (!Object.prototype.hasOwnProperty.call(obj, prop))
				continue;


			if (keys.indexOf(prop) >= 0)
				continue;

			if (obj[prop] === undefined)
				continue;


			result ??= {};

			result[prop] = obj[prop];

		}


		return result as T2 ?? obj;

	}



	//extract(obj: T | null | undefined): T | null
	//{

	//	if (!obj)
	//		return null;


	//	let keys = this.keys;

	//	let result: Partial<T> = {};

	//	let added = false;


	//	for (let prop in obj)
	//	{

	//		if (!Object.prototype.hasOwnProperty.call(obj, prop))
	//			continue;


	//		if (obj[prop] === undefined)
	//		{
	//			continue;
	//		}

	//		if (keys.indexOf(prop) < 0)
	//		{
	//			continue;
	//		}


	//		result[prop] = obj[prop];
	//		added = true;
	//	}


	//	return added ? result as T : null;

	//}



	//---

}






export function createOmiter<T, T2 = any>(...keys: (Omiter<Partial<T>> | keyof T)[]): Omiter<T, T2>
{
	return new Omiter<T, T2>(keys);
}
