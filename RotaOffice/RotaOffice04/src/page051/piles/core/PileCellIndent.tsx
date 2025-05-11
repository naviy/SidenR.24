import { createContext, useContext, type ReactNode } from "react";






//===






var IndentContext = createContext(0);



export function usePileCellIndent()
{
	return useContext(IndentContext);
}



export function PileCellIndentProvider(
	props: ({
		indent: number;
		children: ReactNode;
	}),
)
{

	return <IndentContext.Provider
		value={props.indent || 0}
		children={props.children}
	/>;

}
