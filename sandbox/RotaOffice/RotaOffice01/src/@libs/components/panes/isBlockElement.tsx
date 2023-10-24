import { isValidElement, type ReactElement } from "react";
import { Pane } from ".";
import { Block } from "./Block";




//===




export function isBlockElement<P>(obj: {} | null | undefined): obj is ReactElement<P & Block.Props> {
    //return (
    //	isValidElement<P>(obj) && typeof obj.type === "function" &&
    //	(obj.type.name === "Col" || obj.type.name === "Row" || obj.type.name === "Pane")
    //);
    return (
        isValidElement<P>(obj) &&
        (obj.type === Pane.Col || obj.type === Pane.Row || obj.type === Pane)
    );
}
