import { createContext, useContext } from "react";
import { data } from "./data";




const Context = createContext(data);



export function useData(): typeof data
{
	return useContext(Context);
}