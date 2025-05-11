import { DbContext } from "../core/domain";

import { Entity } from "./entities";
import * as vt from "./valueTypes";






//===






export class Db extends DbContext
{

	//---



	Entity = Entity.Service(this);


	ValueType = vt.ValueType.ServiceBase(this);

	LookupType = vt.LookupType.Service(this);

	StringType = vt.StringType.Service(this);



	//---

}
