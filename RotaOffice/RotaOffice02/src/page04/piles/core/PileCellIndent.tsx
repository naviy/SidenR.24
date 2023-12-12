import { createContext, useContext, type ReactNode } from "react";






//===






const IndentContext = createContext(0);



export function usePileCellIndent()
{
	return useContext(IndentContext);
}



export function PileCellIndentProvider(
	props: ({
		indent: number;
	//	addIndent?: never;
	//} | {
	//	indent?: never;
	//	addIndent: number;
	//}) & {
		children: ReactNode;
	}),
)
{

	//let { indent, addIndent } = props as any as { indent?: number; addIndent?: number; };


	//if (addIndent !== undefined)
	//{
	//	let parentIndent = useCellIndent();
	//	indent = parentIndent + addIndent;
	//}



	return <IndentContext.Provider
		value={props.indent || 0}
		children={props.children}
	/>;

}
