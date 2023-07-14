/* eslint-disable react-hooks/rules-of-hooks */
import { createContext, ReactNode, useContext, useRef } from "react";
import { createPrimitive, PrimitiveProps } from "../core";
import { BgColor } from "./BgColor";




export interface ContainerProps
{

	dense?: boolean;
	denseLeft?: boolean;
	denseRight?: boolean;
	denseTop?: boolean;
	denseBottom?: boolean;

	bgcolor?: BgColor;

	borderRadius?: number | boolean;

	borderWidth?: number | boolean;


}


const containerPropNames: Array<keyof ContainerProps> = [
	'dense', 'denseLeft', 'denseRight', 'denseTop', 'denseBottom',
	'bgcolor', 'borderRadius', 'borderWidth'
	//'model', 'ff', 'g', 's', 'w', 'min', 'max',
];




export module Container
{


	//---



	export interface ContainerInfo extends ContainerProps
	{
		dir?: 'col' | 'row';
	}



	export const Context = createContext<ContainerInfo | null>(null);


	export function use()
	{
		return useContext(Container.Context);
	}



	export function useProvider(dir: ContainerInfo['dir'], props: ContainerProps, children: ReactNode)
	{

		let parentProps = use();


		let valueRef = useRef<ContainerInfo | null>();

		if (valueRef.current == null)
		{
			valueRef.current = { dir};
		}


		let v0 = valueRef.current;
		let v: ContainerInfo = { dir };

		function appendContainerProps(props: ContainerProps)
		{
			for (let prop of containerPropNames)
			{
				if (props[prop] !== undefined)
				{
					(v as any)[prop] = props[prop];
				}
			}
		}


		parentProps && appendContainerProps(parentProps);
		appendContainerProps(props);


		for (let prop of containerPropNames)
		{
			if (v[prop] !== v0[prop])
			{
				valueRef.current = v;
				break;
			}
		}


		return <Context.Provider
			value={valueRef.current}
			children={children}
		/>;

	}



	//---



	export function Col(props: Omit<ContainerProps, 'denseTop' | 'denseBottom'> & PrimitiveProps<HTMLDivElement>)
	{
		return useProvider(
			'col',
			props,
			createPrimitive('div', { className: 'vflex' }, props, containerPropNames)
		);
	}



	export function Row(props: Omit<ContainerProps, 'denseLeft' | 'denseRight'> & PrimitiveProps<HTMLDivElement>)
	{
		return useProvider(
			'row',
			props,
			createPrimitive('div', { className: 'flex' }, props, containerPropNames)
		);
	}



	//---


}
