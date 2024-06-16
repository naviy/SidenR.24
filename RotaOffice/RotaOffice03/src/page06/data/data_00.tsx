import { db } from "./_db";




db.Entity.add("Entity", null, e =>
{
	e.addProp("title");
	e.addProp("props");
});


db.Entity.add("EntityProperty", null, e =>
{
	e.addProp("entity");
	e.addProp("title");
});