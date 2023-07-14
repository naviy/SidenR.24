import { styled } from '@mui/material';
import { ReactNode } from 'react';

import { createPrimitive, PrimitiveProps } from '../core';
import { BgColor as PaneBgColor } from './BgColor';
import { Container } from './Container';




//===




export interface PaneProps extends PrimitiveProps<HTMLDivElement>
{

	start?: boolean;
	end?: boolean;

	bgcolor?: PaneBgColor;
	borderRadius?: number | boolean;
	borderWidth?: number | boolean;

	className?: string;

	children?: ReactNode;

}


const panePropNames: Array<keyof PaneProps> = [
	'bgcolor', 'borderRadius', 'borderWidth'
	//'model', 'ff', 'g', 's', 'w', 'min', 'max',
];




export function Pane(props: PaneProps)
{

	let cprops = Container.use() || {};

	let { dense, denseLeft, denseRight, denseTop, denseBottom, } = cprops;

	let isRow = cprops.dir === 'row';
	let isCol = cprops.dir === 'col';

	let { start, end } = props;


	let br = props.borderRadius !== undefined ? props.borderRadius : cprops.borderRadius;
	let br2 = br === true || br === undefined ? '12px' : br === false || br === null ? '0' : `${br}px`;

	let borderRadius = ([
		start && !denseLeft && !denseTop && !dense ? br2 : '0',
		(isRow && end || isCol && start) && !denseRight && !denseTop && !dense ? br2 : '0',
		end && !denseRight && !denseBottom && !dense ? br2 : '0',
		(isRow && start || isCol && end) && !denseLeft && !denseBottom && !dense ? br2 : '0',
	].join(' '));


	let bw = props.borderWidth !== undefined ? props.borderWidth : cprops.borderWidth;
	let bw2 = bw === true || bw === undefined ? '2px' : bw === false || bw === null ? '0' : `${bw}px`;

	let borderWidth = ([
		denseTop || dense ? '0' : bw2,
		denseRight || dense ? '0' : bw2,
		denseBottom || dense ? '0' : bw2,
		denseLeft || dense ? '0' : bw2,
	].join(' '));


	let body = createPrimitive(
		Pane.Root as any,
		{
			className: props.className,
			bgcolor: props.bgcolor,
			borderRadius,
			borderWidth,
			//w, min, max,
			children: props.children
		},
		props,
		panePropNames
	);


	return body;


}




export module Pane
{


	//---



	export type BgColor = PaneBgColor;
	export const BgColor = PaneBgColor;

	export const Col = Container.Col;
	export const Row = Container.Row;



	//---



	export const Root = styled(
		'div',
		{ shouldForwardProp: p => p !== 'bgcolor' && p !== 'borderRadius' && p !== 'borderWidth' }
	)<{

		bgcolor?: Pane.BgColor;
		borderRadius: string;
		borderWidth: string;

	}>((props) => ({

		flex: 1,

		background: Pane.BgColor(props.theme, props.bgcolor),
		borderRadius: props.borderRadius,
		borderWidth: props.borderWidth,

	}));



	//---


}
