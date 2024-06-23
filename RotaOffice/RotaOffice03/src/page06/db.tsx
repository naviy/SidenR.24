import { createContext, useContext } from "react";
import { data } from "./data";
import { $log } from "../@libs";


$log("db")

const Context = createContext(data);



export function useData(): typeof data
{
	return useContext(Context);
}