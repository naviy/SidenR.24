import { type Db } from "../db";
import { DbEntity } from "../dbEntity";






//===






export abstract class ValueType extends DbEntity
{

	//---


	//constructor(		
	//)
	//{
	//	super();
	//}


	//---

}






//===






export module ValueType
{


	export type RestFields = Partial<Omit<ValueType, "id" | "title">>;


	export function ServiceBase(db: Db)
	{


		const all: ValueType[] = [];


		return {


			all,


			add<TType extends ValueType>(type: TType): TType
			{
				all.push(type)
				return type;
			},


		};


	}

}



