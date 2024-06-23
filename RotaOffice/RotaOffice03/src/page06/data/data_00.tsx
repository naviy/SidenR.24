import { Entity } from "../domain";
import { db } from "./_db";





db.Entity.add("Entity", null, e =>
{
	e.addProp("title", db.StringType.add("EntityTitle"));
	e.addProp("props");
});


db.Entity.add("EntityProperty", null, e =>
{
	e.addProp("entity", db.LookupType.add(Entity));
	e.addProp("title", db.StringType.add("PropertyTitle"));
});