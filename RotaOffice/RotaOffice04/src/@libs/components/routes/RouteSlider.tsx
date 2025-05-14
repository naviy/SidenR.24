import { $defaultAnimationDurationMs, Div, type DivProps } from "../core";
import { FillSlide } from "../transitions";
import { Children } from "./Route";
import { Router } from "./Router";
import type { RouterBehavior } from "./RouterBehavior";






//===






export function RouteSlider/*<TRoute extends RouteBehavior = RouteBehavior>*/({

	router,

	vertical,
	offset,
	//zoom,

	mountOnEnter,
	unmountOnExit,

	autoFocus,

	children,

	...sliderProps

}: Omit<DivProps, 'children'> & {

	router?: RouterBehavior | null;

	vertical?: boolean;
	offset?: string | number,
	//zoom?: boolean | number | null;

	mountOnEnter?: boolean;
	unmountOnExit?: boolean;

	autoFocus?: boolean;
	//expander?: boolean;

	children?: Children/*<TRoute>*/;

})
{

	if (router === undefined)
	{
		router = Router.useCurrent();
	}


	let routerDir = router?.dir()!;
	let activeRoute = router?.activeRoute;


	let body = <Div relative {...sliderProps}>

		{router?.routes?.map(route =>

			<FillSlide

				id={route.key}
				key={route.key}

				appear={false}
				timeout={$defaultAnimationDurationMs}

				in={route === activeRoute}

				dir={routerDir > 0}
				vertical={vertical}
				offset={offset}
				//zoom={zoom}

				flex={sliderProps.flex}
				fill={sliderProps.fill}

				mountOnEnter={mountOnEnter !== false}
				unmountOnExit={unmountOnExit !== false}

				autoFocus={autoFocus}

				children={Children({ route }, children)}

			/>

		)}

	</Div>;



	return body;

}
