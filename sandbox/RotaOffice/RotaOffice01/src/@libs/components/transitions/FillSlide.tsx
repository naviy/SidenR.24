import { styled } from '@mui/material/styles';
import { useRef, type ReactNode } from 'react';
import { Transition, type TransitionStatus } from 'react-transition-group';
import { type TransitionProps } from 'react-transition-group/Transition';
import { $defaultAnimationDurationMs, Focuser } from '..';






//===






const Root = styled(
	'div',
	{
		name: 'fast-slide',
		shouldForwardProp: p => (
			p !== 'status' && p !== 'active' && p !== 'timeout' &&
			p !== 'animateProps' &&
			p !== 'flex'
		),
	}
)<{

	active: boolean;
	status: TransitionStatus;
	timeout: number;

	animateProps: FillSlideAnimateProps;

	flex: boolean | undefined;

}>(
	({ active, status, timeout, animateProps, flex }) => 
	{

		let dir = active ? !animateProps.dir : animateProps.dir;

		let soffset = typeof animateProps.offset === 'number' ? animateProps.offset + 'px' : animateProps.offset ?? '25%';

		//let transform1 = (animateProps.vertical
		//	? dir ? `translateY(${soffset})` : `translateY(-${soffset})`
		//	: dir ? `translateX(${soffset})` : `translateX(-${soffset})`
		//);


		//let nzoom = typeof animateProps.zoom === 'number' ? animateProps.zoom : animateProps.zoom ? .1 : 0;

		//let transform2 = !nzoom ? '' : dir ? ` scale(${1 + nzoom})` : ` scale(${1 - nzoom})`;


		let margin1 = (animateProps.vertical
			? dir ? `${soffset} 0 -${soffset} 0` : `-${soffset} 0 ${soffset} 0`
			: dir ? `0 ${soffset} 0 -${soffset}` : `0 -${soffset} 0 ${soffset}`
		);



		return ({
			...flex &&
			{
				display: 'flex',
				flex: 1,
			},

			...(status === 'exiting' || status === 'exited') &&
			{
				position: 'absolute',
				inset: '0 0 0 0',
			},

			padding: 1,
			margin: -1,

			//overflow: status === 'entered' ? 'visible' : 'hidden',


			...(status === 'exited' || status === 'unmounted') &&
			{
				visibility: 'hidden',
			},


			'> div': {

				transition: `all ${timeout}ms ease-out, opacity ${timeout}ms linear`,
				//transition: `all ${timeout}ms ease-out`,

				...(status === 'entering' || status === 'entered'
					? {
						opacity: 1,
						transform: 'none',
						margin: 0,
					}
					: {
						opacity: 0,
						//transform: transform1 + transform2,
						margin: margin1,
					}
				),

				...flex &&
				{
					display: 'flex',
					flex: 1,
					alignItems: 'center',
				},

			},

		});

	}

);







//===






export interface FillSlideAnimateProps
{

	vertical?: boolean;
	dir?: boolean | null;
	offset?: string | number,
	zoom?: boolean | number | null;

}






export function FillSlide({

	animateProps,

	vertical,
	dir,
	offset,
	zoom,

	flex,

	children,

	...transitionProps

}: Omit<TransitionProps, 'timeout'> & FillSlideAnimateProps & {

	timeout?: number;

	flex?: boolean;

	animateProps?: FillSlideAnimateProps;

	children?: ReactNode;

})
{

	const nodeRef = useRef<any>();


	if (animateProps === undefined)
	{
		animateProps = { vertical, dir, offset, zoom };
	}


	return (

		<Transition

			nodeRef={nodeRef}

			{...transitionProps as any}

		>
			{(status: TransitionStatus) =>

				<Root

					ref={nodeRef}

					active={transitionProps['in']}
					status={status}
					timeout={transitionProps.timeout ?? $defaultAnimationDurationMs}

					animateProps={animateProps!}

					flex={flex}

					children={
						<Focuser ghost disabled={!transitionProps['in'] || status !== 'entered'}>
							<div>{children}</div>
						</Focuser>
					}

				/>

			}
		</Transition>

	);

}
