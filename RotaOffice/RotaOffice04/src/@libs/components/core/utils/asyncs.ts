export function adelay(timeout?: number, callback?: () => void)
{
	return new Promise(resolve => setTimeout(resolve, timeout || 0)).then(callback);
};



export function arequestAnimationFrame<T>(callback?: (time: number) => T)
{
	return new Promise<T | undefined>(resolve =>
	{
		requestAnimationFrame(time =>
		{
			let result = callback?.(time);
			resolve(result);
		});
	});
}