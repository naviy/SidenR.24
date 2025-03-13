import * as dm from "../domain";
import { db } from "./_db";





db.Entity.add("Entity", null, e =>
{
	e.addProp("title", db.StringType.add("EntityTitle"));
	e.addProp("props");
});


db.Entity.add("EntityProperty", null, e =>
{
	e.addProp("entity", db.LookupType.add(dm.Entity));
	e.addProp("title", db.StringType.add("PropertyTitle"));
	e.addProp("valueType", db.LookupType.add(dm.ValueType));
});


db.Entity.add("ValueType", null, e =>
{
	e.addProp("renderTitle");
});