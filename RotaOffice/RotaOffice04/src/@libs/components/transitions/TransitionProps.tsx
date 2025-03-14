import type { TransitionProps as TransitionProps_ } from 'react-transition-group/Transition';






export type TransitionProps = Omit<TransitionProps_, 'timeout'> & {

	timeout?: number;

};




export module TransitionProps
{


	export var propNames: PropNames<TransitionProps> =
	{
		in: true,
		mountOnEnter: true,
		unmountOnExit: true,
		onEnter: true,
		onEntering: true,
		onEntered: true,
		onExit: true,
		onExiting: true,
		onExited: true,
		nodeRef: true,
		timeout: true,
		addEndListener: true,
	};


	export function extract(props: Readonly<Partial<TransitionProps>>): Readonly<Partial<TransitionProps>>
	{
		return PropNames.assignDefinedProps({}, props, propNames);
	}


}