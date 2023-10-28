import { createContext, useContext, type ReactNode } from 'react';
import { RouterBehavior, type RouterBehaviorProps } from "./RouterBehavior";
import { GlobalState, Values, useNew } from "../core";






//===






export function Router(props: {

	router: RouterBehavior | undefined,

	rootState?: GlobalState;
	compressState?: boolean;

	children: ReactNode;

})
{

	if (props.router === undefined)
	{
		return <>{Values.one(props.children)}</>;
	}


	let body: ReactNode = <Router.Provider
		router={props.router}
		children={props.children}
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




	export const Context = createContext<{ router: RouterBehavior | null }>({ router: null });




	export function use(): RouterBehavior | null
	{

		return useContext(Context).router;

	}



	export function Provider(props: {
		router: RouterBehavior,
		children: ReactNode;
	})
	{
		return <Router.Context.Provider
			value={{ router: props.router }}
			children={props.children}
		/>;
	}



	export function useBehavior(props?: RouterBehaviorProps): RouterBehavior
	{
		return useNew(RouterBehavior).use(props);
	}




	//---


}