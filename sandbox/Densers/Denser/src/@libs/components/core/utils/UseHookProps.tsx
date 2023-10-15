export interface UseHookProps<P = any>
{
	use?: (props: P) => Partial<Omit<P, "use">> | null | undefined;
}




export module UseHookProps
{



	export const propNames: Array<keyof UseHookProps> = [
		"use",
	];



	export function use<P extends UseHookProps<P>>(props: P): P
	{

		if (!props.use)
			return props;


		let newProps = props.use(props);


		if (newProps)
		{
			props = Object.assignDefinedToClone(props, newProps);
		}


		return props;

	}



}