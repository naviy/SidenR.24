import { styled } from '@mui/material';
import { useRef } from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';
import { $defaultAnimationDurationMs, DivProps, createPrimitive } from '../core';
import { Focuser } from "../flow-focuser";
import { TransitionProps } from "./TransitionProps";






//===






const Root = styled(
	"div",
	{
		name: 'fill-fade',
		shouldForwardProp: p => p !== 'status' && p !== 'timeout'
	}
)<{
	status: TransitionStatus;
	timeout: number;
}>(
	({ status, timeout }) => 
	{

		return ({

			flex: 1,
			display: "inherit",
			flexDirection: "inherit",
			gap: "inherit",

			...(status === 'exiting' || status === 'exited') &&
			{
				position: 'absolute',
				inset: '0 0 0 0',
			},


			...(status === 'exited' || status === 'unmounted') &&
			{
				visibility: 'hidden',
			},


			'> div': {

				flex: 1,
				display: "inherit",
				flexDirection: "inherit",
				gap: "inherit",

				transition: `opacity ${timeout}ms ease-out`,

				opacity: status === 'entering' || status === 'entered' ? 1 : 0,

			},

		});

	}

);







//===





export interface FillFadeProps extends TransitionProps, DivProps
{
	wrapperCls?: string;
}


const propNames: Array<keyof FillFadeProps> = [
	"wrapperCls",
	...TransitionProps.propNames
];



export function FillFade(props: FillFadeProps)
{

	let transitionProps = TransitionProps.extract(props);

	const nodeRef = useRef<any>();


	return (

		<Transition
			nodeRef={nodeRef}
			{...transitionProps as any}
			timeout={transitionProps.timeout ?? $defaultAnimationDurationMs}
		>
			{(status: TransitionStatus) =>

				createPrimitive(
					Root as any,
					{
						ref: nodeRef,
						status,
						timeout: transitionProps.timeout ?? $defaultAnimationDurationMs,

						children: (
							<Focuser ghost disabled={!transitionProps['in'] || status !== 'entered'}>
								<div className={props.wrapperCls}>{props.children}</div>
							</Focuser>
						),
					},
					props,
					propNames
				)

			}
		</Transition>

	);

}
