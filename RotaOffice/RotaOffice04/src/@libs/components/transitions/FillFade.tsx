import { styled } from "@mui/material/styles";
import { useRef } from 'react';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { $defaultAnimationDurationMs, $log, createPrimitive, type DivProps } from '../core';
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





export interface FillFadeProps extends TransitionProps
{
	wrapperCls?: string;
}


const propNames: PropNames<FillFadeProps> =
{
	wrapperCls: true,
	...TransitionProps.propNames
};



export function FillFade(props: FillFadeProps & DivProps)
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
							<Focuser
								ghost
								name="FillFade"
								disabled={!transitionProps.in || status !== 'entered'}
							>
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
