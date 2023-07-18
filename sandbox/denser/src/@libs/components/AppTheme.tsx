import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";
import { createContext, ReactNode, useContext } from "react";






//===






interface AppThemesProps
{
	default: PaletteMode;
	navigation: PaletteMode;
}






const Context = createContext<AppThemesProps>({ default: 'light', navigation: 'dark' });





export function AppThemes(props: Partial<AppThemesProps> & { children: ReactNode })
{

	let parent = useContext(Context);
	

	return <Context.Provider
		value={{
			default: props.default || parent.default,
			navigation: props.navigation || parent.navigation,
		}}
		children={props.children}
	/>;

}






export module AppThemes
{



	export const lightTheme = createTheme();
	export const darkTheme = createTheme({ palette: { mode: 'dark' } });



	export function byMode(mode: PaletteMode | null | undefined)
	{
		return !mode ? null : mode === 'dark' ? darkTheme : lightTheme;
	}




	export function Dark(props: { children: ReactNode })
	{
		return <ThemeProvider theme={darkTheme} children={props.children} />;
	}


	export function Light(props: { children: ReactNode })
	{
		return <ThemeProvider theme={lightTheme} children={props.children} />;
	}



	export function Navigation(props: { children: ReactNode })
	{

		const ctx = useContext(Context);

		return <ThemeProvider theme={byMode(ctx?.navigation) || darkTheme} children={props.children} />;

	}


	export function Default(props: { children: ReactNode })
	{

		const ctx = useContext(Context);

		return <ThemeProvider theme={byMode(ctx?.default) || lightTheme} children={props.children} />;

	}



}