import { $defaultAnimationDurationMs, Div, type DivProps } from "../core";
import { FillFade } from "../transitions";
import { Children } from "./Route";
import { Router } from "./Router";
import type { RouterBehavior } from "./RouterBehavior";






//===






export function RouteFader/*<TRoute extends RouteBehavior = RouteBehavior>*/({

	router,

	mountOnEnter,
	unmountOnExit,

	autoFocus,
	root,

	children,

	...faderProps

}: Omit<DivProps, 'children'> & {

	router?: RouterBehavior | null;

	mountOnEnter?: boolean;
	unmountOnExit?: boolean;

	autoFocus?: boolean;
	root?: boolean;

	children?: Children/*<TRoute>*/;

})
{

	if (router === undefined)
	{
		router = Router.useCurrent();
	}

	let activeRoute = router?.activeRoute;



	let body = <Div relative {...faderProps}>

		{router?.routes?.map(route =>

			<FillFade

				key={route.key}

				appear={false}
				timeout={$defaultAnimationDurationMs}

				in={route === activeRoute}

				flex={faderProps.flex}

				mountOnEnter={mountOnEnter !== false}
				unmountOnExit={unmountOnExit !== false}

				autoFocus={autoFocus}
				root={root}

				children={Children({ route }, children)}

			/>

		)}

	</Div>;



	return body;

}
