import React from "react";
import { $log, $logb, adelay, _$log, __$log } from "../..";
import { Focuser, FocusActionProps } from ".";






//===






export const FocuserContext = React.createContext<Focuser | null>(null);



let _animationFrameHandle: number | null;


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


	if (ff.root && _rootFocusers.register(ff))
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
		_$log("ff:", ff);
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






const _focusSteps: { next: Focuser | null, focusProps?: FocusActionProps | null }[] = [];
let _isFocusing: boolean;



export const focuserFocus = (function focuserFocus(next: Focuser | null, focusProps?: FocusActionProps | null)
{

	_focusSteps.push({ next, focusProps });


	if (_isFocusing)
		return;

	try
	{
		_isFocusing = true;


		while (_focusSteps.length)
		{
			let step = _focusSteps.shift()!;

			focuserFocusStep(step.next, step.focusProps);
		}
	}
	finally
	{
		_isFocusing = false;
	}

});




function focuserFocusStep(next: Focuser | null, focusProps?: FocusActionProps | null)
{

	//$logb("focuserFocusStep()", () =>
	//{

	//$log("prior:", _currentFocuser);
	//$log("next:", next);



	if (_currentFocuser === next || next && next.disabled)
		return;


	const prior = _currentFocuser;


	let willUnfocus: Focuser[] = [];
	let willFocus: Focuser[] = [];
	let willItemUnfocus: Focuser[] = [];
	let willItemFocus: Focuser[] = [];
	let confirmFocus: Focuser[] = [];



	if (prior)
	{

		prior.caret?.recalcPosition();


		let parent: Focuser | undefined = prior;

		while (parent)
		{
			willUnfocus.push(parent);
			parent = parent.parent;
		}
	}


	//$$log("willUnfocus0:", willUnfocus.map(a => a.el));


	if (next)
	{

		let parent: Focuser | undefined = next;

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


	//$log("willUnfocus:", willUnfocus.map(a => a.el));
	//$log("willFocus:", willFocus.map(a => a.el));
	//$log("confirmFocus:", confirmFocus.map(a => a.el));


	for (let i = willUnfocus.length - 1; i >= 0; i--)
	{
		setItemFocused(willUnfocus[i], false);

		//let a = willUnfocus[i];
		//a.itemFocused = false;
		//$log("itemFocused = ", a.itemFocused, a);
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
			a.onChangeItemFocus(prior, next);
		}

		for (let a of willUnfocus)
		{
			a.onUnfocus(prior, next);
		}

		for (let a of willFocus)
		{
			a.onFocus(prior, next, focusProps);
		}

		//console.timeEnd("animate FF");

		//});
	}
	finally
	{
		//AnimationFrame.endUpdate();
	}

	//$log("END focuserFocusStep");
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







export const unfocus = (function unfocus()
{
	focuserFocus(null);
});



export const unfocusEvent = (function unfocusEvent(e: Event)
{
	e?.stopPropagation();
	focuserFocus(null);
});



//export function $focus(
//	model: IObserveModel,
//	//focusProps?: FocusActionProps | null,
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


//	return listener?.listener?.focus!(/*focusProps*/);

//}






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

	//**stopRefresh();

	removeEvents();

}




function addEvents()
{

	document.addEventListener("click", onClick, false);
	document.addEventListener("contextmenu", onContextMenu, false);
	document.addEventListener("keydown", onKeyDown, false);

}


function removeEvents()
{

	document.removeEventListener("click", onClick);
	document.removeEventListener("contextmenu", onContextMenu);
	//document.removeEventListener("mouseover", onHover);
	document.removeEventListener("keydown", onKeyDown);

}




//**export function startRefresh()
//**{
//**
//**	if (!isFreezed())
//**	{
//**		refreshAllCursors();
//**	}
//**
//**	//$log("isFreezed:", isFreezed());
//**
//**
//**	if (_currentFocuser && _currentFocuser.useNoAnimation && !_currentFocuser.useForceAnimation && !_currentFocuser.useFastAnimation)
//**	{
//**		return _animationFrameHandle = window.requestAnimationFrame(startRefresh);
//**	}
//**	else
//**	{
//**		return _animationFrameHandle = window.setTimeout(() =>
//**			window.requestAnimationFrame(startRefresh),
//**			20
//**		);
//**	}
//**
//**}




//**export function stopRefresh()
//**{
//**
//**	if (!_animationFrameHandle)
//**		return;
//**
//**
//**	clearTimeout(_animationFrameHandle);
//**	window.cancelAnimationFrame(_animationFrameHandle);
//**
//**	_animationFrameHandle = null;
//**
//**}






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





let _disabledFocusOnUnmount = 0;



export function isDisabledFocusOnUnmount(): boolean
{
	return !!_disabledFocusOnUnmount;
}




export async function focusAfter<T>(action: () => Promise<T>, focus: () => Promise<Focuser>): Promise<T>
{

	let result: T | undefined = undefined;


	_disabledFocusOnUnmount++;


	try
	{

		result = await action();

		await focus();

	}
	finally
	{
		_disabledFocusOnUnmount--;

		if (_disabledFocusOnUnmount < 0)
			_disabledFocusOnUnmount = 0;
	}


	return result;

}






//===






let lastClickTimeStamp: number;


const onClick = (async function onClick(e: MouseEvent)
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


	lastClickTimeStamp = e.timeStamp;


	prepareFocusers();



	(async () =>
	{
		//await $logb("ff.Core.onClick", async () =>
		//{
		//	$log("focusers:", _focusers);
		//	$log("e:", e);

		for (let ff of _focusers)
		{

			if (e.cancelBubble)
				return;
			//$log("ff:", ff);
			//$log("ff.canClick():", ff.canClick());
			if (!ff.canClick())
				continue;


			let el = ff.el;

			//$log("e.target:", e.target);
			//_$log("el:", el);
			//__$log("el !== e.target:", el !== e.target);
			//__$log("!el.contains(e.target as Node):", !el?.contains(e.target as Node));

			if (!el || el !== e.target && !el.contains(e.target as Node))
				continue;


			if (await ff.onClick(e))
				break;

		}
		//		});
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
//		focus?(focusProps?: App.FlowFocuser.FocusActionProps | null): Promise<App.FlowFocuser.Focuser>;
//	}




//}