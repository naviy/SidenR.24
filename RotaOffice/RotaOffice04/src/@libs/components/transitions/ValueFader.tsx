/* eslint-disable react-hooks/rules-of-hooks */


import { type ReactNode, useMemo, useRef } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { $defaultAnimationDurationMs, Div, type DivProps, Expander } from '..';
import { FillFade } from './FillFade';






//===






const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export interface ValueFaderProps<TValue = any> extends Omit<DivProps, 'children'>
{

	value: TValue;

	animateProps?: (value: TValue, oldValue: TValue | undefined) => {
		expander?: boolean | Expander.Props;
	};

	mountOnEnter?: boolean;
	unmountOnExit?: boolean;

	expander?: boolean | Expander.Props;

	children: ReactNode | ((value: TValue, oldValue: TValue | undefined) => ReactNode);

}




export function ValueFader<TValue>({

	value,
	animateProps,

	mountOnEnter,
	unmountOnExit,

	expander,

	children,


	flex,
	...faderProps

}
	: ValueFaderProps<TValue>
)
{

	let oldKeyRef = useRef(0);
	let oldValueRef = useRef<TValue | undefined>();


	let newKey = useMemo(
		() => oldKeyRef.current + 1,
		[value]
	);


	let oldKey = 0;
	let oldValue: TValue | undefined = undefined;


	if (newKey !== oldKeyRef.current)
	{
		oldKey = oldKeyRef.current;
		oldKeyRef.current = newKey;

		oldValue = oldValueRef.current;
		oldValueRef.current = value;
	}



	if (animateProps && value !== undefined)
	{
		let aprops = animateProps(value, oldValue);

		if (expander === undefined && aprops && aprops.expander !== undefined)
		{
			expander = aprops.expander;
		}
	}



	let body = typeof children === 'function' ? children(value!, oldValue) : children;


	body = <Div relative {...faderProps}>

		<TransitionGroup>

			<FillFade

				key={newKey}

				in={true}

				appear={!!oldKey}
				timeout={$animationDurationMs}

				flex={flex}

				mountOnEnter={mountOnEnter !== false}
				unmountOnExit={unmountOnExit !== false}

				children={body}

			/>

		</TransitionGroup>

	</Div>;



	if (typeof expander === 'object')
	{
		body = <Expander id="ValueFader" {...expander} children={body} />;
	}
	else if (expander)
	{
		body = <Expander id="ValueFader" children={body} />;
	}



	return body;

}






export module ValueFader
{


	export type Props<TValue = any> = ValueFaderProps<TValue>;


}