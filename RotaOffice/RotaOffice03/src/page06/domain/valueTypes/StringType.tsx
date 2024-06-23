import { ValueType } from "./_ValueType";
import { type Db } from "../db";
import { DbEntity } from "../dbEntity";






//===






export class StringType extends ValueType
{

	constructor(
		public title: string,
		public length?: number,
		public minLength?: number,
		public maxLength?: number,
	)
	{
		super();
	}

}






//===






export module StringType
{


	//---



	export type RestFields = Partial<Omit<
		StringType,
		"id" | "title" | "length" | "minLength" | "maxLength"
	>>;



	export function Service(db: Db)
	{


		const all: StringType[] = [];


		return {

			all,

			add,

		};



		function add(
			title: string,
		): StringType;

		function add(
			title: string,
			length: number,
		): StringType;

		function add(
			title: string,
			minLength: number,
			maxLength: number,
			fields?: RestFields | null,
			init?: (entity: StringType) => void,
		): StringType;


		function add(
			title: string,
			len1?: number,
			len2?: number,
			fields?: RestFields | null,
			init?: (entity: StringType) => void
		): StringType
		{

			let length: number | undefined = undefined;
			let minLength: number | undefined = undefined;
			let maxLength: number | undefined = undefined;


			if (len1 != null && len2 != null && len1 !== len2)
			{
				minLength = len1;
				maxLength = len2;
			}
			else if (len1 != null)
			{
				length = len1;
			}


			return DbEntity.addTo2(
				new StringType(title, length, minLength, maxLength),
				all, db.ValueType.all,
				fields, init
			);
		}


	}



	//---


}



