import { styled } from "@mui/material/styles";
import React from 'react';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { $defaultAnimationDurationMs, createPrimitive, type DivProps } from '../core';
import { Focuser } from "../flow-focuser";
import { TransitionProps } from "./TransitionProps";






//===






export interface FillFadeProps extends TransitionProps
{
	autoFocus?: boolean;
	root?: boolean;
	wrapperCls?: string;
}


const propNames: PropNames<FillFadeProps> =
{
	autoFocus: true,
	root: true,
	wrapperCls: true,

	...TransitionProps.propNames
};



export function FillFade(props: FillFadeProps & DivProps)
{

	let transitionProps = TransitionProps.extract(props);

	var nodeRef = React.useRef<HTMLDivElement>(null);


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
							<FadeFocuser
								id={transitionProps.id}
								disabled={!transitionProps.in || status !== "entered"}
								autoFocus={props.autoFocus}
								root={props.root}
							>
								<div className={props.wrapperCls}>
									{props.children}
								</div>
							</FadeFocuser>
						),
					},
					props,
					propNames
				)

			}
		</Transition>

	);

}




function FadeFocuser(props: {

	id?: string;

	disabled?: boolean;

	autoFocus?: boolean;
	root?: boolean;

	children?: React.ReactNode;

})
{

	var ff = Focuser.useGhost({
		name: `FillFade${props.id ? "#" + props.id : ""}`,
		disabled: props.disabled,
		root: props.root,
	});


	React.useEffect(() =>
	{
		if (props.autoFocus && !props.disabled)
		{
			ff.focusAutoFocusItem();
		}
	});


	return (
		<Focuser.Area ff={ff}>
			{props.children}
		</Focuser.Area>
	);
}






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