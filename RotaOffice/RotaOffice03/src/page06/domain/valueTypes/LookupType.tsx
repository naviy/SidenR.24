import type { Constructor } from "@libs";
import { type Db } from "../db";
import { DbEntity } from "../dbEntity";
import { ValueType } from "./_ValueType";
import type { ReactNode } from "react";






//===






export class LookupType<TLookup extends DbEntity = DbEntity> extends ValueType
{

	//---



	constructor(
		//title: string,
		public lookupClass: Constructor<TLookup>,
		public keyProp: string,
	)
	{
		super();
	}



	//---



	override renderTitle()
	{

		let { lookupClass, keyProp } = this;

		let keys: ReactNode = undefined;


		if (keyProp !== "id")
		{
			keys = <>[{keyProp}]</>;
		}
		

		return <>{lookupClass.name}{keys}</>;

	}



	//---

}






//===






export module LookupType
{


	//---



	export type RestFields = Partial<Omit<
		LookupType,
		"id" | "lookupClass" | "keyProp"
	>>;



	export function Service(db: Db)
	{


		const all: LookupType[] = [];


		return {

			all,

			add,

		};



		function add<TLookup extends DbEntity>(
			lookupClass: Constructor<TLookup>,
			keyProp?: string | null | undefined,
			fields?: RestFields | null,
			init?: (entity: LookupType) => void
		): LookupType
		{						

			return DbEntity.addTo2(
				new LookupType(lookupClass, keyProp || "id"),
				all, db.ValueType.all,
				fields, init
			);
		}


	}



	//---


}



