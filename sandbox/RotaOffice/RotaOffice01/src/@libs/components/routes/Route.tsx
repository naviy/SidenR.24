import { createContext, useContext, type ReactNode } from "react";
import { RouteBehavior, type RouteBehaviorProps } from "./RouteBehavior";




//===




export { RouteBehavior as Behavior } from "./RouteBehavior"
export { RouteChildren as Children } from "./RouteChildren"




//===




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




export function create(props: RouteBehaviorProps)
{
	return new RouteBehavior(props);
}
