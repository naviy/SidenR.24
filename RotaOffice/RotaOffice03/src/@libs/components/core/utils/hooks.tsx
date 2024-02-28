import { type MutableRefObject, useEffect, useReducer, useRef } from 'react';
import { $log } from './$log';






//===






export function useNew<T>(

	objectClass: { new(): T },

): T
{

	const ref = useRef<T>();


	let obj = ref.current;


	if (!obj)
	{
		obj = ref.current = new objectClass();
	}
	else if (typeof obj !== 'object')
	{
		$log.error(`useNew(): объект, полученный с помощью useRef(), имеет тип ${typeof obj} и не является наследником класса ${objectClass.name}`);
	}
	else if (!(obj instanceof objectClass))
	{
		$log.error(`useNew(): объект, полученный с помощью useRef(), имеет тип ${(obj as Object).constructor.name} и не является наследником класса ${objectClass.name}`);
	}


	return obj!;

}




export function useArray<T>(): T[]
{

	const ref = useRef<T[]>();


	if (!ref.current)
	{
		ref.current = [];
	}


	return ref.current!;

}




export function useForceUpdate(customForceUpdate?: () => void): () => void
{

	if (customForceUpdate !== undefined)
	{
		return customForceUpdate;
	}



	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [_, update] = useReducer(a => a + 1, 0);
	
	function forceUpdate() { update(); }


	return forceUpdate;

}




export function useForceUpdateAsync(): () => Promise<void>
{

	const [updateCount, incUpdateCount] = useReducer(a => a + 1, 0);


	const resolveRef = useRef<null | ((value?: any) => void)>();


	useEffect(

		() =>
		{

			resolveRef.current?.();

			resolveRef.current = null;

		},

		[updateCount]

	);



	return (function aforceUpdate()
	{
		return new Promise((resolve, reject) =>
		{

			resolveRef.current?.();

			resolveRef.current = resolve;

			incUpdateCount();

		});
	});

}






export function createActionRef(): MutableRefObject<(() => void) | null>
{
	return { current: null };
}