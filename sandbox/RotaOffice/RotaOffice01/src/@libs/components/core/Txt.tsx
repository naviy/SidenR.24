import MuiDivider from "@mui/material/Divider";
import type { TypographyProps } from "@mui/material/Typography";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";






//===






export interface TxtProps extends TypographyProps
{

	//component?: React.ElementType;

	divider?: boolean;

}






export function Txt({ divider, ...props }: TxtProps)
{

	let body = <Typography {...props} />;


	if (divider)
	{
		body = <Txt.Divider textAlign="left" children={body} />;
	}


	return body;

}






export module Txt
{



	//===






	function text(variant: TxtProps['variant'], { divider, ...props }: TxtProps)
	{

		let body = <Typography variant={variant} {...props} />;


		if (divider)
		{
			body = <Divider textAlign="left" children={body} />;
		}


		return body;

	}






	export function H1(props: TxtProps)
	{
		return text('h1', props);
	}


	export function H2(props: TxtProps)
	{
		return text('h2', props);
	}


	export function H3(props: TxtProps)
	{
		return text('h3', props);
	}


	export function H4(props: TxtProps)
	{
		return text('h4', props);
	}


	export function H5(props: TxtProps)
	{
		return text('h5', props);
	}


	export function H6(props: TxtProps)
	{
		return text('h6', props);
	}


	export function Subtitle1(props: TxtProps)
	{
		return text('subtitle1', props);
	}


	export function Subtitle2(props: TxtProps)
	{
		return text('subtitle2', props);
	}


	export function Body1(props: TxtProps)
	{
		return text('body1', props);
	}


	export function Body2(props: TxtProps)
	{
		return text('body2', props);
	}


	export function Button(props: TxtProps)
	{
		return text('button', props);
	}


	export function Caption(props: TxtProps)
	{
		return text('caption', props);
	}


	export function Overline(props: TxtProps)
	{
		return text('overline', props);
	}






	//===






	export function LI(props: TxtProps)
	{
		return <Typography component="li" {...props} />;
	}






	//===






	export const Divider = styled(MuiDivider)({

		margin: '24px 0 12px 0',

		'&:first-of-type': {
			marginTop: 0,
		},

		'&:last-of-type': {
			marginBottom: 0,
		},


		'&::before': {
			width: 0,
		},

	});







	//===



}
