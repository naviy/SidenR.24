import { createContext, useContext, type ReactNode } from 'react';
import { Route } from ".";
import { GlobalState, Values, useNew as useNew_ } from "../core";
import { RouterBehavior, type RouterBehaviorProps } from "./RouterBehavior";






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




	export var Context = createContext<{ router: RouterBehavior | null }>({ router: null });




	export function use(): RouterBehavior | null
	{

		return useContext(Context).router;

	}



	export function Provider(props: {
		router: RouterBehavior,
		children: ReactNode;
	})
	{
		return (
			<Context.Provider value={{ router: props.router }}>
				<Route.Provider route={null}>
					{props.children}
				</Route.Provider>
			</Context.Provider>
		);
	}



	export function useNew(props?: RouterBehaviorProps): RouterBehavior
	{
		return useNew_(RouterBehavior).use(props);
	}




	//---


}