import { createContext, useContext, type ReactNode } from "react";
import { RouteBehavior, type RouteBehaviorProps } from "./RouteBehavior";
import { Router } from "./Router";
import { GlobalState } from "..";






//===






export { RouteBehavior as Behavior } from "./RouteBehavior"
export { Router } from "./Router"
export { RouteFader as Fader } from "./RouteFader"
export { RouteSlider as Slider } from "./RouteSlider"
export { RouteSelectorModal as SelectorModal } from "./RouteSelectorModal"






//===






export function create(props: RouteBehaviorProps)
{
	return new RouteBehavior(props);
}




var Context = createContext<RouteBehavior | null>(null);


export function Provider(props: { route: RouteBehavior | null; children: ReactNode })
{
	return <Context.Provider
		value={props.route}
		children={props.children}
	/>;
}


export function useCurrent(): RouteBehavior | null
{
	return useContext(Context);
}



//export function useActive()
//{
//	return Router.use()?.activeRoute;
//}






//===






//export function render(
//	route: RouteBehavior | null | undefined,
//	children?: RouteChildren
//)
//{

//	if (route === undefined)
//	{
//		route = useActive();
//	}


//	if (route == null)
//		return null;


//	let body = route.getChildren(children);


//	body = <Context.Provider value={route} children={body} />;


//	return body;

//}

export type Children/*<TRoute extends RouteBehavior = RouteBehavior>*/ = (
	"icon" | "title" | "description" | "content" |
	((route: RouteBehavior/*TRoute*/) => ReactNode) |
	ReactNode
);




export interface ChildrenProps
{
	router?: Router.Behavior | null;
	route?: RouteBehavior | null;
	globalState?: boolean | GlobalState;
}




export function Children(
	{
		router,
		route,
		globalState
	}: ChildrenProps,
	children?: Children
)
{

	if (router === undefined)
	{
		router = Router.useCurrent();
	}


	if (route === undefined)
	{
		let currentRoute = useCurrent();

		route = currentRoute || router?.activeRoute;
	}


	if (route == null)
		return null;


	let body: ReactNode = undefined;


	if (children === undefined)
	{
		body = route.content();
	}
	else if (children === null)
	{
		body = null;
	}
	else if (typeof children === 'function')
	{
		body = (children as any)(route);
	}
	else if (typeof children === 'string' && (route as any)[children])
	{
		body = (route as any)[children]();
	}
	else
	{
		body = children;
	}


	if (globalState === true)
	{
		body = <GlobalState name={route.key} children={body} />;
	}
	else if (typeof globalState === "object")
	{
		body = <GlobalState state={globalState} children={body} />;
	}


	body = <Provider route={route} children={body} />;





	return body;

}



export function Icon(props: ChildrenProps)
{
	return Children(props, "icon");
}


export function Title(props: ChildrenProps)
{
	return Children(props, "title");
}


export function IconTitle(props: ChildrenProps)
{
	return Children(props, r => <>{r.icon()}{r.title()}</>);
}


export function Content(props: ChildrenProps)
{
	return Children(props, "content");
}
