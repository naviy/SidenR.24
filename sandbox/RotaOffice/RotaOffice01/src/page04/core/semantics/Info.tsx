import type { MuiColor } from "@libs";
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

	//name?: string| null;
	//names?: string| null;

	one?: string | null;
	many?: string | null;
	two?: string | null;
	five?: string | null;
	description?: string | null;
	long?: string | null;
	short?: string | null;
	empty?: string | null;
	placeholder?: string | null;
	confirm?: string | null;


	icon?: ReactNode;
	color?: MuiColor | null;

	format?: string | null;

	//ocode?: number;
}






//export interface IObjectSemantic
//{

//	//---



//	_type?: ContentType;

//	$id: number | null;

//	$name: string;
//	$Name: string | null;
//	$names: string | null;
//	$cssName: string | null;


//	$iconName: string | null;

//	$iconTitle: ReactNode;
//	$titleIcon: ReactNode;
//	$iconLong: ReactNode;
//	$iconShort: ReactNode;

//	$icon(props?: Partial<IconProps> | null/*, props1?: DisplayStatusProps, props2?: DisplayStatusProps*/): ReactElement | null;
//	$iconR(props?: Partial<IconProps> | null/*, props1?: DisplayStatusProps, props2?: DisplayStatusProps*/): ReactElement | null;
//	$iconText(text: string/*, props: DisplayStatusProps | false*/): ReactNode;
//	$textIcon(text: string/*, props: DisplayStatusProps | false*/): ReactNode;


//	$title: string | null;
//	$titles: string | null;
//	$title2: string | null;
//	$title5: string | null;

//	$description: string | null;

//	$long: string | null;
//	$short: string | null;
//	$empty: string | null;
//	$placeholder: string | null;
//	$hint: string | null;
//	$confirm: string | null;

//	$contentType: ContentType | null;
//	$contentRole: ContentRole | null;


//	$color: MuiColor | null;

//	$ocode: number | null;


//	$formatString: string | null;
//	$editFormatString: string | null;

//	$format(value: any, cfg?: { edit?: boolean; format?: string; }): string | null;


//	$colors?(): { color?: string; };


//	$noun(num: number): string | null;
//	$verb(num: number): string | null;


//	$anchor(): string[];


//	//$display?(value: any, prms?: DisplayParams): React.ReactNode;



//	//---

//}






//===






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

		for (let p in fields)
		{

			if (fields.hasOwnProperty(p))
				continue;


			let value = fields[p];

			if (value !== undefined)
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

	get $Name() { return this.#name ? _.upperFirst(this.#name) : null; }
	get $names() { return this.#names || this.#name || null; }

	get $cssName() { return this.#name ? this.#name.toLowerCase() : null; }

	get $title() { return this.$props.one === '' ? null : this.$props.one || this.#name || null; }
	get $titles() { return this.$props.many === '' ? null : this.$props.many || this.$props.one || this.#names || this.#name || null; }
	get $title2() { return this.$props.two === '' ? null : this.$props.two || this.$titles || null; }
	get $title5() { return this.$props.five === '' ? null : this.$props.five || this.$titles || null; }

	get $description() { return this.$props.description || null; }


	get $long() { return this.$props.long || this.$title || null; }
	get $short() { return this.$props.short || this.$title || null; }
	get $empty() { return this.$props.empty || null; }
	get $placeholder() { return this.$props.placeholder || this.$props.empty || this.$props.description || null; }
	get $hint() { return this.$props.description || this.$long; }
	get $confirm() { return this.$props.confirm || null; }


	get $contentType() { return this.$props.type || null; }

	get $contentRole() { return this.$props.contentRole || null; }


	get $color() { return this.$props.color || null; }

	get $iconTitle(): ReactNode { return this.$iconText(this.$title); }
	get $titleIcon(): ReactNode { return this.$textIcon(this.$title); }
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



	$noun(num: number)
	{
		return noun(num, this.$title!, this.$title2 || this.$titles!, this.$title5 || this.$titles!).toLowerCase();
	}


	$verb(num: number) 
	{
		return verb(num, this.$title!, this.$title2 || this.$titles!, this.$title5 || this.$titles!).toLowerCase();
	}



	//---



	//$hintText(): string
	//{
	//	return [this.$title, this.$description].filter(a => a).join('\n') || null;
	//}



	//---



	toString()
	{
		return this.$title;
	}



	//---

}






export function is(obj: any): obj is Info
{
	return obj && obj instanceof Info;
}
