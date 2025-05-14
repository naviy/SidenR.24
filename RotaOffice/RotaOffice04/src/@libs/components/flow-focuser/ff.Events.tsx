import type { Focuser } from "./ff.Focuser";






export module Events
{



	//---






	export type ClickBehavior = boolean | "focus" | "unfocus" | "enter" | "focus, enter" | "focus; enter" | "enter, focus";// | "focus, row-expand; enter" | "focus, row-expand, enter";






	export interface Listener
	{

		focus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
		unfocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
		changeFocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;


		itemFocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
		itemUnfocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
		changeItemFocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;

		focusLeft?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;
		focusUp?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;
		focusRight?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;
		focusDown?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;


		click?(ff: Focuser, e: MouseEvent): void | boolean | Promise<any>;
		contextMenu?(ff: Focuser, e: MouseEvent): void | boolean | Promise<any>;
		keyDown?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<any>;

		enter?(ff: Focuser): void | boolean | Promise<any>;
		itemEnter?(ff: Focuser, itemFf: Focuser): boolean | Promise<boolean>;
		exit?(ff: Focuser): void | boolean | Promise<void | boolean | Focuser>;

		insert?(ff: Focuser): void | boolean | Promise<any>;

		delete?(ff: Focuser): void | boolean | Promise<any>;
		activate?(ff: Focuser, activated: boolean): void | boolean | Promise<any>;
		select?(ff: Focuser): void | boolean | Promise<any>;
		mount?(ff: Focuser): void;
		unmount?(ff: Focuser): void;

	}






	export type Name = keyof Listener;


	export function toBehaviorEventName(eventName: Name): ff_Name
	{
		return `ff_on${eventName.toCapitalizeCase()}` as any;
	}




	export type ff_Name = `ff_on${Capitalize<Name>}`;


	export type ff_Listener = (
		{
			[P in keyof Listener as `ff_on${Capitalize<P>}`]?: Listener[P];
		} & {
			ff_allowCtrlKey?: boolean;
		}
	);






	//---






	export type Mount = (ff: Focuser) => void;
	export type Unmount = (ff: Focuser) => void;

	export type Focus = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
	export type Unfocus = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
	export type ItemFocus = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
	export type ItemUnfocus = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
	export type ChangeItemFocus = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;

	export type FocusDir = (ff: Focuser) => void | boolean | Promise<any>;

	export type Click = (ff: Focuser, e: MouseEvent) => void | boolean | Promise<any>;
	export type ContextMenu = (ff: Focuser, e: MouseEvent) => void | boolean | Promise<any>;
	export type KeyDown = (ff: Focuser, e: KeyboardEvent) => void | boolean | Promise<any>;

	export type Enter = (ff: Focuser) => void | boolean | Promise<any>;
	export type ItemEnter = (ff: Focuser, itemFf: Focuser) => boolean | Promise<boolean>;
	export type Exit = (ff: Focuser) => void | boolean | Promise<void | boolean | Focuser | null>;

	export type Insert = (ff: Focuser) => void | boolean | Promise<any>;
	export type Edit = (ff: Focuser) => void | boolean | Promise<any>;
	//export type Inspect = (ff: Focuser, e: InspectArgs) => void | boolean | Promise<any>;
	export type Delete = (ff: Focuser) => void | boolean | Promise<any>;
	export type Activate = (ff: Focuser, activated: boolean) => void | boolean | Promise<any>;
	export type Select = (ff: Focuser) => void | boolean | Promise<any>;






	//---



}