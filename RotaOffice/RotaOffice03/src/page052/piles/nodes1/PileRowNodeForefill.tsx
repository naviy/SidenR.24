import clsx from 'clsx';
import { useEffect, useState } from "react";
import { PileRowNodeTenta } from "./PileRowNodeTenta";
import "./PileRowNodeForefill.scss";
import { Pane } from '@libs';






//===






export function PileRowNodeForefill({
	tenta,
	bl, br, bt, bb
}: {
	tenta: PileRowNodeTenta;
	bl: Pane.Border;
	br: Pane.Border;
	bt: Pane.Border;
	bb: Pane.Border;
})
{

	let [rootIsFocused, setRootIsFocused] = useState(!!tenta.rootFf?.itemFocused);
	let [isFocused, setIsFocused] = useState(false);


	function updateFocuser()
	{

		let focused = !!tenta.bodyFf?.focused || !!tenta.tailFf?.itemFocused;// || !tenta.rootFf?.itemFocused;

		if (isFocused !== focused)
		{
			setIsFocused(focused);
		}

	}


	useEffect(() =>
	{

		let { rootFf, ff } = tenta


		let unmount0 = rootFf?.on({

			focus: () => setRootIsFocused(true),
			unfocus: () => setRootIsFocused(false),

		});


		let unmount1 = ff?.on({

			itemFocus: updateFocuser,
			itemUnfocus: updateFocuser,

		});


		return () =>
		{
			unmount0?.();
			unmount1?.();
		}

	});



	let bwt0 = width(bt);
	let bwt = bwt0 === 1 ? 0 : bwt0;

	let bwb0 = width(bb);
	let bwb = bwb0;
	//let bwb = tenta.btmMargin() === 0 ? 1 : bwb0


	return <div

		className={clsx(
			"pile-row-node-forefill",
			rootIsFocused && !isFocused && "bg",
			isFocused && "brd",
		)}

		style={{
			borderWidth: `${bwt}px ${width(br)}px ${bwb}px ${width(bl)}px`,
			//marginBottom: tenta.btmMargin() === 0 ? -1 : 0
		}}

		//children={<div />}

	>
		{/*<span>rootFf: {tenta.rootFf+""}</span><br/>*/}
		{/*<span>rootIsFocused: {rootIsFocused+""}</span><br/>*/}
		<div />
	</div>;


	function width(b: Pane.Border)
	{
		var w = Pane.Border.width(b) || 0;
		//w += w > 1 ? 1 : 0;

		return w;
	}

}
