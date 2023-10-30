import type { Theme } from "@emotion/react";
import type { PaletteMode } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { createContext, useContext, type ReactNode } from "react";






//===






interface AppThemesProps
{

	default?: PaletteMode;
	navigation?: PaletteMode;

	lightTheme?: Theme;
	darkTheme?: Theme;

}






export function AppThemes(props: AppThemesProps & { children: ReactNode })
{

	let parent = useContext(AppThemes.Context);


	return <AppThemes.Context.Provider

		value={{

			default: props.default || parent.default,
			navigation: props.navigation || parent.navigation,

			lightTheme: props.lightTheme || parent.lightTheme,
			darkTheme: props.darkTheme || parent.darkTheme,

		}}

		children={props.children}

	/>;

}






export module AppThemes
{




	//export const lightTheme = createTheme();

	//export const darkTheme = createTheme({
	//	palette: {
	//		mode: 'dark',
	//		background: {
	//			paper: "#1a200e",
	//		},

	//	},
	//});



	type AppThemesContext = Required<AppThemesProps>;


	export const Context = createContext<AppThemesContext>({
		default: 'light',
		navigation: 'dark',
		lightTheme: createTheme(),
		darkTheme: createTheme({ palette: { mode: 'dark' } }),
	});



	export function use()
	{
		return useContext(Context);
	}



	function byMode(ctx: AppThemesContext, mode: PaletteMode)
	{
		return mode === 'dark' ? ctx.darkTheme : ctx.lightTheme;
	}




	export function Dark(props: { children: ReactNode })
	{
		const ctx = use();

		return <ThemeProvider
			theme={ctx.darkTheme}
			children={props.children}
		/>;
	}


	export function Light(props: { children: ReactNode })
	{
		const ctx = use();

		return <ThemeProvider
			theme={ctx.lightTheme}
			children={props.children}
		/>;
	}



	export function Navigation(props: { children: ReactNode })
	{

		const ctx = use();

		return <ThemeProvider
			theme={byMode(ctx, ctx.navigation)}
			children={props.children}
		/>;

	}


	export function Default(props: { children: ReactNode })
	{
		const ctx = use();

		return <ThemeProvider
			theme={byMode(ctx, ctx.default)}
			children={props.children}
		/>;
	}



}