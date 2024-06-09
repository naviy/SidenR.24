import { createContext, useContext } from "react";
import { data } from "../page04/data";




const Context = createContext(data);



export function useData(): typeof data
{
	return useContext(Context);
}