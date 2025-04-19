import type { MuiColor } from "../core";
import type { AnchorProps } from "./ff.Anchor";
import type { Caret } from "./ff.Caret";
import type { FocusConfig } from "./ff.Core";
import type { Events } from "./ff.Events";
import type { Focuser } from "./ff.Focuser";






//===






export interface FocuserProps
{

	//---



	//key?: React.Key | null,
	//ref?: React.Ref<Focuser>,

	cls?: string;
	name?: string;

	data?: any;

	initAnchorProps?: () => AnchorProps;
	applyAnchorProps?: (props: AnchorProps | null) => any;

	cursor?: boolean;

	noCaret?: boolean;

	//model?: IBindingModel;

	root?: boolean;
	modal?: boolean;

	/** является scope для дочерних */
	scope?: boolean | ScopeOptions;

	/** навигация с клавиатуры осуществляется только в пределах scope */
	local?: boolean;


	ghost?: boolean;
	ghostIfParentIsCollapsed?: boolean;
	ghostIfParentIsNotFocused?: boolean;


	disabled?: boolean;
	disableIfParentIsCollapsed?: boolean;
	disableIfParentIsNotFocused?: boolean;

	/** На случай, если родительские компоненты принудительно устанавливают disabled=true */
	forceEnabled?: boolean;


	color?: MuiColor;
	borderRadius?: Caret.BorderRadius;
	borderWidth?: Caret.BorderWidth;

	priority?: number;

	//cursorClassName?: string;
	//border?: boolean | number;
	//enterBorder?: boolean | number;
	//borderClassName?: string;

	autoFocus?: boolean | "first" | "lazy" | number;
	ignoreOnKeyboardNavigation?: boolean;

	exitSlot?: boolean;
	exitToPrior?: boolean;

	//nohoverCollapsed?: boolean;

	collapsed?: boolean;


	/** Используется для контейнера при ghost=true - для перехода фокуса на дочерние focusers с быстрой навигацией */
	focusable?: boolean;

	/** Быстрая навигация по горизонтали будет осуществляться быстрым способом поиска ближайших соседей (prior и next), а не геометрических совпадений */
	hnav?: boolean;

	/** Быстрая навигация по вертикали будет осуществляться быстрым способом поиска ближайших соседей (prior и next), а не геометрических совпадений */
	vnav?: boolean;

	/** Быстрая навигация проходит "поверх" данного focuser, т.е. не заходит в дочерние */
	overNav?: boolean;


	/** допустимый нахлёст по X и Y, px */
	overlap?: number;
	/** допустимый нахлёст по X, px */
	overlapX?: number;
	/** допустимый нахлёст по Y, px */
	overlapY?: number;


	scrollIntoView?: boolean;


	listener?: Events.ff_Listener | null;

	onFocus?: Events.Focus;
	onUnfocus?: Events.Unfocus;
	onItemFocus?: Events.ItemFocus;
	onItemUnfocus?: Events.ItemUnfocus;
	onChangeItemFocus?: Events.ChangeItemFocus;

	onClick?: Events.Click;
	onContextMenu?: Events.ContextMenu;
	onKeyDown?: Events.KeyDown;

	onFocusLeft?: Events.FocusDir;
	onFocusUp?: Events.FocusDir;
	onFocusRight?: Events.FocusDir;
	onFocusDown?: Events.FocusDir;


	onEnter?: Events.Enter/* | IMethodSemantic*/;
	onItemEnter?: Events.ItemEnter/* | IMethodSemantic*/;
	onExit?: Events.Exit/* | IMethodSemantic*/;

	onInsert?: Events.Insert/* | IMethodSemantic*/;
	//onInspect?: InspectEvent/* | IMethodSemantic*/;
	onDelete?: Events.Delete/* | IMethodSemantic*/;
	onActivate?: Events.Activate/* | IMethodSemantic*/;
	onSelect?: Events.Select/* | IMethodSemantic*/;

	onMount?: Events.Mount;
	onUnmount?: Events.Unmount;


	//div?: boolean;
	//className?: string;
	//style?: React.CSSProperties;

	defaultEntered?: boolean;

	click?: Events.ClickBehavior | ((ff: Focuser) => Events.ClickBehavior);
	//enterOnClick?: boolean;
	hover?: boolean;
	domFocus?: FocusConfig["domFocus"];

	allowCtrlKey?: boolean;
	allowShiftKey?: boolean;

	padding?: number | [number, number, number, number];
	defaultPadding?: number | [number, number, number, number];
	itemPadding?: number | [number, number, number, number];


	/** Запоминает cls и name последнего focusedItem для всех focusers с таким же cls.
	 * Требует указать свойтво cls, и, возможно, key у items
	 */
	lastItemLikeBro?: boolean;


	//// запрет перехода фокуса на ближайший focuser в случае unmount текущего
	//disabledFocusOnUnmount?: boolean;


	//---

}






export interface ScopeOptions
{

	/** сквозная навигация */
	through?: boolean | {
		left?: boolean;
		up?: boolean;
		right?: boolean;
		down?: boolean;
	};

}
