import { type ReactNode, useMemo, useRef } from 'react';
import { TransitionGroup } from 'react-transition-group';
import { $defaultAnimationDurationMs, Div, type DivProps, Expander } from '..';
import { FillSlide, type FillSlideAnimateProps } from './FillSlide';






//===






export function ValueSlider<TValue>({

	value,

	animateProps,

	vertical,
	dir,
	offset,
	//zoom,

	mountOnEnter,
	unmountOnExit,

	expander,

	children,

	...faderProps

}
	: ValueSlider.Props<TValue>
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



	// Для передачи новых свойств анимации старому FastSlide
	let animatePropsRef = useRef<FillSlideAnimateProps>({});


	Object.assignDefined(animatePropsRef.current, { vertical, dir, offset, /*zoom*/ });


	if (animateProps && value !== undefined)
	{
		let aprops = animateProps(value, oldValue);

		aprops && Object.assignDefined(animatePropsRef.current, aprops);

		if (expander === undefined && aprops && aprops.expander !== undefined)
		{
			expander = aprops.expander;
		}
	}


	let body = typeof children === 'function' ? children(value!, oldValue) : children;


	body = <Div relative {...faderProps}>

		<TransitionGroup>

			<FillSlide

				key={newKey}

				appear={!!oldKey}
				timeout={$defaultAnimationDurationMs}

				animateProps={animatePropsRef.current}

				flex={faderProps.flex}

				mountOnEnter={mountOnEnter !== false}
				unmountOnExit={unmountOnExit !== false}

				children={body}

			/>

		</TransitionGroup>

	</Div>;



	if (typeof expander === 'object')
	{
		body = <Expander {...expander} children={body} />;
	}
	else if (expander)
	{
		body = <Expander children={body} />;
	}



	return body;

}






export module ValueSlider
{


	export interface Props<TValue = any> extends Omit<DivProps, 'children'>, FillSlideAnimateProps
	{

		value?: TValue;

		animateProps?: (value: TValue, oldValue: TValue | undefined) => FillSlideAnimateProps & {
			expander?: boolean | Expander.Props;
		};

		mountOnEnter?: boolean;
		unmountOnExit?: boolean;

		expander?: boolean | Expander.Props;

		children: ReactNode | ((value: TValue, oldValue: TValue | undefined) => ReactNode);

	}



}
