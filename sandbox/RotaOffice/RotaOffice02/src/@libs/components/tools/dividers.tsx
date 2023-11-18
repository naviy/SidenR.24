import Divider, { type DividerProps as muiDividerProps, } from '@mui/material/Divider';
import { styled } from "@mui/material/styles";
import { Children, cloneElement, type ReactElement, type ReactNode } from 'react';
import { createOmiter } from "../core";






//===






export interface DividerProps extends muiDividerProps
{

	span?: boolean;

	m?: number;
	m1?: boolean;
	m2?: boolean;
	m3?: boolean;
	m4?: boolean;
	m5?: boolean;
	m6?: boolean;

}





module DividerProps
{


	export function getM(props: DividerProps)
	{
		return props.m ?? (props.m1 ? 1 : props.m2 ? 2 : props.m3 ? 3 : props.m4 ? 4 : props.m5 ? 5 : props.m6 ? 6 : undefined);
	}



	export const omiter = createOmiter<DividerProps>(
		"span",
		"m", "m1", "m2", "m3", "m4", "m5", "m6",
	);


}






//===






export function HR(props: DividerProps)
{
	return <DividerRoot
		component={props.span ? 'span' : undefined as any}
		m={DividerProps.getM(props)}
		{...DividerProps.omiter.omit(props)}
	/>;
}



export module HR
{

	export function Stack({ children, ...props }: DividerProps)
	{

		return joinReactNode(

			children,

			<DividerRoot
				component={props.span ? 'span' : undefined as any}
				m={DividerProps.getM(props)}
				{...DividerProps.omiter.omit(props)}
			/>

		);

	}

}




export function VR(props: DividerProps)
{

	return <DividerRoot
		component={props.span ? 'span' : undefined as any}
		orientation="vertical"
		m={DividerProps.getM(props)}
		{...DividerProps.omiter.omit(props)}
	/>;

}



export module VR
{

	export function Stack({ children, ...props }: DividerProps)
	{

		return joinReactNode(

			children,

			<DividerRoot
				component={props.span ? 'span' : undefined as any}
				orientation="vertical"
				m={DividerProps.getM(props)}
				{...DividerProps.omiter.omit(props)}
			/>

		);

	}

}






//===






const DividerRoot = styled(
	Divider,
	{ shouldForwardProp: p => p !== 'span' && p !== 'm' }
)<{
	span?: boolean;
	m?: number;
}>(

	({ span, m, orientation }) =>
	{

		if (m === undefined)
			m = span ? 1 : 0;


		if (span !== true && !m)
			return {};




		return {

			display: span ? 'inline' : 'block',


			...orientation !== 'vertical' && {

				marginTop: m * 8,
				marginBottom: m * 8 - 1,

			},


			...orientation === 'vertical' && {

				...!span && {
					height: 'auto',
				},

				marginLeft: m * 8,
				marginRight: m * 8 - 1,
			},

		};

	}

);






//===






export function joinReactNode(children: ReactNode, separator: ReactElement) 
{

	if (!children)
		return null;


	const childrenArray = Children.toArray(children).filter(Boolean);


	if (!childrenArray.length)
		return null;



	let result: ReactNode[] = [];


	childrenArray.forEach((child, index) =>
	{

		index > 0 && result.push(
			cloneElement(separator, { key: `$$separator-${index}` })
		);


		if (typeof child === "string")
		{
			child = <span key={index}>{child}</span>
		}


		result.push(child);

	});


	return <>{result}</>;

}
