import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";






//===






export function SpaWaitingMask()
{

	let isWaiting = SpaWaitingMask.use();

	return <SpaWaitingMask.Root waiting={isWaiting}>
		{isWaiting && <CircularProgress size="20vh" />}
	</SpaWaitingMask.Root>;

}




export module SpaWaitingMask
{


	//---



	export const waitingTimeoutMs = 300;


	export function isWaiting() { return _isWaiting; }

	let _isWaiting = false;
	let isWaitingSetter: ((value: boolean) => void) | null = null;

	let waitingTimerId: number;





	//---



	const onEffect = () => () => { isWaitingSetter = null };


	export function use(): boolean
	{

		const [__isWaiting, setIsWaiting] = useState(false);

		useEffect(onEffect, []);

		_isWaiting = __isWaiting;

		isWaitingSetter = setIsWaiting;

		return __isWaiting;

	}



	//---



	export function show()
	{
		clearTimeout(waitingTimerId);

		waitingTimerId = window.setTimeout(
			() => isWaitingSetter?.(true),
			waitingTimeoutMs
		);
	}


	export function hide()
	{
		clearTimeout(waitingTimerId);
		isWaitingSetter?.(false);
	}



	//---



	export const Root = styled(

		'div',
		{
			name: 'MethodCallingMask',
			shouldForwardProp: prop => prop !== 'waiting',
		}

	)<{

		waiting: boolean

	}>(

		({ theme, waiting }) =>
		({

			position: 'absolute',
			inset: 0,

			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',

			pointerEvents: 'none',
			zIndex: 0,

			background: 'transparent',
			opacity: 0,
			transition: 'all .3s linear',

			...waiting && {

				pointerEvents: 'all',

				background: theme.palette.mode === 'light' ? 'rgba(255,255,255,.7)' : theme.palette.action.disabledBackground,
				cursor: 'wait',

				opacity: 1,
				zIndex: 999999,

				transition: 'background 1s ease, opacity 1s linear',

			},

		})

	);



	//---


}
