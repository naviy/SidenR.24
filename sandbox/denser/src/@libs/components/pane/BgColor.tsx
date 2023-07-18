import { PaletteMode, Theme } from '@mui/material';
import { Property } from 'csstype';




//===







export type BgColor = 'background' | 'container' | 'surface' | Property.BackgroundColor;




export function BgColor(
	theme: Theme | PaletteMode,
	color: BgColor | undefined,
	defaultColor?: BgColor
): Property.BackgroundColor | undefined
{

	let mode = (typeof theme === 'string' ? theme : theme?.palette?.mode) || 'light';

	return (
		mode === 'light'
			? color == null ? defaultColor || BgColor.Light.Default :
				color === 'background' ? BgColor.Light.Background :
					color === 'container' ? BgColor.Light.Container :
						color === 'surface' ? BgColor.Light.Surface :
							color
			: color == null ? defaultColor || BgColor.Dark.Default :
				color === 'background' ? BgColor.Dark.Background :
					color === 'container' ? BgColor.Dark.Container :
						color === 'surface' ? BgColor.Dark.Surface :
							color
	);
}




export module BgColor
{

	export const Light = {
		Default: '#ffffff',
		//Background: '#d6e8f5',
		//Container: '#eef4f9',
		Surface: '#ffffff',
		//Default: '#ffffff',
		Background: '#c2d0d9',
		Container: '#e4eaee',
		//Surface: '#ffffff',
	};

	export const Dark = {
		Default: '#ffffff',
		Background: '#c2d0d9',
		Container: '#e4eaee',
		Surface: '#ffffff',
	};

}
