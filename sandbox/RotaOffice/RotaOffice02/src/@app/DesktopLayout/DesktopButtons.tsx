import ButtonBase from "@mui/material/ButtonBase";
import { styled, type Theme } from "@mui/material/styles";
import { $defaultAnimationDurationMs } from "../../@libs";






//===






export const DesktopIconButton = styled(
	ButtonBase,
	{ shouldForwardProp: p => p !== 'flexGrow' && p !== 'flexEnd' }
)<{

	theme?: Theme;
	flexGrow?: number | true;
	flexEnd?: boolean;

}>(
	({ theme, flexGrow, flexEnd }) =>
	({

		fontSize: '28px',
		lineHeight: 1,
		minWidth: 64,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		flexGrow: typeof flexGrow === 'boolean' ? flexGrow ? 1 : undefined : flexGrow,
		justifyContent: flexEnd ? 'flex-end' : 'flex-start',

		transition: `background ${$defaultAnimationDurationMs}ms linear`,

		'&:hover': {
			background: theme.palette.action.hover,
		},

		'svg': {
			width: 64,
		},

	})
);