export { }






declare global
{



	interface ObjectConstructor
	{

		assignDefined<T extends {}, U>(target: T, source: U): T & U;
		assignDefined<T extends {}, U1, U2>(target: T, source1: U1, source2: U2): T & U1 & U2;
		assignDefined<T extends {}, U1, U2, U3>(target: T, source1: U1, source2: U2, source3: U3): T & U1 & U2 & U3;
		assignDefined(target: object, ...sources: any[]): any;

		assignDefinedToClone<T extends {}, U>(target: T, source: U): T & U;
		assignDefinedToClone<T extends {}, U1, U2>(target: T, source1: U1, source2: U2): T & U1 & U2;
		assignDefinedToClone<T extends {}, U1, U2, U3>(target: T, source1: U1, source2: U2, source3: U3): T & U1 & U2 & U3;
		assignDefinedToClone(target: object, ...sources: any[]): any;

	}



}






//===






Object.assignDefined = function assignDefined(target: any, ...sources: any[]): any
{

	if (!target)
		return target;


	for (const source of sources)
	{

		for (const key of Object.keys(source))
		{

			const value = source[key];

			if (value !== undefined)
			{
				target[key] = value;
			}

		}

	}


	return target;

}






Object.assignDefinedToClone = function assignDefinedToClone(target: any, ...sources: any[]): any
{

	if (!target)
		return target;


	let clone = undefined;


	for (const source of sources)
	{

		for (const key of Object.keys(source))
		{

			const value = source[key];

			if (value !== undefined)
			{

				if (!clone)
					clone = { ...target };

				clone[key] = value;
			}

		}

	}


	return clone || target;

}
