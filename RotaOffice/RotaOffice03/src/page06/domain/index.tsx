import { $log } from "../../@libs";
$log("domain\index");
import { Semantic } from "../core/semantics";
import { entities } from "./entities/_sm";



export var gsm = Semantic.create(sm => ({

	...entities,

}));






//===






export * from "./db";

export * from "./entities";
