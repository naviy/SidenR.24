import { Focuser } from '@libs';
import { useEffect, useState } from "react";
import { Tenta } from "../../tentas";
import { PileRowNodeTenta } from "./PileRowNodeTenta";






//===






export function PileRowNodeAccentor({
	tenta,
	children,
}: {
	tenta: PileRowNodeTenta;
	children: [body: JSX.Element, tail: JSX.Element];
})
{

	//$log("PileRowAccentor " + tenta)

	//let [tailIsFocused, setTailIsFocused] = useState(false);


	//function updateTailFocuser(tailFf: Focuser)
	//{
	//	let itemFocused = !!tailFf.itemFocused && tenta.tailIsSeparated;

	//	if (tailIsFocused !== itemFocused)
	//		setTailIsFocused(itemFocused);
	//}


	let parentAccent = Tenta.Accent.use();

	let accent = Math.max(
		tenta.bodyAccent,
		//tailIsFocused ? Tenta.Accent.Max : 0,
		parentAccent
	) as Tenta.Accent;


	let tailAccent = tenta.tailIsVisible && !tenta.tailIsSeparated ? accent : Tenta.Accent.Min;


	//useEffect(() =>

	//	tenta.tailFf!.on({
	//		focus: updateTailFocuser,
	//		unfocus: updateTailFocuser,
	//	})

	//);


	return <>

		<Tenta.Accent.Provider accent={accent} children={children[0]} />
		{/*children[0]*/}
		{/*children[1]*/}
		<Tenta.Accent.Provider accent={tailAccent} children={children[1]} />

	</>;

}
