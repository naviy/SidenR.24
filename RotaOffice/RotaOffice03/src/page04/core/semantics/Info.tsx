import { $log, _$log, type MuiColor } from "@libs";
import _ from 'lodash';
import moment from 'moment';
import numeral from 'numeral';
import { type ReactNode } from 'react';
import { noun, verb } from "./utils";






//===






export type ContentRole =
	'entityCode' | 'entityDate' | 'entityMaster' | 'entityName' | 'entityPosition' | 'entityType' |
	'title' | 'important' | 'normal' | 'secondary';




export type ContentType =
	'boolean' | 'date' | 'money' | 'number' | 'string' |
	'email' | 'phone' | 'fax';






export interface InfoProps
{
	//id?: number;

	metatype?: 'class' | 'method';
	type?: ContentType | null;
	contentRole?: ContentRole | null;


	one?: string | null;
	one2?: string | null;
	one3?: string | null;
	one4?: string | null;
	one5?: string | null;
	one6?: string | null;

	many?: string | null;
	many2?: string | null;
	many3?: string | null;
	many4?: string | null;
	many5?: string | null;
	many6?: string | null;

	two?: string | null;
	two2?: string | null;
	two3?: string | null;
	two4?: string | null;
	two5?: string | null;
	two6?: string | null;

	five?: string | null;
	five2?: string | null;
	five3?: string | null;
	five4?: string | null;
	five5?: string | null;
	five6?: string | null;


	short?: string | null;
	long?: string | null;
	description?: string | null;

	empty?: string | null;

	placeholder?: string | null;
	confirm?: string | null;


	icon?: ReactNode;
	color?: MuiColor | null;

	format?: string | null;

	//ocode?: number;
}






export class Info<P extends InfoProps = InfoProps, F extends Object = {}>
{

	//---



	constructor(props: P | null | undefined, fields: F | null | undefined)
	{

		this.$props = props || {} as P;

		fields && this.$appendFields(fields);

	}



	$appendFields(fields: F)
	{

		for (let p of Object.keys(fields))
		{

			let value = (fields as any)[p];

			if (value === undefined)
				continue;


			if (is(value))
			{
				value.$name = p;
			}


			(this as any)[p] = value;

		}

	}



	//---



	$props: P;
	//$parent?: Info;


	#name?: string | null;
	#names?: string | null;



	//---



	//get $id() { return this.$props.id || null; }

	get $name() { return this.#name || null; }
	set $name(value: string | null | undefined) { this.#name = value || null; }
	get $names() { return lowerFirst(this.#names || this.#name); }

	//get $cssName() { return this.#name ? this.#name.toLowerCase() : null; }


	#one?: string | null;
	#One?: string | null;
	get $one() { return this.#one !== undefined ? this.#one : this.#one = this.$props.one === '' ? null : lowerFirst(this.$props.one || this.#name); }
	get $One() { return this.#One !== undefined ? this.#One : this.#One = upperFirst(this.$one); }

	#one2?: string | null;
	#One2?: string | null;
	get $one2() { return this.#one2 !== undefined ? this.#one2 : this.#one2 = this.$props.one2 === '' ? null : lowerFirst(this.$props.one2 || this.$one); }
	get $One2() { return this.#One2 !== undefined ? this.#One2 : this.#One2 = upperFirst(this.$one2); }

	#one3?: string | null;
	#One3?: string | null;
	get $one3() { return this.#one3 !== undefined ? this.#one3 : this.#one3 = this.$props.one3 === '' ? null : lowerFirst(this.$props.one3 || this.$one); }
	get $One3() { return this.#One3 !== undefined ? this.#One3 : this.#One3 = upperFirst(this.$one3); }

	#one4?: string | null;
	#One4?: string | null;
	get $one4() { return this.#one4 !== undefined ? this.#one4 : this.#one4 = this.$props.one4 === '' ? null : lowerFirst(this.$props.one4 || this.$one); }
	get $One4() { return this.#One4 !== undefined ? this.#One4 : this.#One4 = upperFirst(this.$one4); }

	#one5?: string | null;
	#One5?: string | null;
	get $one5() { return this.#one5 !== undefined ? this.#one5 : this.#one5 = this.$props.one5 === '' ? null : lowerFirst(this.$props.one5 || this.$one); }
	get $One5() { return this.#One5 !== undefined ? this.#One5 : this.#One5 = upperFirst(this.$one5); }

	#one6?: string | null;
	#One6?: string | null;
	get $one6() { return this.#one6 !== undefined ? this.#one6 : this.#one6 = this.$props.one6 === '' ? null : lowerFirst(this.$props.one6 || this.$one); }
	get $One6() { return this.#One6 !== undefined ? this.#One6 : this.#One6 = upperFirst(this.$one6); }


	#many?: string | null;
	#Many?: string | null;
	get $many() { return this.#many !== undefined ? this.#many : this.#many = this.$props.many === '' ? null : lowerFirst(this.$props.many || this.$props.one || this.#names || this.#name); }
	get $Many() { return this.#Many !== undefined ? this.#Many : this.#Many = upperFirst(this.$many); }

	#many2?: string | null;
	#Many2?: string | null;
	get $many2() { return this.#many2 !== undefined ? this.#many2 : this.#many2 = this.$props.many2 === '' ? null : lowerFirst(this.$props.many2 || this.$many); }
	get $Many2() { return this.#Many2 !== undefined ? this.#Many2 : this.#Many2 = upperFirst(this.$many2); }

	#many3?: string | null;
	#Many3?: string | null;
	get $many3() { return this.#many3 !== undefined ? this.#many3 : this.#many3 = this.$props.many3 === '' ? null : lowerFirst(this.$props.many3 || this.$many); }
	get $Many3() { return this.#Many3 !== undefined ? this.#Many3 : this.#Many3 = upperFirst(this.$many3); }

	#many4?: string | null;
	#Many4?: string | null;
	get $many4() { return this.#many4 !== undefined ? this.#many4 : this.#many4 = this.$props.many4 === '' ? null : lowerFirst(this.$props.many4 || this.$many); }
	get $Many4() { return this.#Many4 !== undefined ? this.#Many4 : this.#Many4 = upperFirst(this.$many4); }

	#many5?: string | null;
	#Many5?: string | null;
	get $many5() { return this.#many5 !== undefined ? this.#many5 : this.#many5 = this.$props.many5 === '' ? null : lowerFirst(this.$props.many5 || this.$many); }
	get $Many5() { return this.#Many5 !== undefined ? this.#Many5 : this.#Many5 = upperFirst(this.$many5); }

	#many6?: string | null;
	#Many6?: string | null;
	get $many6() { return this.#many6 !== undefined ? this.#many6 : this.#many6 = this.$props.many6 === '' ? null : lowerFirst(this.$props.many6 || this.$many); }
	get $Many6() { return this.#Many6 !== undefined ? this.#Many6 : this.#Many6 = upperFirst(this.$many6); }


	#two?: string | null;
	#Two?: string | null;
	get $two() { return this.#two !== undefined ? this.#two : this.#two = this.$props.two === '' ? null : lowerFirst(this.$props.two || this.$many); }
	get $Two() { return this.#Two !== undefined ? this.#Two : this.#Two = upperFirst(this.$two); }

	#two2?: string | null;
	#Two2?: string | null;
	get $two2() { return this.#two2 !== undefined ? this.#two2 : this.#two2 = this.$props.two2 === '' ? null : lowerFirst(this.$props.two2 || this.$many2); }
	get $Two2() { return this.#Two2 !== undefined ? this.#Two2 : this.#Two2 = upperFirst(this.$two2); }

	#two3?: string | null;
	#Two3?: string | null;
	get $two3() { return this.#two3 !== undefined ? this.#two3 : this.#two3 = this.$props.two3 === '' ? null : lowerFirst(this.$props.two3 || this.$many3); }
	get $Two3() { return this.#Two3 !== undefined ? this.#Two3 : this.#Two3 = upperFirst(this.$two3); }

	#two4?: string | null;
	#Two4?: string | null;
	get $two4() { return this.#two4 !== undefined ? this.#two4 : this.#two4 = this.$props.two4 === '' ? null : lowerFirst(this.$props.two4 || this.$many4); }
	get $Two4() { return this.#Two4 !== undefined ? this.#Two4 : this.#Two4 = upperFirst(this.$two4); }

	#two5?: string | null;
	#Two5?: string | null;
	get $two5() { return this.#two5 !== undefined ? this.#two5 : this.#two5 = this.$props.two5 === '' ? null : lowerFirst(this.$props.two5 || this.$many5); }
	get $Two5() { return this.#Two5 !== undefined ? this.#Two5 : this.#Two5 = upperFirst(this.$two5); }

	#two6?: string | null;
	#Two6?: string | null;
	get $two6() { return this.#two6 !== undefined ? this.#two6 : this.#two6 = this.$props.two6 === '' ? null : lowerFirst(this.$props.two6 || this.$many6); }
	get $Two6() { return this.#Two6 !== undefined ? this.#Two6 : this.#Two6 = upperFirst(this.$two6); }


	#five?: string | null;
	#Five?: string | null;
	get $five() { return this.#five !== undefined ? this.#five : this.#five = this.$props.five === '' ? null : lowerFirst(this.$props.five || this.$many); }
	get $Five() { return this.#Five !== undefined ? this.#Five : this.#Five = upperFirst(this.$five); }

	#five2?: string | null;
	#Five2?: string | null;
	get $five2() { return this.#five2 !== undefined ? this.#five2 : this.#five2 = this.$props.five2 === '' ? null : lowerFirst(this.$props.five2 || this.$many2); }
	get $Five2() { return this.#Five2 !== undefined ? this.#Five2 : this.#Five2 = upperFirst(this.$five2); }

	#five3?: string | null;
	#Five3?: string | null;
	get $five3() { return this.#five3 !== undefined ? this.#five3 : this.#five3 = this.$props.five3 === '' ? null : lowerFirst(this.$props.five3 || this.$many3); }
	get $Five3() { return this.#Five3 !== undefined ? this.#Five3 : this.#Five3 = upperFirst(this.$five3); }

	#five4?: string | null;
	#Five4?: string | null;
	get $five4() { return this.#five4 !== undefined ? this.#five4 : this.#five4 = this.$props.five4 === '' ? null : lowerFirst(this.$props.five4 || this.$many4); }
	get $Five4() { return this.#Five4 !== undefined ? this.#Five4 : this.#Five4 = upperFirst(this.$five4); }

	#five5?: string | null;
	#Five5?: string | null;
	get $five5() { return this.#five5 !== undefined ? this.#five5 : this.#five5 = this.$props.five5 === '' ? null : lowerFirst(this.$props.five5 || this.$many5); }
	get $Five5() { return this.#Five5 !== undefined ? this.#Five5 : this.#Five5 = upperFirst(this.$five5); }

	#five6?: string | null;
	#Five6?: string | null;
	get $five6() { return this.#five6 !== undefined ? this.#five6 : this.#five6 = this.$props.five6 === '' ? null : lowerFirst(this.$props.five6 || this.$many6); }
	get $Five6() { return this.#Five6 !== undefined ? this.#Five6 : this.#Five6 = upperFirst(this.$five6); }


	get $short() { return this.$props.short || this.$one || null; }
	get $long() { return this.$props.long || this.$one || null; }
	get $description() { return this.$props.description || null; }

	get $empty() { return this.$props.empty || null; }

	get $placeholder() { return this.$props.placeholder || this.$props.empty || this.$props.description || null; }
	get $hint() { return this.$props.description || this.$long; }
	get $confirm() { return this.$props.confirm || null; }


	get $contentType() { return this.$props.type || null; }

	get $contentRole() { return this.$props.contentRole || null; }


	get $color() { return this.$props.color || null; }

	get $iconTitle(): ReactNode { return this.$iconText(this.$one); }
	get $titleIcon(): ReactNode { return this.$textIcon(this.$one); }
	get $iconLong(): ReactNode { return this.$iconText(this.$long); }
	get $iconShort(): ReactNode { return this.$iconText(this.$short); }


	//get $ocode() { return this.$props.ocode || null; };



	//---



	get $icon(): ReactNode { return this.$props.icon || null; }


	$iconText(text: string | null | undefined): any
	{

		let icon = this.$icon;

		return (icon && text
			? <>{icon}&nbsp;{text}</>
			: icon || text || null
		);

	}


	$textIcon(text: string | null | undefined/*, props?: DisplayStatusProps | false*/): any
	{

		let icon = this.$icon;

		return (icon && text
			? <>{text}&nbsp;{icon}</>
			: icon || text || null
		);

	}


	get $formatString() { return this.$props.format || null; }

	get $editFormatString(): string | null
	{
		const fmt = this.$formatString;
		return fmt /*&& fmt.replace(/\[.+?\]/g, '')*/;
	}



	$format(value: any, cfg?: { edit?: boolean; format?: string; }): string
	{
		const fmt = cfg && cfg.format ? cfg.format : cfg && cfg.edit ? this.$editFormatString : this.$formatString;


		if (fmt)
		{
			if (this.$contentType === 'date')
				return moment(value).format(fmt);


			//if (typeof value === 'string')
			//	return value.format(fmt);


			if (typeof value === 'number')
				return numeral(value).format(fmt);
		}


		return value;
	}



	//---



	//$colors(): { color?: string; }
	//{

	//	if (this._icon)
	//	{
	//		let iconAlias = Icon.aliases.find(this._icon);

	//		if (iconAlias?.color)
	//			return { color: iconAlias.color };
	//	}


	//	return {};
	//}



	//$anchor()
	//{
	//	return [this.$name!];
	//}



	//$display(value, prms)
	//{
	//	return App.$display(this, value, prms);
	//}



	//---



	$noun(num: number) { return noun(num, this.$one, this.$two, this.$five); }
	$noun2(num: number) { return noun(num, this.$one2, this.$two2, this.$five2); }
	$noun3(num: number) { return noun(num, this.$one3, this.$two3, this.$five3); }
	$noun4(num: number) { return noun(num, this.$one4, this.$two4, this.$five4); }
	$noun5(num: number) { return noun(num, this.$one5, this.$two5, this.$five5); }
	$noun6(num: number) { return noun(num, this.$one6, this.$two6, this.$five6); }

	$Noun(num: number) { return noun(num, this.$One, this.$Two, this.$Five); }
	$Noun2(num: number) { return noun(num, this.$One2, this.$Two2, this.$Five); }
	$Noun3(num: number) { return noun(num, this.$One3, this.$Two3, this.$Five); }
	$Noun4(num: number) { return noun(num, this.$One4, this.$Two4, this.$Five); }
	$Noun5(num: number) { return noun(num, this.$One5, this.$Two5, this.$Five); }
	$Noun6(num: number) { return noun(num, this.$One6, this.$Two6, this.$Five); }

	$verb(num: number) { return verb(num, this.$one, this.$two, this.$five); }
	$verb2(num: number) { return verb(num, this.$one2, this.$two2, this.$five2); }
	$verb3(num: number) { return verb(num, this.$one3, this.$two3, this.$five3); }
	$verb4(num: number) { return verb(num, this.$one4, this.$two4, this.$five4); }
	$verb5(num: number) { return verb(num, this.$one5, this.$two5, this.$five5); }
	$verb6(num: number) { return verb(num, this.$one6, this.$two6, this.$five6); }

	$Verb(num: number) { return verb(num, this.$One, this.$Two, this.$Five); }
	$Verb2(num: number) { return verb(num, this.$One2, this.$Two2, this.$Five2); }
	$Verb3(num: number) { return verb(num, this.$One3, this.$Two3, this.$Five3); }
	$Verb4(num: number) { return verb(num, this.$One4, this.$Two4, this.$Five4); }
	$Verb5(num: number) { return verb(num, this.$One5, this.$Two5, this.$Five5); }
	$Verb6(num: number) { return verb(num, this.$One6, this.$Two6, this.$Five6); }



	//---



	toString()
	{
		return this.$one;
	}



	//---

}






export function is(obj: any): obj is Info
{
	return obj && obj instanceof Info;
}


function lowerFirst(value: string | null | undefined)
{
	return !value ? null : _.lowerFirst(value);
}


function upperFirst(value: string | null | undefined)
{
	return !value ? null : _.upperFirst(value);
}

