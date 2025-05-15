import GlobalStyles from "@mui/material/GlobalStyles";
import React from "react";
import { $defaultAnimationDurationMs, $log, adelay } from "../core";
import type { Focuser } from "./ff.Focuser";






//===






//let _animationFrameHandle: number | null;


let _focusers: Focuser[] = [];
let _focusersMustResort: boolean;
let _positionedFocusers: Focuser[] = [];

//let _hoveringFocuser: Focuser = null;
let _modalFocusers: Focuser[] = [];
let _rootFocusers: Focuser[] = [];
let _rootFocuser: Focuser | null = null;

let _currentFocuser: Focuser | null = null;


export var _priorRenderedFocuser: Focuser | null = null;

export function setPriorRenderedFocuser(value: Focuser | null)
{
	_priorRenderedFocuser = value;
}


let _started: boolean = false;


export var $min_priority = 0;


export var useWASD = false;



//export var $useHoveringFocuser = true;

//export var $hoveringFocuserDisabled = false;






//===






export function runCore()
{

	if (!_rootFocuser)
		throw new Error(`Не объявлен корневой <Focuser root />`);


	//*startRefresh();

	removeEvents();
	addEvents();

	_started = true;

}



export function stopCore()
{
	removeEvents();
}




function addEvents()
{

	document.addEventListener("click", onClick, false);
	document.addEventListener("contextmenu", onContextMenu, false);
	document.addEventListener("keydown", onKeyDown, false);

	document.addEventListener("visibilitychange", onDocumentVisibilityChange, false);
	document.addEventListener("pointerdown", onDocumentPointerDown, true);
	window.addEventListener("blur", onWindowBlur, false);
	window.addEventListener("focus", onWindowFocus, false);

}


function removeEvents()
{

	document.removeEventListener("click", onClick);
	document.removeEventListener("contextmenu", onContextMenu);
	document.removeEventListener("keydown", onKeyDown);

	document.removeEventListener("visibilitychange", onDocumentVisibilityChange);
	document.removeEventListener("pointerdown", onDocumentPointerDown);
	window.removeEventListener("blur", onWindowBlur);
	window.removeEventListener("focus", onWindowFocus);

}






//===






export function coreMountFocuser(ff: Focuser)
{

	if (!ff)
		return;


	_focusers.push(ff);

	if (ff.isPositioned)
		_positionedFocusers.push(ff);

	_focusersMustResort = true;


	if (ff.modal && _modalFocusers.register(ff))
	{
		refreshModalFocusers();
	}


	if (ff.isRoot && _rootFocusers.register(ff))
	{
		refreshRootFocusers();
	}

}



export function coreUnmountFocuser(ff: Focuser)
{

	//unhoverFocuser(ff);


	if (_rootFocusers.remove(ff))
	{
		refreshRootFocusers();
	}


	if (_modalFocusers.remove(ff))
	{
		refreshModalFocusers();
	}


	if (_currentFocuser === ff)
	{
		$log("unmount Current Focuser()");
		$log._("ff:", ff);
		_currentFocuser = null;
	}


	if (_priorRenderedFocuser === ff)
	{
		_priorRenderedFocuser = null;
	}


	_positionedFocusers.remove(ff);
	_focusers.remove(ff);


}



function prepareFocusers()
{

	if (!_focusersMustResort)
		return;


	//$logb("prepareFocusers", () =>
	//{
	//	$logb("before:", () => _focusers.map(a => $log(a)));

	//	_focusers.sort((a, b) => a.level < b.level ? 1 : a.level > b.level ? -1 : 0);

	//	$logb("after:", () => _focusers.map(a => $log(a)));
	//});

	//_focusers.sort((a, b) => a.level < b.level ? 1 : a.level > b.level ? -1 : 0);


	_focusers.sort((a, b) => b.id - a.id);


	_focusersMustResort = false;

}




export function focusers()
{
	return _focusers;
}



export function positionedFocusers()
{
	return _positionedFocusers;
}



export function focuserById(id: number | null | undefined)
{
	return id ? _focusers.find(a => a.id === id) : null;
}




export function refreshModalFocusers()
{
	//$log("refreshModalFocusers");

	$min_priority = -Infinity;


	for (let ff of _modalFocusers)
	{
		if (!ff.deleting && ff.enabled)
		{
			$min_priority = ff.priority;
		}
	}

	//$log("set $min_priority:", $min_priority);
}



function refreshRootFocusers()
{

	_rootFocuser = _rootFocusers[0];

	//let max: Focuser | null = null;
	//let maxRoot = -Infinity;


	//for (let ff of _rootFocusers)
	//{
	//	if (ff.root > maxRoot)
	//	{
	//		max = ff;
	//		maxRoot = ff.root;
	//	}
	//}


	//_rootFocuser = max;

}






//===






//export function hoveringFocuser()
//{
//	return _hoveringFocuser;
//}



//export function hoverFocuser(ff: Focuser)
//{
//	//$log("hover:", next);
//	_hoveringFocuser = ff;
//}



//export function unhoverFocuser(next: Focuser)
//{
//	if (_hoveringFocuser === next)
//	{
//		//$log("unhover:", next);
//		_hoveringFocuser = null;
//		return true;
//	}
//	return false;
//}






//===






export function currentFocuser()
{
	return _currentFocuser;
}


//export function priorFocuserPosition()
//{
//	let pff = focuserById(_priorFocuserId);

//	return pff?.caret.recalcPosition() || null;
//}






//===












export interface FocusConfig
{

	outer?: boolean;

	focusFirst?: boolean;
	focusLast?: boolean;

	domFocus: boolean | "fast" | "lazy";

	enter?: boolean;

	/** Автоматически переходить на указанный focuser при выходе. Если exitTarget=true, то используется текущий */
	exitTarget?: Focuser | true | null;

	skipIfItemFocused?: boolean;


	/** Вернуть результирующий focuser, не дожидаясь завершения анимации */
	awaitImmidiate?: boolean;

}




const _focusSteps: { next: Focuser | null, focusCfg?: FocusConfig | null }[] = [];
let _isFocusing: boolean;
//let _focuserFocusTimer = 0;




export function focuserFocus(next: Focuser | null, focusCfg?: FocusConfig | null)
{
	//_$log("focuserFocus");


	if (!_isFocusing)
	{

		_isFocusing = true;


		try
		{
			focuserFocusStep(next, focusCfg, true);
			next?.scrollIntoView();
		}
		catch (ex)
		{
			_isFocusing = false;
			$log.error(ex);
		}


		window.setTimeout(

			() =>
			{

				try
				{
					let last: Focuser | null = null;

					while (_focusSteps.length)
					{
						let step = _focusSteps.shift()!;

						let mustRepaint = true;//!_focusSteps.length;

						focuserFocusStep(step.next, step.focusCfg, mustRepaint);

						last = step.next ?? last;
					}


					last?.scrollIntoView();

				}
				finally
				{
					_isFocusing = false;
				}

			},

			50

		);


		return true;

	}

	else
	{

		_focusSteps.push({ next, focusCfg });


		//while (_focusSteps.length > 1)
		//{
		//	let step = _focusSteps.shift()!;

		//	focuserFocusStep(step.next, step.focusCfg, false);
		//}


		return false;

	}

}


//export function focuserFocus(next: Focuser | null, focusCfg?: FocusActionProps | null): boolean
//{
//	//_$log("focuserFocus");

//	_focusSteps.push({ next, focusCfg });


//	if (_isFocusing)
//		return false;

//	try
//	{
//		_isFocusing = true;


//		while (_focusSteps.length)
//		{
//			let step = _focusSteps.shift()!;

//			let mustRepaint = !_focusSteps.length;

//			focuserFocusStep(step.next, step.focusCfg, mustRepaint);
//		}
//	}
//	finally
//	{
//		_isFocusing = false;
//	}


//	return true;

//}




function focuserFocusStep(
	next: Focuser | null,
	focusCfg: FocusConfig | null | undefined,
	mustRepaint: boolean
)
{

	//$log.b("focuserFocusStep()", () =>
	//{

	let prior = _currentFocuser;


	//$log("prior:", prior);
	//$log("next:", next);



	if (prior === next || next?.disabled)
		return;


	let willUnfocus: Focuser[] = [];
	let willFocus: Focuser[] = [];
	let willItemUnfocus: Focuser[] = [];
	let willItemFocus: Focuser[] = [];
	let confirmFocus: Focuser[] = [];



	if (prior)
	{

		prior.caret?.recalcPosition();


		let parent: Focuser | null = prior;

		while (parent)
		{
			willUnfocus.push(parent);
			parent = parent.parent;
		}
	}


	//$log("willUnfocus0:", willUnfocus.map(a => a.el));


	if (next)
	{

		let parent: Focuser | null = next;

		while (parent)
		{

			if (willUnfocus.remove(parent))
			{
				confirmFocus.push(parent);
			}
			else
			{
				willFocus.push(parent);
			}

			parent = parent.parent;

		}

	}


	//$log("willUnfocus:", willUnfocus.map(a => a.toString()));
	//$log("willFocus:", willFocus.map(a => a.toString()));
	//$log("confirmFocus:", confirmFocus.map(a => a.toString()));

	//$log("willUnfocus:", willUnfocus.map(a => a.el));
	//$log("willFocus:", willFocus.map(a => a.el));
	//$log("confirmFocus:", confirmFocus.map(a => a.el));


	for (let i = willUnfocus.length - 1; i >= 0; i--)
	{
		setItemFocused(willUnfocus[i], false);
	}


	if (prior)
	{
		prior.focused = false;
		//$log("focused = false", prior);
	}


	if (next)
	{
		next.focused = true;
		//$log("focused = true", next);
	}



	_currentFocuser = next;



	for (let a of confirmFocus)
	{
		setItemFocused(a, a !== next);
	}


	for (let a of willFocus)
	{
		setItemFocused(a, a !== next);
	}



	function setItemFocused(ff: Focuser, value: boolean)
	{

		if (ff.itemFocused === value)
			return;


		if (value)
			willItemFocus.push(ff);
		else
			willItemUnfocus.push(ff);


		ff.itemFocused = value;

	}



	//AnimationFrame.beginUpdate();


	try
	{
		//requestAnimationFrame(() =>
		//{

		//console.time("animate FF");

		for (let a of willItemUnfocus)
		{
			a.onItemUnfocus(prior, next);
		}

		for (let a of willItemFocus)
		{
			a.onItemFocus(prior, next);
		}


		for (let a of confirmFocus)
		{
			a.onChangeItemFocus(prior, next, /*mustRepaint*/willUnfocus.indexOf(a) < 0 && willFocus.indexOf(a) < 0);
		}

		for (let a of willUnfocus)
		{
			a.onUnfocus(prior, next, /*mustRepaint*/willFocus.indexOf(a) < 0);
		}

		for (let a of willFocus)
		{
			a.onFocus(prior, next, focusCfg, mustRepaint);
		}

		//console.timeEnd("animate FF");

		//});
	}
	finally
	{
		//AnimationFrame.endUpdate();
	}

	//	$log("END focuserFocusStep");
	//});

}




//export module AnimationFrame
//{


//	const actions0: Array<() => void> = [];
//	const actions1: Array<() => void> = [];



//	export function beginUpdate()
//	{
//		actions0.length = 0;
//		actions1.length = 0;
//	}


//	export function request0(frameAction: () => void)
//	{
//		actions0.push(frameAction);
//	}

//	export function request1(frameAction: () => void)
//	{
//		actions1.push(frameAction);
//	}


//	export function endUpdate()
//	{

//		if (actions0.length)
//		{
//			requestAnimationFrame(() => actions0.forEach(a => a()));
//		}


//		if (actions1.length)
//		{
//			setTimeout(() =>
//				requestAnimationFrame(() => actions1.forEach(a => a())),
//				50
//			);
//		}

//	}

//}







export var unfocus = (function unfocus()
{
	focuserFocus(null);
});



export var unfocusEvent = (function unfocusEvent(e: Event)
{
	e?.stopPropagation();
	focuserFocus(null);
});



//export function $focus(
//	model: IObserveModel,
//	//focusCfg?: FocusActionProps | null,
//	listenerFilter?: (listener: IObserveListener) => boolean
//)
//{

//	//$log("model:", model);
//	//$log("listeners:", model?.$observer?.listeners);
//	//$log("listeners.dom:", model?.$observer?.listeners.map(a => ReactDOM.findDOMNode(a.listener)));


//	let listener = model?.$observer?.listeners?.find(ls =>
//		ls?.listener?.focus && (!listenerFilter || listenerFilter(ls.listener))
//	);


//	//$log("listener:", listener);

//	//$log("ls.listener:", ReactDOM.findDOMNode(ls.listener));


//	return listener?.listener?.focus!(/*focusCfg*/);

//}






//===







//let _freezed = false;
let _freezingCount = 0;



export function isFreezed(): boolean
{
	return /*_freezed ||*/ !!_freezingCount;
}



export async function freeze(delay: number = 250)
{


	beginFreeze();

	await adelay(delay);

	endFreeze();

}



export async function freezeWhile<T>(action: () => Promise<T>): Promise<T>
{

	let result: T | undefined = undefined;


	beginFreeze();

	try
	{
		result = await action();
	}
	finally
	{
		endFreeze();
	}


	return result;

}



export function beginFreeze()
{
	//$log("beginFreeze");
	_freezingCount++;
}



export function endFreeze()
{
	//$log("endFreeze");
	_freezingCount--;
}






//===





//let _disabledFocusOnUnmount = 0;



//export function isDisabledFocusOnUnmount(): boolean
//{
//	return !!_disabledFocusOnUnmount;
//}




//export async function focusAfter<T>(action: () => Promise<T>, focus: () => Promise<Focuser>): Promise<T>
//{

//	let result: T | undefined = undefined;


//	_disabledFocusOnUnmount++;


//	try
//	{

//		result = await action();

//		await focus();

//	}
//	finally
//	{
//		_disabledFocusOnUnmount--;

//		if (_disabledFocusOnUnmount < 0)
//			_disabledFocusOnUnmount = 0;
//	}


//	return result;

//}






//===




// #region Отменяем первый onClick по неактивному окну



let windowIsActive = true;
let windowFocusedTime = performance.now();



function onDocumentVisibilityChange()
{
	if (document.visibilityState === 'hidden')
	{
		//$log("document.hidden");
		windowIsActive = false;
	}
}

function onWindowBlur()
{
	//$log("onWindowBlur");
	windowIsActive = false;
}

function onWindowFocus()
{
	//$log("onWindowFocus");
	windowIsActive = true;
	windowFocusedTime = performance.now();
}


function onDocumentPointerDown(e: Event)
{

	//$log("onDocumentPointerDown");
	var now = performance.now();
	var cameFromInactive = !windowIsActive || (now - windowFocusedTime < 50);

	//$log._("cameFromInactive:", cameFromInactive);
	//$log.__("windowIsActive:", windowIsActive);
	//$log.__("now:", now);
	//$log.__("windowFocusedTime:", windowFocusedTime);
	//$log.__("now - windowFocusedTime:", now - windowFocusedTime);


	windowIsActive = true;
	windowFocusedTime = performance.now();


	if (cameFromInactive)
	{
		function blockClick(ee: Event)
		{
			//$log("blockClick");
			ee.stopImmediatePropagation(); // до остальных слушателей не дойдёт
			ee.preventDefault();           // не будет перехода по ссылкам, фокуса и т.-д.
			document.removeEventListener('click', blockClick, true);
		};

		document.addEventListener('click', blockClick, true); // capture = true
	}

}



//var lastFocusTs = performance.now();


//function onWindowFocus(e: FocusEvent)
//{
//	lastFocusTs = performance.now();
//	$log("onWindowFocus");
//	$log._("lastFocusTs:", lastFocusTs);
//}



//function onWindowPointerDown(e: FocusEvent)
//{

//	var now = performance.now();

//	// 50 мс обычно хватает: focus приходит первым, затем pointerdown в той же серии событий
//	var justRegainedFocus = now - lastFocusTs < 50;

//	$log("onWindowPointerDown");
//	$log._("now:", now);
//	$log.__("lastFocusTs:", lastFocusTs);
//	$log.__("now - lastFocusTs:", now - lastFocusTs);
//	$log._("justRegainedFocus:", justRegainedFocus);


//	if (justRegainedFocus)
//	{
//		e.preventDefault();
//		e.stopImmediatePropagation();
//	}

//}


// #endregion



var lastClickTimeStamp: number;


var onClick = (async function onClick(e: MouseEvent)
{

	if (!_started)
		return;


	//$log("e:", e);
	if (!e.x && !e.y)
		return;


	if ((e as any)["explicitOriginalTarget"] && (e as any)["explicitOriginalTarget"] !== e.target)
		return;


	//$log("lastClickTimeStamp:", lastClickTimeStamp);
	//$log("e.timeStamp:", e.timeStamp);
	if (lastClickTimeStamp === e.timeStamp)
		return;

	//$log("ONCLICK")

	lastClickTimeStamp = e.timeStamp;


	prepareFocusers();



	(async () =>
	{
		//await $log.b("ff.Core.onClick", async () =>
		//{
		//	$log("focusers:", _focusers);
		//	$log("e:", e);

		for (let ff of _focusers)
		{

			if (e.cancelBubble)
				return;
			//$log("ff:", ff);
			//$log._("ff.canClick():", ff.canClick());
			if (!ff.canClick())
				continue;


			let el = ff.el;

			//$log._("e.target:", e.target);
			//$log.__("el:", el);
			//$log.__("el !== e.target:", el !== e.target);
			//$log.__("!el.contains(e.target as Node):", !el?.contains(e.target as Node));

			if (!el || el !== e.target && !el.contains(e.target as Node))
				continue;


			if (await ff.onClick(e))
				break;

		}
		//});
	})();

});




async function onContextMenu(e: MouseEvent)
{

	if (!_started)
		return;


	//$log("e:", e);

	prepareFocusers();


	//$log("_focusers:", _focusers);
	//$log("e.target:", e.target);


	for (let ff of _focusers)
	{

		if (e.cancelBubble)
			return;


		//$log("ff:", ff);
		//$log("ff.canContextMenu():", ff.canContextMenu());
		if (!ff.canContextMenu())
			continue;


		let el = ff.el;
		//$log("el:", el);
		//$log("el !== e.target:", el !== e.target);
		if (el && el !== e.target && !el.contains(e.target as Node))
			continue;


		//$log("ff:", ff);
		if (await ff.onContextMenu(e) !== false)
		{
			e.stopPropagation();
			e.preventDefault();
			break;
		}

	}

}




//function onHover(e: MouseEvent)
//{
//	prepareFocusers();

//	$logb("FlowFocuser.onHover", () =>
//	{
//		$log("e.cancelBubble: ", e.cancelBubble);

//	for (let ff of _focusers)
//	{
//		if (e.cancelBubble) break;

//		ff.onHover(e);
//	}
//	});
//}




function onKeyDown(e: KeyboardEvent)
{

	if (!_started)
		return;


	if (e.cancelBubble)
		return;


	//if (e["$ignoreByFF"]) return;


	if (_currentFocuser)
	{
		//$log("_currentFocuser:", _currentFocuser);
		_currentFocuser.onKeyDown(e);
	}
	else if (_rootFocuser)
	{
		//$log("_rootFocuser:", _rootFocuser);
		_rootFocuser.onKeyDown(e);
	}
	else
		return;


	e.stopPropagation();

}







//===






//Bindera.$registerActionHandler(async function focusByResponseAction(action)
//{

//	if (action.name !== "focus")
//		return false;

//	//$log("action:", action);

//	let model = Bindera.getModel(action.prms.model);

//	//$log("model:", model);

//	model && await $focus(model, { focusFirst: true, awaitImmidiate: true });


//	return true;

//});






//	//===




//}






//namespace Bindera
//{



//	export interface IObserveListener
//	{
//		focus?(focusCfg?: App.FlowFocuser.FocusActionProps | null): Promise<App.FlowFocuser.Focuser>;
//	}




//}






//===






export function Core()
{

	React.useEffect(() => runCore(), []);


	return (

		<GlobalStyles styles={{

			".ff-caret-body": {

				position: "absolute",
				zIndex: 999999,
				pointerEvents: "none",

				//"--color": "var(--color, red)",
				//background: "rgba(var(--color), .05)",
				color: "rgb(var(--color))",
				borderColor: "rgb(var(--color))",
				//boxShadow: `0px 7px 8px -4px rgba(var(--color), .25), 0px 12px 17px 2px rgba(var(--color), .18), 0px 5px 22px 4px rgba(var(--color), .16)`,
				boxShadow: `0px 7px 8px -4px rgba(var(--color), .25), 0px 12px 17px 2px rgba(var(--color), .18)`,

				borderStyle: "solid",

				opacity: "var(--opacity,0)",
				borderRadius: 3,
				borderWidth: 3,//Caret.defaultBorderWidth,

				inset: -1,

				transition: `var(--transition, all ${$defaultAnimationDurationMs}ms linear)`,

				willChange: "inset, opacity, border-radius, border-width, color, border-color, transition",

				"> div": {
					position: "absolute",
					inset: 0,
					borderRadius: "inherit",
					overflow: "hidden",
					opacity: "var(--opacity,0)",
					transition: `opacity ${$defaultAnimationDurationMs}ms linear ${2.5 * $defaultAnimationDurationMs}ms`,
				},

				"&.shake-1": {
					animationDuration: ".5s",
					animationTimingFunction: "ease-in-out",
					animationName: "ff-shake-1",
				},
				"&.shake-2": {
					animationDuration: ".5s",
					animationTimingFunction: "ease-in-out",
					animationName: "ff-shake-2",
				},
				"&.shake-3": {
					animationDuration: ".5s",
					animationTimingFunction: "ease-in-out",
					animationName: "ff-shake-3",
				},


			},


			"@keyframes ff-shake-1": {
				"0%": { transform: "translateY(0)" },
				"6.5%": { transform: "translateY(-2px) rotateY(-9deg)" },
				"18.5%": { transform: "translateY(2px) rotateY(7deg)" },
				"31.5%": { transform: "translateY(-1px) rotateY(-5deg)" },
				"43.5%": { transform: "translateY(1px) rotateY(3deg)" },
				"50%": { transform: "translateY(0)" },
			},

			"@keyframes ff-shake-2": {
				"0%": { transform: "translateX(0)" },
				"6.5%": { transform: "translateX(-6px) rotateY(-9deg)" },
				"18.5%": { transform: "translateX(5px) rotateY(7deg)" },
				"31.5%": { transform: "translateX(-3px) rotateY(-5deg)" },
				"43.5%": { transform: "translateX(2px) rotateY(3deg)" },
				"50%": { transform: "translateX(0)" },
			},

			"@keyframes ff-shake-3": {
				"0%": { transform: "skew(-10deg)" },
				"5%": { transform: "skewX(10deg)" },
				"10%": { transform: "skewX(-10deg)" },
				"15%": { transform: "skewX(10deg)" },
				"20%": { transform: "skewX(0deg)" },
				"100%": { transform: "skewX(0deg)" },
			},


			".ff-caret-lineBreak-indicator-1": {

				position: "absolute",
				top: 0,

				height: "var(--height)",
				left: "var(--left)",
				width: "var(--width)",

				background: `rgba(var(--color), .5)`,
				//background: `rgb(var(--color))`,
				border: `1px solid rgb(var(--color))`,
				//borderTop: 'none',
				borderRadius: `0 0 var(--height) var(--height)`,
				//borderRadius: `0 0 ${value < max2 ? height : 0}px ${value > 0 ? height : 0}px`,

				transition: `all 225ms ease-out`,

				willChange: "height, left, width, background, border, border-radius",



			},


		}} />

	);


}