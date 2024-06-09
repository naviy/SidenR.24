import { Semantic } from "../core/semantics";
import { units } from "./units/_sm";




export var gsm = Semantic.create(sm => ({

	...units,

}));






//===






export * from "./_db";

export * from "./soldiers";
export * from "./units";
