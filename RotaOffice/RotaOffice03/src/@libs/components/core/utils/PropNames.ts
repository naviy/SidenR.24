export { };




declare global
{

	type PropNames<T extends {} = {}> = Readonly<Record<keyof T, boolean>>;


	module PropNames
	{

		export function assignDefinedProps<T extends {}>(
			target: T,
			source: Readonly<Partial<T>>,
			props: PropNames<T>
		): T;

	}

}



(window as any).PropNames =
{

	assignDefinedProps<T extends {}>(
		target: T,
		source: Readonly<Partial<T>>,
		props: Record<keyof T, boolean>
	): T
	{

		if (!target)
			return target;


		for (const prop of Object.keys(props))
		{

			const value = (source as any)[prop];

			if (value !== undefined)
			{
				(target as any)[prop] = value;
			}

		}


		return target;

	}

};


