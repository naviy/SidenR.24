import { db } from "./_db";
import * as data_00 from "./data_00";
import * as data_01 from "./data_01";




export const data =
{

	db,

	data: {
		...data_00,
		...data_01,
	},

};