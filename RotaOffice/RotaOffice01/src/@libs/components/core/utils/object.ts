export { }






declare global
{



	interface ObjectConstructor
	{

		assignDefineds<T extends {}, U>(target: T, source: U): T & U;
		assignDefineds<T extends {}, U1, U2>(target: T, source1: U1, source2: U2): T & U1 & U2;
		assignDefineds<T extends {}, U1, U2, U3>(target: T, source1: U1, source2: U2, source3: U3): T & U1 & U2 & U3;
		assignDefineds(target: object, ...sources: any[]): any;

		assignDefinedProps<T extends {}>(target: T, source: Readonly<Partial<T>>, ...props: Array<keyof T>): T;

		assignDefinedsToClone<T extends {}, U>(target: T, source: U): T & U;
		assignDefinedsToClone<T extends {}, U1, U2>(target: T, source1: U1, source2: U2): T & U1 & U2;
		assignDefinedsToClone<T extends {}, U1, U2, U3>(target: T, source1: U1, source2: U2, source3: U3): T & U1 & U2 & U3;
		assignDefinedsToClone(target: object, ...sources: any[]): any;

	}



}






//===






Object.assignDefineds = function assignDefineds(target: any, ...sources: any[]): any
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



Object.assignDefinedProps = function assignDefinedsProps<T extends {}>(
	target: T,
	source: Readonly<Partial<T>>,
	...props: Array<keyof T>
): T
{

	if (!target)
		return target;


	for (const prop of props)
	{

		const value = source[prop];

		if (value !== undefined)
		{
			(target as any)[prop] = value;
		}

	}


	return target;

}






Object.assignDefinedsToClone = function assignDefinedsToClone(target: any, ...sources: any[]): any
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
