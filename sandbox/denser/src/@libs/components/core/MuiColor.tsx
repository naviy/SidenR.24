import { colors, styled, Theme } from "@mui/material";
import { Div as _Div, PrimitiveProps, Span as _Span } from "./primitives";






//===






export type MuiColor = (

	"common.black" | "common.white" |

	"disabled" | "disabled.text" | "disabled.background" |

	"primary" | "primary.light" | "primary.main" | "primary.dark" | "primary.contrastText" |
	"secondary" | "secondary.light" | "secondary.main" | "secondary.dark" | "secondary.contrastText" |
	"error" | "error.light" | "error.main" | "error.dark" | "error.contrastText" |
	"warning" | "warning.light" | "warning.main" | "warning.dark" | "warning.contrastText" |
	"info" | "info.light" | "info.main" | "info.dark" | "info.contrastText" |
	"success" | "success.light" | "success.main" | "success.dark" | "success.contrastText" |

	"text.primary" | "text.secondary" | "text.disabled" |
	"action.active" | "action.hover" | "action.selected" | "action.disabled" | "action.disabledBackground" | "action.focus" |
	"background.default" | "background.paper" |

	"amber" | "amber.50" | "amber.100" | "amber.200" | "amber.300" | "amber.400" | "amber.500" | "amber.600" | "amber.700" | "amber.800" | "amber.900" | "amber.A100" | "amber.A200" | "amber.A400" | "amber.A700" |
	"blue" | "blue.50" | "blue.100" | "blue.200" | "blue.300" | "blue.400" | "blue.500" | "blue.600" | "blue.700" | "blue.800" | "blue.900" | "blue.A100" | "blue.A200" | "blue.A400" | "blue.A700" |
	"blueGrey" | "blueGrey.50" | "blueGrey.100" | "blueGrey.200" | "blueGrey.300" | "blueGrey.400" | "blueGrey.500" | "blueGrey.600" | "blueGrey.700" | "blueGrey.800" | "blueGrey.900" | "blueGrey.A100" | "blueGrey.A200" | "blueGrey.A400" | "blueGrey.A700" |
	"brown" | "brown.50" | "brown.100" | "brown.200" | "brown.300" | "brown.400" | "brown.500" | "brown.600" | "brown.700" | "brown.800" | "brown.900" | "brown.A100" | "brown.A200" | "brown.A400" | "brown.A700" |
	"cyan" | "cyan.50" | "cyan.100" | "cyan.200" | "cyan.300" | "cyan.400" | "cyan.500" | "cyan.600" | "cyan.700" | "cyan.800" | "cyan.900" | "cyan.A100" | "cyan.A200" | "cyan.A400" | "cyan.A700" |
	"deepOrange" | "deepOrange.50" | "deepOrange.100" | "deepOrange.200" | "deepOrange.300" | "deepOrange.400" | "deepOrange.500" | "deepOrange.600" | "deepOrange.700" | "deepOrange.800" | "deepOrange.900" | "deepOrange.A100" | "deepOrange.A200" | "deepOrange.A400" | "deepOrange.A700" |
	"deepPurple" | "deepPurple.50" | "deepPurple.100" | "deepPurple.200" | "deepPurple.300" | "deepPurple.400" | "deepPurple.500" | "deepPurple.600" | "deepPurple.700" | "deepPurple.800" | "deepPurple.900" | "deepPurple.A100" | "deepPurple.A200" | "deepPurple.A400" | "deepPurple.A700" |
	"green" | "green.50" | "green.100" | "green.200" | "green.300" | "green.400" | "green.500" | "green.600" | "green.700" | "green.800" | "green.900" | "green.A100" | "green.A200" | "green.A400" | "green.A700" |
	"grey" | "grey.50" | "grey.100" | "grey.200" | "grey.300" | "grey.400" | "grey.500" | "grey.600" | "grey.700" | "grey.800" | "grey.900" | "grey.A100" | "grey.A200" | "grey.A400" | "grey.A700" |
	"indigo" | "indigo.50" | "indigo.100" | "indigo.200" | "indigo.300" | "indigo.400" | "indigo.500" | "indigo.600" | "indigo.700" | "indigo.800" | "indigo.900" | "indigo.A100" | "indigo.A200" | "indigo.A400" | "indigo.A700" |
	"lightBlue" | "lightBlue.50" | "lightBlue.100" | "lightBlue.200" | "lightBlue.300" | "lightBlue.400" | "lightBlue.500" | "lightBlue.600" | "lightBlue.700" | "lightBlue.800" | "lightBlue.900" | "lightBlue.A100" | "lightBlue.A200" | "lightBlue.A400" | "lightBlue.A700" |
	"lightGreen" | "lightGreen.50" | "lightGreen.100" | "lightGreen.200" | "lightGreen.300" | "lightGreen.400" | "lightGreen.500" | "lightGreen.600" | "lightGreen.700" | "lightGreen.800" | "lightGreen.900" | "lightGreen.A100" | "lightGreen.A200" | "lightGreen.A400" | "lightGreen.A700" |
	"lime" | "lime.50" | "lime.100" | "lime.200" | "lime.300" | "lime.400" | "lime.500" | "lime.600" | "lime.700" | "lime.800" | "lime.900" | "lime.A100" | "lime.A200" | "lime.A400" | "lime.A700" |
	"orange" | "orange.50" | "orange.100" | "orange.200" | "orange.300" | "orange.400" | "orange.500" | "orange.600" | "orange.700" | "orange.800" | "orange.900" | "orange.A100" | "orange.A200" | "orange.A400" | "orange.A700" |
	"pink" | "pink.50" | "pink.100" | "pink.200" | "pink.300" | "pink.400" | "pink.500" | "pink.600" | "pink.700" | "pink.800" | "pink.900" | "pink.A100" | "pink.A200" | "pink.A400" | "pink.A700" |
	"purple" | "purple.50" | "purple.100" | "purple.200" | "purple.300" | "purple.400" | "purple.500" | "purple.600" | "purple.700" | "purple.800" | "purple.900" | "purple.A100" | "purple.A200" | "purple.A400" | "purple.A700" |
	"red" | "red.50" | "red.100" | "red.200" | "red.300" | "red.400" | "red.500" | "red.600" | "red.700" | "red.800" | "red.900" | "red.A100" | "red.A200" | "red.A400" | "red.A700" |
	"teal" | "teal.50" | "teal.100" | "teal.200" | "teal.300" | "teal.400" | "teal.500" | "teal.600" | "teal.700" | "teal.800" | "teal.900" | "teal.A100" | "teal.A200" | "teal.A400" | "teal.A700" |
	"yellow" | "yellow.50" | "yellow.100" | "yellow.200" | "yellow.300" | "yellow.400" | "yellow.500" | "yellow.600" | "yellow.700" | "yellow.800" | "yellow.900" | "yellow.A100" | "yellow.A200" | "yellow.A400" | "yellow.A700" |

	string

);






//===






export function MuiColor(theme: Theme, color: MuiColor | null | undefined, mode?: MuiColor.Mode): string | undefined
{

	if (!color)
		return undefined;


	let converter = converters[color as string];

	if (!converter)
	{
		converters[color as string] = converter = createConverter(theme, color as string);
	}


	return converter(theme, mode);

}






type ColorConverter = (theme: Theme, mode: MuiColor.Mode | null | undefined) => string;


const converters: { [color: string]: ColorConverter } = {};






export function createConverter(defaultTheme: Theme, color: string): ColorConverter
{


	if (color === "disabled")
	{
		return theme => theme.palette.action.disabled;
	}



	let i = color.indexOf(".");

	if (i >= 0)
	{

		let color0 = color.substring(0, i);
		let mode = color.substring(i + 1);


		if (color0 === "disabled")
		{
			return theme => mode === "text" ? theme.palette.text.disabled : theme.palette.action.disabledBackground;
		}


		if ((defaultTheme.palette as any)[color0])
		{
			return theme => (theme.palette as any)[color0][mode];
		}





		let muiColor = (colors as any)[color0];

		if (muiColor)
		{
			return (/*theme*/) =>
			{

				//let mode2 = mode;

				//if (mode === "bg")
				//{
				//	mode2 = theme.palette.mode;
				//}
				//else  if (mode === "text")
				//{
				//	mode2 = theme.palette.mode === "light" ? "dark" : "light";
				//}

				return muiColor[mode/*mode2*/] as string;
			};
		}


		return () => color as string;

	}



	if ((defaultTheme.palette as any)[color])
	{

		return (theme, mode) =>
		{

			if (typeof mode === "function")
				return mode((theme.palette as any)[color].main, theme);

			if (!mode)
				return (theme.palette as any)[color].main;


			if (mode === "theme" || mode === "bg" /*|| mode === "bg.soft"*/)
			{
				mode = theme.palette.mode;
			}
			else if (mode === "text")
			{
				mode = theme.palette.mode === "light" ? "dark" : "light";
			}


			let color2 = (theme.palette as any)[color][mode];

			return color2;

		};

	}


	let muiColor = (colors as any)[color];

	if (muiColor)
	{

		return (theme, mode) =>
		{

			if (typeof mode === "function")
				return mode(muiColor["500"], theme);


			if (!mode)
				return muiColor["500"];


			if (mode === "theme" || mode === "bg")
			{
				mode = theme.palette.mode;
			}
			else if (mode === "text")
			{
				mode = theme.palette.mode === "light" ? "dark" : "light";
			}



			return muiColor[mode === "light" ? "200" : mode === "dark" ? "700" : mode] as string;

		};

	}


	return () => color as string;

}






//===






export module MuiColor
{



	//===






	export type Mode = "theme" | "text" | "bg" | /*"bg.soft" | */"light" | "main" | "dark" | "50" | "100" | "200" | "300" | "400" | "500" | "700" | "800" | "900" | "A100" | "A200" | "A400" | "A700" | ((color: string, theme: Theme) => string);






	//===






	export const Span = styled(
		_Span,
		{ shouldForwardProp: p => p !== "color" && p !== "mode" }
	)<
		PrimitiveProps<HTMLSpanElement> &
		{
			theme?: Theme;
			color: MuiColor;
			mode?: Mode;
		}
	>(
		({ theme, color, mode }) => ({
			color: `${MuiColor(theme, color, mode || "text")} !important`,

		})
	);






	export const Div = styled(
		_Div,
		{ shouldForwardProp: p => p !== "color" && p !== "mode" }
	)<
		PrimitiveProps<HTMLDivElement> &
		{
			theme?: Theme;
			color: MuiColor;
			mode?: Mode;
		}
	>(
		({ theme, color, mode }) => ({
			color: `${MuiColor(theme, color, mode || "text")} !important`,

		})
	);






	//===






	function createColorSpan(color: MuiColor, defaultMode?: Mode)
	{
		return styled(
			_Span,
			{ shouldForwardProp: p => p !== "mode" }
		)<
			PrimitiveProps<HTMLSpanElement> & {
				theme?: Theme;
				mode?: Mode;
			}
		>(
			({ theme, mode }) => ({
				color: `${MuiColor(theme, color, mode || defaultMode || "text")} !important`,

			})
		);
	}


	export const TextPrimary = createColorSpan("text" as any, "primary" as any);
	export const TextSecondary = createColorSpan("text" as any, "secondary" as any);
	export const TextDisabled = createColorSpan("text" as any, "disabled" as any);

	export const Disabled = createColorSpan("disabled");
	export const DisabledText = createColorSpan("disabled.text");
	export const DisabledBackground = createColorSpan("disabled.background");

	export const Primary = createColorSpan("primary");
	export const PrimaryLight = createColorSpan("primary", "light");
	export const PrimaryMain = createColorSpan("primary", "main");
	export const PrimaryDark = createColorSpan("primary", "dark");

	export const Secondary = createColorSpan("secondary");
	export const SecondaryLight = createColorSpan("secondary", "light");
	export const SecondaryMain = createColorSpan("secondary", "main");
	export const SecondaryDark = createColorSpan("secondary", "dark");

	export const Error = createColorSpan("error");
	export const ErrorLight = createColorSpan("error", "light");
	export const ErrorMain = createColorSpan("error", "main");
	export const ErrorDark = createColorSpan("error", "dark");

	export const Warning = createColorSpan("warning");
	export const WarningLight = createColorSpan("warning", "light");
	export const WarningMain = createColorSpan("warning", "main");
	export const WarningDark = createColorSpan("warning", "dark");

	export const Info = createColorSpan("info");
	export const InfoLight = createColorSpan("info", "light");
	export const InfoMain = createColorSpan("info", "main");
	export const InfoDark = createColorSpan("info", "dark");

	export const Success = createColorSpan("success");
	export const SuccessLight = createColorSpan("success", "light");
	export const SuccessMain = createColorSpan("success", "main");
	export const SuccessDark = createColorSpan("success", "dark");


	export const Amber = createColorSpan("amber");
	export const Blue = createColorSpan("blue");
	export const BlueGrey = createColorSpan("blueGrey");
	export const Brown = createColorSpan("brown");
	export const Cyan = createColorSpan("cyan");
	export const DeepOrange = createColorSpan("deepOrange");
	export const DeepPurple = createColorSpan("deepPurple");
	export const Green = createColorSpan("green");
	export const Grey = createColorSpan("grey");
	export const Indigo = createColorSpan("indigo");
	export const LightBlue = createColorSpan("lightBlue");
	export const LightGreen = createColorSpan("lightGreen");
	export const Lime = createColorSpan("lime");
	export const Orange = createColorSpan("orange");
	export const Pink = createColorSpan("pink");
	export const Purple = createColorSpan("purple");
	export const Red = createColorSpan("red");
	export const Teal = createColorSpan("teal");
	export const Yellow = createColorSpan("yellow");





	//===



}