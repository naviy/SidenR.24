import { Semantic } from "../core/semantics";
import { entities } from "./entities/_sm";




export var gsm = Semantic.create(sm => ({

	...entities,

}));






//===






export * from "./_db";

export * from "./entities";
