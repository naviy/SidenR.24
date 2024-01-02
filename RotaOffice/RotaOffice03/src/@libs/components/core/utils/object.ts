export { }






declare global
{



	interface ObjectConstructor
	{

		assignDefineds<T extends {}, U>(target: T, source: U): T & U;
		assignDefineds<T extends {}, U1, U2>(target: T, source1: U1, source2: U2): T & U1 & U2;
		assignDefineds<T extends {}, U1, U2, U3>(target: T, source1: U1, source2: U2, source3: U3): T & U1 & U2 & U3;
		assignDefineds(target: object, ...sources: any[]): any;

		assignDefinedsToClone<T extends {}, U>(target: T, source: U): T & U;
		assignDefinedsToClone<T extends {}, U1, U2>(target: T, source1: U1, source2: U2): T & U1 & U2;
		assignDefinedsToClone<T extends {}, U1, U2, U3>(target: T, source1: U1, source2: U2, source3: U3): T & U1 & U2 & U3;
		assignDefinedsToClone(target: object, ...sources: any[]): any;

		shallowEqual<T extends {}>(target: T, source: T): boolean;

	}



}






//===






Object.assignDefineds = function assignDefineds(target: any, ...sources: any[]): any
{

	if (!target)
		return target;


	for (var source of sources)
	{

		for (var key of Object.keys(source))
		{

			var value = source[key];

			if (value !== undefined)
			{
				target[key] = value;
			}

		}

	}


	return target;

}



Object.assignDefinedsToClone = function assignDefinedsToClone(target: any, ...sources: any[]): any
{

	if (!target)
		return target;


	var clone = undefined;


	for (var source of sources)
	{

		for (var key of Object.keys(source))
		{

			var value = source[key];

			if (value !== undefined && target[key] !== value)
			{

				if (!clone)
					clone = { ...target };

				clone[key] = value;
			}

		}

	}


	return clone || target;

}




var keyList = Object.keys;


Object.shallowEqual = function shallowEqual(a, b)
{

	if (a === b)
		return true;


	if (!(a instanceof Object) || !(b instanceof Object))
		return false;


	var keys = keyList(a);
	var length = keys.length;

	for (var i = 0; i < length; i++)
	{
		if (!(keys[i] in b))
			return false;
	}


	for (var i = 0; i < length; i++)
	{
		if ((a as any)[keys[i]] !== (b as any)[keys[i]])
			return false;
	}


	return length === keyList(b).length;

};