import { createContext, useContext, type ReactNode } from 'react';
import { RouterBehavior, type RouterBehaviorProps } from "./RouterBehavior";
import { GlobalState, Values, useNew } from "../core";






//===






export function Router(props: {

	router: RouterBehavior | undefined,

	rootState?: GlobalState;
	compressState?: boolean;

	forceUpdate?: () => void;

	children: Values.One<ReactNode>;

})
{

	if (props.router === undefined)
	{
		return <>{Values.one(props.children)}</>;
	}


	let body: ReactNode = <Router.Context.Provider
		value={props.router}
		children={Values.one(props.children)}
	/>;


	if (props.rootState !== undefined)
	{

		props.compressState && GlobalState.compress(props.rootState);


		body = <GlobalState
			state={props.rootState}
			children={body}
		/>;

	}


	return body;

}





export module Router
{


	//---




	export const Context = createContext<RouterBehavior | null>(null);




	export function use(): RouterBehavior | null
	{

		return useContext(Context);

	}



	export function useBehavior(props?: RouterBehaviorProps): RouterBehavior
	{
		return useNew(RouterBehavior).use(props);
	}




	//---


}