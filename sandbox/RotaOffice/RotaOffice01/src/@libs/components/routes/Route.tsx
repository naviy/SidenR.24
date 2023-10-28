import { createContext, useContext, type ReactNode } from "react";
import { RouteBehavior, type RouteBehaviorProps } from "./RouteBehavior";
import { Router } from "./Router";






//===






export { RouteBehavior as Behavior } from "./RouteBehavior"
export { RouteChildren as Children } from "./RouteChildren"
export { Router } from "./Router"




//===




export function create(props: RouteBehaviorProps)
{
	return new RouteBehavior(props);
}




const Context = createContext<RouteBehavior | null>(null);


export function Provider(props: { route: RouteBehavior | null; children: ReactNode })
{
	return <Context.Provider
		value={props.route}
		children={props.children}
	/>;
}


export function use(): RouteBehavior | null
{
	return useContext(Context);
}



export function useActive()
{
	return Router.use()?.activeRoute;
}
