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
		router = Router.use();
	}


	if (!router)
	{
		throw new Error('Router is ' + router!);
	}


	const selector = useNew(RouteSelectorBehavior).use({ router });

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

			<Focuser ref={selector.ff} root cursor ghost modal priority={999999} click="unfocus">

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

			</Focuser>

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


	return (
		<Focuser
			autoFocus={autoFocus}
			allowShiftKey
			onFocus={() => selector.selectRoute(route)}
			onEnter={() => selector.hide()}
			onClick={() =>
			{
				selector.selectRoute(route);
				selector.hide();
			}}
			onDelete={async ff =>
			{
				await ff.focusPrior() || await ff.focusNext();
				//await route.close?.();
			}}
		>

			<Div relative>

				<Focuser.Caret />

				<ListItemButton
					selected={route.active}
				//disabled={!route.lastActivateTime}
				>


					{icon && <ListItemIcon>{icon}</ListItemIcon>}

					<ListItemText
						primary={route.title()}
						//secondary={autoFocus + ''}
						//secondary={route.lastActivateTime && moment(route.lastActivateTime).format('HH:mm:ss')}
						secondary={route.description() || undefined}
					/>

				</ListItemButton>

			</Div>

		</Focuser>
	);

}
