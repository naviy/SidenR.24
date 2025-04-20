import type { PaletteMode, Theme } from "@mui/material";
import { createTheme, ThemeProvider, type ThemeOptions } from "@mui/material/styles";
import { type ReactNode } from "react";






//===






class AppThemesClass
{

	//---



	#default: PaletteMode = 'light';
	#navigation: PaletteMode = 'dark';

	#lightTheme?: Theme;
	#darkTheme?: Theme;


	get default() { return this.#default; }
	get navigation() { return this.#navigation; }

	get ligthTheme() { return this.#lightTheme ??= createTheme(); }
	get darkTheme() { return this.#darkTheme ??= createTheme({ palette: { mode: "dark" } }); }



	//---



	init(cfg: {

		default?: PaletteMode;
		navigation?: PaletteMode;

		lightTheme?: ThemeOptions;
		darkTheme?: ThemeOptions;

	})
	{

		if (cfg.default != null)
			this.#default = cfg.default;

		if (cfg.navigation != null)
			this.#navigation = cfg.navigation;

		if (cfg.lightTheme != null)
			this.#lightTheme = createTheme(cfg.lightTheme);

		if (cfg.darkTheme != null)
			this.#darkTheme = createTheme(cfg.darkTheme);

	}



	//---



	byMode(mode: PaletteMode)
	{
		return mode === 'dark' ? this.darkTheme : this.ligthTheme;
	}




	Dark(props: { children: ReactNode })
	{
		return <ThemeProvider
			theme={AppThemes.darkTheme}
			children={props.children}
		/>;
	}


	Light(props: { children: ReactNode })
	{
		return <ThemeProvider
			theme={AppThemes.ligthTheme}
			children={props.children}
		/>;
	}



	Navigation(props: { children: ReactNode })
	{

		return <ThemeProvider
			theme={AppThemes.byMode(AppThemes.navigation)}
			children={props.children}
		/>;

	}


	Default(props: { children: ReactNode })
	{
		return <ThemeProvider
			theme={AppThemes.byMode(AppThemes.default)}
			children={props.children}
		/>;
	}



	//---

}





export var AppThemes = new AppThemesClass();