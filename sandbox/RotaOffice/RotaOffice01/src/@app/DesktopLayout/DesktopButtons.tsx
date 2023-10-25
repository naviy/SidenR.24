import ButtonBase from "@mui/material/ButtonBase";
import { styled, type Theme } from "@mui/material/styles";






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

		fontSize: '1.5rem',
		minWidth: 64,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		flexGrow: typeof flexGrow === 'boolean' ? flexGrow ? 1 : undefined : flexGrow,
		justifyContent: flexEnd ? 'flex-end' : 'flex-start',

		'&:hover': {
			background: theme.palette.action.hover,
		},

		'i': {
			width: 64,
		},

	})
);