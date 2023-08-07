import { Context, useContext } from "react";






//===






export interface PropsByContext<P, TContextValue = any>
{

	context?: Context<TContextValue> | { Context: Context<TContextValue> };

	propsByContext?: (contextValue: TContextValue) => Partial<Omit<P, "context" | "propsByContext">>;

}






export module PropsByContext
{



	export const propNames: Array<keyof PropsByContext<any, any>> = [
		"context", "propsByContext",
	];



	export function use<
		P extends PropsByContext<P, TContextValue>,
		TContextValue = any
	>(props: P): P
	{

		let context = (
			!props.context ? null :
				(props.context as any).Context ? (props.context as any).Context as Context<any> :
					props.context as Context<any>
		);

		let contextValue = context ? useContext(context) : null;

		let propsByContext = props.context && props.propsByContext ? props.propsByContext(contextValue) : null;


		if (propsByContext)
		{
			props = Object.assignDefined({ ...props }, propsByContext);
		}


		return props;

	}



}