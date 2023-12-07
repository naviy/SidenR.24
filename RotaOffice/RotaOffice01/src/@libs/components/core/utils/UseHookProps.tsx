export interface UseHookProps<P = any>
{
	use?: (props: P) => Partial<Omit<P, "use">> | null | undefined;
}




export module UseHookProps
{



	export var propNames_: Record<keyof UseHookProps, true> =
	{
		use: true,
	};


	export var propNames = Object.keys(propNames_) as Array<keyof UseHookProps>;



	export function use<P extends UseHookProps<P>>(props: P): P
	{

		if (!props.use)
			return props;


		let newProps = props.use(props);


		if (newProps)
		{
			props = Object.assignDefinedsToClone(props, newProps);
		}


		return props;

	}



}