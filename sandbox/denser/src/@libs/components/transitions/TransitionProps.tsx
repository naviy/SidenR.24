import { TransitionProps as TransitionProps_ } from 'react-transition-group/Transition';






export type TransitionProps = Omit<TransitionProps_, 'timeout'> & {

	timeout?: number;

};




export module TransitionProps
{


	export const propNames: Array<keyof TransitionProps> = [
		"in", "mountOnEnter", "unmountOnExit",
		"onEnter", "onEntering", "onEntered",
		"onExit", "onExiting", "onExited",
		"nodeRef", "timeout", "addEndListener",
	];


	export function extract(props: Readonly<Partial<TransitionProps>>): Readonly<Partial<TransitionProps>>
	{
		return Object.assignDefinedProps({}, props, ...propNames);
	}


}