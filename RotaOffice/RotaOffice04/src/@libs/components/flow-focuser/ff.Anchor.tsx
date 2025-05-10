import { currentFocuser, focusers, type FocusConfig } from "./ff.Core";
import type { Focuser } from "./ff.Focuser";






//===






export interface AnchorProps
{
	[prop: string]: boolean | number | string | any;
}



export type AnchorPart = string | null;
export type Anchor = AnchorPart[];





export function currentAnchor()
{
	let ff = currentFocuser();
	return ff && ff.anchor();
}




export async function focusByAnchor(anchor: Anchor, focusCfg?: FocusConfig | null)
{

	//return await $logb("focusByAnchor()", async () =>
	//{
	//$log("anchor:", anchor);

	if (!anchor || !anchor.length)
		return null;



	let pureAnchor2: Anchor = [];

	let lastFF: Focuser | null = null;


	for (let part of anchor)
	{

		//$log("part:", part);


		pureAnchor2.push(toPureAnchorPart(part));

		//$log("pureAnchor2:", pureAnchor2);


		let ff = focuserByPureAnchor(pureAnchor2);

		//$log("ff:", ff);

		if (!ff)
			break;

		lastFF = ff;


		let anchorProps = anchorPropsFromString(part);

		//$log("anchorProps:", anchorProps);

		await ff.applyAnchorProps(anchorProps);

	}



	return lastFF && await lastFF.focus(focusCfg);
	//});

}






function focuserByPureAnchor(anchor: Anchor)
{

	if (!anchor || !anchor.length)
		return null;


	for (let ff of focusers())
	{
		if (ff.localAnchor && pureAnchorEquals(ff.anchor(), anchor))
			return ff;
	}


	return null;

}






//===






function pureAnchorEquals(anchor: Anchor, start: Anchor)
{

	if (!anchor || !anchor.length || !start || !start.length)
		return false;


	if (anchor.length !== start.length)
		return false;


	for (let i = 0, len = start.length; i < len; ++i)
	{
		if (start[i] !== toPureAnchorPart(anchor[i]))
			return false;
	}


	return true;

}



//function toPureAnchor(anchor: Anchor)
//{

//	if (!anchor || !anchor.length)
//		return null;

//	return anchor.map(toPureAnchorPart);

//}



function toPureAnchorPart(anchorPart: AnchorPart)
{

	if (!anchorPart)
		return null;


	let i = anchorPart.indexOf("?");

	if (i >= 0)
		return anchorPart.substring(0, i);


	return anchorPart;

}






export function anchorPropsToString(anchorProps: AnchorProps): string | null
{

	let anchorProps2 = anchorProps && Object.entries(anchorProps).filter(a => a[1]).clip();

	if (!anchorProps2)
		return null;


	return anchorProps2.map(a =>
	{
		if (a[1] === true)
			return a[0];

		return `${a[0]}=${encodeURIComponent(a[1])}`;
	}).join("&");

}



export function anchorPropsFromString(part: AnchorPart): AnchorProps | null
{

	if (!part)
		return null;


	let i = part.indexOf("?");

	if (i < 0)
		return null;


	part = part.substring(i + 1).trim();

	if (!part)
		return null;


	let result: AnchorProps = {};


	for (let pv of part.split("&"))
	{

		let [prop, sval] = pv.split("=");

		let val: any = sval;

		if (sval === undefined)
			val = true;
		else if (!isNaN(sval as any))
			val = +sval;

		result[prop] = val;

	}


	return result;

}



	//export function anchorStartWith(anchor: Anchor, start: Anchor)
	//{
	//	if (!anchor || !anchor.length || !start || !start.length)
	//		return false;

	//	if (anchor.length < start.length)
	//		return false;


	//	for (let i = 0, len = start.length; i < len; ++i)
	//	{
	//		if (anchor[i] !== start[i])
	//			return false;
	//	}


	//	return true;
	//}