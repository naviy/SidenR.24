import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Div, useNew } from "../core";
import { Focuser } from "../flow-focuser";
import type { RouteBehavior } from "./RouteBehavior";
import { RouteSelectorBehavior } from "./RouteSelectorBehavior";
import { Router } from "./Router";
import type { RouterBehavior } from "./RouterBehavior";
import Backdrop from "@mui/material/Backdrop";
import { styled } from "@mui/material/styles";






//===






export function RouteSelectorModal({ router }: { router?: RouterBehavior | null })
{

	if (router === undefined)
	{
		router = Router.useCurrent();
	}


	if (!router)
	{
		throw new Error('Router is ' + router!);
	}


	const selector = useNew(RouteSelectorBehavior).use({

		router,

		ff: {
			name: "route-selector",
			root: true,
			scrollable: true,
			ghost: true,
			modal: true,
			priority: 999999,
			click: "unfocus",
		},

	});


	const { nextIndex } = selector;


	return (

		<Dialog
			open={selector.visible}
			//open
			maxWidth="md"
			fullWidth
			onClose={selector.hide}
			slots={{
				backdrop: SelectorBackdrop
			}}
		>

			<Focuser.Area ff={selector.ff}>

				{/*<DialogTitle>Route Selector</DialogTitle>*/}

				<DialogContent dividers>

					{/*<Box sx={{ minWidth: 400, px: 3 }}>*/}

					<List>

						{selector.router.routesByActivateTime.map((route, i) =>
							<RouteLink key={i} selector={selector} route={route} autoFocus={i === nextIndex} />
						)}

					</List>

					{/*</Box>*/}

				</DialogContent>

			</Focuser.Area>

		</Dialog>

	);

}





const SelectorBackdrop = styled(Backdrop)({

	backgroundColor: "rgba(0, 0, 0, 0.2)",
	//backgroundColor: "rgba(34, 43, 19, 0.4)",

});






function RouteLink({

	selector, route, autoFocus,

}: {

	selector: RouteSelectorBehavior;
	route: RouteBehavior;
	autoFocus: boolean;

})
{

	let icon = route.icon();


	let ff = Focuser.use({

		name: "route-selector-link",

		autoFocus,
		allowShiftKey: true,

		onFocus: () => selector.selectRoute(route),
		onEnter: () => selector.hide(),

		onClick: (ff) =>
		{
			selector.selectRoute(route);
			selector.hide();
		},

		onDelete: async ff =>
		{
			await ff.focusPrior() || await ff.focusNext();
			//await route.close?.();
		},

	});


	return (
		<Focuser.Area ff={ff}>

			<Div ref={ff.divRef} relative>

				<Focuser.Caret />

				<ListItemButton
					selected={route.active}
				//disabled={!route.lastActivateTime}
				>


					{icon && <ListItemIcon>{icon}</ListItemIcon>}

					<ListItemText
						primary={route.title()}

						secondary={`autoFocus: ${autoFocus}, disabled: ${ff.disabled}`}
						////secondary={route.lastActivateTime && moment(route.lastActivateTime).format('HH:mm:ss')}
						//secondary={route.description() || undefined}
					/>

				</ListItemButton>

			</Div>

		</Focuser.Area>
	);

}
