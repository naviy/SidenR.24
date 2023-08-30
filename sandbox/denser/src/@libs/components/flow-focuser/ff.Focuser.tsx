/* eslint-disable react-hooks/rules-of-hooks */




import { Component, ReactNode, RefObject, useContext } from "react";
import ReactDOM from "react-dom";

import { Div, MuiColor, SpaWaitingMask } from "../core";

import { $error, $logb, _$error, _$log, __$error, ___$error, adelay, arequestAnimationFrame, Key, TaskQueue, Values } from "../core";

import { Anchor, AnchorPart, AnchorProps, anchorPropsToString, CaretBehavior } from ".";

import {
	$animationDurationMs,
	$min_priority,
	coreMountFocuser, coreUnmountFocuser, currentFocuser, focuserById, FocuserContext,
	focuserFocus, isDisabledFocusOnUnmount, positionedFocusers, refreshModalFocusers,
	runCore,
	unfocus
} from ".";


import { Caret, findInDirection } from ".";
//import { IBindingModel } from "../../bindera";
//import { IMethodSemantic, isMethodSemantic } from "../../semantics";






//===






export var scrollIntoViewYOffset = 150;
export var scrollIntoViewTopOffset = 24;





export interface ScrollIntoViewOptions
{
	topOffset?: number;
}



export var $focusExecutingCount = 0;






//===






//let _re_ff_border_ = /^ff-border-/;
export const Task = new TaskQueue();






//===






export interface FocuserScopeOptions
{

	/** сквозная навигация */
	through?: boolean | {
		left?: boolean;
		up?: boolean;
		right?: boolean;
		down?: boolean;
	};

}






//export interface InspectArgs extends FrameOptions
//{
//}


//export type FrameCode = "view" | "edit" | string;

//export interface FrameOptions
//{

//	frameCode?: FrameCode;

//	panelIndex?: number;
//	float?: boolean;
//	pinned?: boolean;

//	anchor?: string[];
//	backAnchor?: string[];

//	prms?: { [key: string]: any; }

//}






//===






export interface FocuserProps
{

	//---



	key?: React.Key | null,
	ref?: React.Ref<Focuser>,

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
	scope?: boolean | FocuserScopeOptions;

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
	borderRadius?: Focuser.BorderRadius;
	borderWidth?: Focuser.BorderWidth;

	priority?: number;

	//cursorClassName?: string;
	//border?: boolean | number;
	//enterBorder?: boolean | number;
	//borderClassName?: string;

	borderer?: RefObject<{ updateByFocuser(ff: Focuser): void; }>;

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


	listener?: IFocuserListener | null;


	onFocus?: FocusEvent;
	onUnfocus?: UnfocusEvent;
	onItemFocus?: ItemFocusEvent;
	onItemUnfocus?: ItemUnfocusEvent;
	onChangeItemFocus?: ChangeItemFocusEvent;

	onClick?: ClickEvent;
	onContextMenu?: ContextMenuEvent;
	onKeyDown?: KeyDownEvent;

	onFocusLeft?: FocusDirEvent;
	onFocusUp?: FocusDirEvent;
	onFocusRight?: FocusDirEvent;
	onFocusDown?: FocusDirEvent;


	onEnter?: EnterEvent/* | IMethodSemantic*/;
	onItemEnter?: ItemEnterEvent/* | IMethodSemantic*/;
	onExit?: ExitEvent/* | IMethodSemantic*/;

	onInsert?: InsertEvent/* | IMethodSemantic*/;
	//onInspect?: InspectEvent/* | IMethodSemantic*/;
	onDelete?: DeleteEvent/* | IMethodSemantic*/;
	onActivate?: ActivateEvent/* | IMethodSemantic*/;
	onSelect?: SelectEvent/* | IMethodSemantic*/;

	onMount?: MountEvent;
	onUnmount?: UnmountEvent;


	//div?: boolean;
	//className?: string;
	//style?: React.CSSProperties;
	children: ReactNode;

	defaultEntered?: boolean;

	click?: FocuserClickBehavior | ((ff: Focuser) => FocuserClickBehavior);
	//enterOnClick?: boolean;
	hover?: boolean;
	domFocus?: boolean | "fast" | "lazy";

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






export type FocuserClickBehavior = boolean | "focus" | "unfocus" | "enter" | "focus, enter" | "focus; enter" | "enter, focus";// | "focus, row-expand; enter" | "focus, row-expand, enter";






export interface IFocuserListener
{

	ff_allowCtrlKey?: boolean;

	ff_onFocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
	ff_onUnfocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
	ff_onItemFocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
	ff_onItemUnfocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;
	ff_onChangeItemFocus?(ff: Focuser, prior: Focuser | null, next: Focuser | null): void;

	ff_onFocusLeft?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;
	ff_onFocusUp?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;
	ff_onFocusRight?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;
	ff_onFocusDown?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<void | boolean | Focuser>;


	ff_onClick?(ff: Focuser, e: MouseEvent): void | boolean | Promise<any>;
	ff_onContextMenu?(ff: Focuser, e: MouseEvent): void | boolean | Promise<any>;
	ff_onKeyDown?(ff: Focuser, e: KeyboardEvent): void | boolean | Promise<any>;

	ff_onEnter?(ff: Focuser): void | boolean | Promise<any>;
	ff_onItemEnter?(ff: Focuser, itemFf: Focuser): boolean | Promise<boolean>;
	ff_onExit?(ff: Focuser): void | boolean | Promise<void | boolean | Focuser>;

	ff_onInsert?(ff: Focuser): void | boolean | Promise<any>;
	//ff_onInspect?(ff: Focuser, e: InspectArgs): void | boolean | Promise<any>;
	ff_onDelete?(ff: Focuser): void | boolean | Promise<any>;
	ff_onActivate?(ff: Focuser, activated: boolean): void | boolean | Promise<any>;
	ff_onSelect?(ff: Focuser): void | boolean | Promise<any>;
	ff_onMount?(ff: Focuser): void;
	ff_onUnmount?(ff: Focuser): void;

}





export type MountEvent = (ff: Focuser) => void;
export type UnmountEvent = (ff: Focuser) => void;

export type FocusEvent = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
export type UnfocusEvent = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
export type ItemFocusEvent = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
export type ItemUnfocusEvent = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;
export type ChangeItemFocusEvent = (ff: Focuser, prior: Focuser | null, next: Focuser | null) => void;

export type FocusDirEvent = (ff: Focuser) => void | boolean | Promise<any>;

export type ClickEvent = (ff: Focuser, e: MouseEvent) => void | boolean | Promise<any>;
export type ContextMenuEvent = (ff: Focuser, e: MouseEvent) => void | boolean | Promise<any>;
export type KeyDownEvent = (ff: Focuser, e: KeyboardEvent) => void | boolean | Promise<any>;

export type EnterEvent = (ff: Focuser) => void | boolean | Promise<any>;
export type ItemEnterEvent = (ff: Focuser, itemFf: Focuser) => boolean | Promise<boolean>;
export type ExitEvent = (ff: Focuser) => void | boolean | Promise<void | boolean | Focuser | null>;

export type InsertEvent = (ff: Focuser) => void | boolean | Promise<any>;
export type EditEvent = (ff: Focuser) => void | boolean | Promise<any>;
//export type InspectEvent = (ff: Focuser, e: InspectArgs) => void | boolean | Promise<any>;
export type DeleteEvent = (ff: Focuser) => void | boolean | Promise<any>;
export type ActivateEvent = (ff: Focuser, activated: boolean) => void | boolean | Promise<any>;
export type SelectEvent = (ff: Focuser) => void | boolean | Promise<any>;






export interface FocusActionProps extends Pick<FocuserProps, "domFocus">
{

	outer?: boolean;

	focusFirst?: boolean;
	focusLast?: boolean;

	enter?: boolean;

	/** Автоматически переходить на указанный focuser при выходе. Если exitTarget=true, то используется текущий */
	exitTarget?: Focuser | true | null;

	skipIfItemFocused?: boolean;


	/** Вернуть результирующий focuser, не дожидаясь завершения анимации */
	awaitImmidiate?: boolean;

}





//===






export class Focuser extends Component<FocuserProps>
{

	//---



	static use(): Focuser | null
	{
		return useContext(FocuserContext);
	}



	static Caret = Caret;


	//static Borderer = Borderer;

	//static useBorderer()
	//{
	//	return useRef<Borderer>(null);
	//}



	static runCore = runCore;


	static current = currentFocuser;


	static defaultColor: MuiColor = "primary";



	//---



	static TRACE_DISABLED_CHECKS: boolean | undefined = false;



	//---



	static contextType = FocuserContext;

	context: Focuser | undefined;



	//---



	private static _instanceCount = 0;
	id: number = Focuser._instanceCount++;


	get cls() { return this.props.cls || null; }
	get name() { return this.props.name || null; }


	fullName()
	{

		let { cls, name } = this.props;

		return (cls || "") + (cls && name ? "-" : "") + (name || "");

	}


	get data() { return this.props.data; }
	get listener() { return this.props.listener; }
	//get model() { return this.props.model; }


	//get cursor(): Cursor | null
	//{

	//	if (this._cursor === undefined)
	//	{
	//		this._cursor = this.props.cursorRef?.current || this.parent?.cursor || null;
	//		//$log("cursor:", this._cursor);
	//		return this._cursor;
	//	}

	//	return this._cursor;
	//}

	//private _cursor?: Cursor | null;


	get cursorEl(): HTMLDivElement | null
	{
		if (this._cursorEl === undefined && !this.props.cursor)
		{
			this._cursorEl = this.parent?.cursorEl || null;
		}

		return this._cursorEl || null;
	}

	_cursorEl?: HTMLDivElement | null;
	setCursorEl?: (value: HTMLDivElement) => void;



	get parent() 	
	{
		return this.context;
	}



	get isScope() { return !!this.props.scope; }



	get scope(): Focuser | null
	{

		if (this._scope === undefined)
		{

			let parent = this.parent;


			if (!parent)
				return this._scope = null;


			return this._scope = (
				(parent.props.scope) && parent.enabled
					? parent
					: parent.scope
			);

		}


		return this._scope;

	}


	private _scope?: Focuser | null;



	get scopeOptions(): FocuserScopeOptions | null
	{

		if (this._scopeOptions === undefined)
		{
			let scope = this.props.scope;

			return (
				this._scopeOptions = !scope ? null :
					scope === true ? {} as FocuserScopeOptions :
						scope as FocuserScopeOptions
			);
		}


		return this._scopeOptions;

	}


	private _scopeOptions?: FocuserScopeOptions | null;



	get root() { return !!this.props.root };


	get local()
	{
		let local = this.props.local;
		return local || local === undefined;
	}



	get isPositioned()
	{
		return !this.props.hnav && !this.props.vnav;
	}


	get color() { return this.caret?.props.color ?? this.props.color ?? Focuser.defaultColor; }
	get borderRadius() { return this.caret?.props.borderRadius ?? this.props.borderRadius; }
	get borderWidth() { return this.caret?.props.borderWidth ?? this.props.borderWidth; }



	/** target element */
	get el()
	{

		//if (this.setEl)
		//{
		//	return this._el || null;
		//}


		if (this._el === undefined)
		{
			//if (this.props.element)
			//	this._el = this.props.element();
			//else
			this._el = ReactDOM.findDOMNode(this) as HTMLElement || null;

			this.initElement(this._el);

		}


		return this._el;

	}


	private _el?: HTMLElement | null;
	//private setEl?: (value: HTMLElement) => void;



	//get mode(): CursorMode
	//{
	//	if (this.props.mode)
	//		return this.props.mode;

	//	if (this.props.domFocus && this.domIsFocused())
	//		return "edit";

	//	return this.parent?.mode || "default";
	//}



	get modal()
	{
		return this.props.modal || false;
	}



	get level(): number
	{
		if (this._level === undefined)
		{
			this._level = (this.ghost ? 0 : 1) + (this.parent?.level || 0);
		}

		return this._level;
	}
	private _level?: number;



	get priority(): number
	{
		if (this._prioriry === undefined)
		{
			this._prioriry = (this.parent?.priority || 0) + (this.props.priority || 0);
		}

		return this._prioriry;
	}

	private _prioriry?: number;



	get ghost(): boolean
	{

		//if (this._ghost != null)
		//	return this._ghost;

		return this._ghost = !!(
			this.props.ghost ||
			//!this.el ||
			this.props.ghostIfParentIsCollapsed && this.parentIsCollapsed ||
			this.props.ghostIfParentIsNotFocused && this.parentIsNotFocused
		);

	};

	private _ghost?: boolean;



	get baseDisabled(): boolean
	{
		//$log("mounted:", this._mounted);
		//$log("props.disabled:", this.props.disabled);
		//$log("parent.baseDisabled:", this.parent?.baseDisabled);
		//$log("loadingMask.loading:", this.context.loadingMask?.loading);
		//$log("props.disableIfParentIsCollapsed:", this.props.disableIfParentIsCollapsed);
		//_$log("parentIsCollapsed:", this.parentIsCollapsed);
		//$log("props.disableIfParentIsNotFocused:", this.props.disableIfParentIsNotFocused);
		//_$log("parentIsNotFocused:", this.parentIsNotFocused);


		//if (this._baseDisabled != null)
		//	return this._baseDisabled;


		return this._baseDisabled = !!(
			this._unmounted /*|| this._externalDisabled*/ ||
			(this.props.disabled && !this.props.forceEnabled) ||
			this.parent?.baseDisabled ||
			SpaWaitingMask.isWaiting() ||
			this.props.disableIfParentIsCollapsed && this.parentIsCollapsed ||
			this.props.disableIfParentIsNotFocused && this.parentIsNotFocused
		);

	}


	private _baseDisabled?: boolean;



	get disabled()
	{
		//$log("mounted:", this._mounted);
		//$log("props.disabled:", this.props.disabled);
		//$log("parent.baseDisabled:", this.parent?.baseDisabled);
		//$log("loadingMask.loading:", this.context.loadingMask?.loading);
		//$log("props.disableIfParentIsCollapsed:", this.props.disableIfParentIsCollapsed);
		//$log("spread.expanded:", this.context.spread && !this.context.spread.expanded);

		//$log("priority:", this.priority);
		//$log("$min_priority:", $min_priority);
		//$log("baseDisabled:", this.baseDisabled);
		return this.priority < $min_priority || this.baseDisabled;
	}



	get enabled() { return !this.disabled; }


	get parentIsCollapsed(): boolean
	{

		return !!(
			this.parent?.props.collapsed //||
			//this.context.spread && !this.context.spread.expanded
		);

	}


	get parentIsNotFocused(): boolean
	{

		let parent = this.parent;

		return !!(
			parent && !(parent.focused || parent.itemFocused)
		);

	}



	ignoreOnKeyboardNavigation(): boolean
	{

		if (this._ignoreOnKeyboardNavigation != null)
		{
			return this._ignoreOnKeyboardNavigation;
		}


		return this._ignoreOnKeyboardNavigation = !!(
			!this.focused && !this.itemFocused &&
			(this.props.ignoreOnKeyboardNavigation !== undefined
				? this.props.ignoreOnKeyboardNavigation
				: this.parent?.ignoreOnKeyboardNavigation()
			)
		);

	}

	private _ignoreOnKeyboardNavigation?: boolean;



	clearState()
	{
		this._ghost = undefined; //null;
		this._baseDisabled = undefined;//null;
		this._ignoreOnKeyboardNavigation = undefined;//null;
	}



	//---



	padding(): number | [number, number, number, number] | null | undefined
	{
		return this.props.padding ?? this.parent?.props.itemPadding ?? this.props.defaultPadding;
	}


	safePadding(): [number, number, number, number]
	{

		let p = this.padding();

		return p == null ? [0, 0, 0, 0] : typeof p === "number" ? [p, p, p, p] : p;

	}



	carets: CaretBehavior[] = [];



	private _items?: Focuser[] | null;

	/**	items, отсортированные по priority */
	private _itemsByPriority?: Focuser[] | null;

	private _itemsChanged?: boolean;


	get items(): Focuser[] | null | undefined
	{

		this.resyncItems();

		return this._items;

	}



	get itemsByPriority(): Focuser[] | null | undefined
	{

		this.resyncItems();

		return this._itemsByPriority;

	}



	get hasItems()
	{
		return !!this.items?.length;
	}



	focusing?: boolean;

	focused?: boolean;
	itemFocused?: boolean;

	get isFocused() { return !!this.focused && !this.itemFocused }
	//get wasPriorFocused() { return !this.isFocused && this.id === priorFocuserId() }


	lastFocusedItem?: Focuser | null;


	useForceAnimation?: boolean;
	useFastAnimation?: boolean;
	useNoAnimation?: boolean;


	position?: { x1: number; y1: number; x2: number; y2: number; } | null;


	deleting?: boolean;



	/**	Предназначена для изменения поведения события Focuser.exit. Устанавливается для его parent */
	exitSlot?: Focuser;


	exitTargetId?: number | null;



	//---



	get localAnchor(): string | null
	{

		//if (this._localAnchor !== undefined)
		//	return this._localAnchor;



		if (this.props.name == null)
			return this._localAnchor = null;



		let anchor = this.fullName();
		anchor = anchor && encodeURIComponent(anchor);


		if (anchor && this.props.initAnchorProps)
		{

			let anchorProps = this.props.initAnchorProps();

			let propsStr = anchorPropsToString(anchorProps);

			if (propsStr)
				anchor += "?" + propsStr;

		}


		//$log("localAnchor:", anchor);

		return this._localAnchor = anchor;

	}


	private _localAnchor?: AnchorPart;



	anchor(): Anchor
	{
		let parentAnchor = this.parent?.anchor();

		let anchor: Anchor = [];

		parentAnchor && anchor.push(...parentAnchor);

		this.localAnchor && anchor.push(this._localAnchor!);

		return anchor.clip() as Anchor;
	}



	focusedAnchor()
	{

		if (this.focused)
			return this.anchor();


		if (this.itemFocused)
			return currentFocuser()!.anchor();


		return null;

	}



	applyAnchorProps(anchorProps: AnchorProps | null): any
	{
		return this.props.applyAnchorProps?.(anchorProps);
	}



	//---



	toString()
	{
		return (
			`Focuser[${this.id}] `
			+ this.fullName()
			+ (this.caret ? " " + this.caret : "")
			+ (" -lvl:" + this.level)
			+ (this.root ? " -root=" + this.root : "")
			+ (this.ghost ? " -ghost" : "")
			+ (this.focused ? " -focused" : "")
			+ (this.itemFocused ? " -itemFocused" : "")
		);
	}


	toLogValue()
	{

		let sb: any[] = [this.toString()];


		//if (this.caret)
		//{
		//	sb.push(" => ");
		//	sb.push(...this.caret.toLogValue());
		//}

		if (this._el)
			sb.push(this._el);

		return sb;

	}



	//---





	beginDelete(value: boolean = true)
	{

		this.deleting = value;

		this.modal && refreshModalFocusers();

	}



	private _unmounted?: boolean;



	componentDidMount()
	{

		//this._mounted = true;

		coreMountFocuser(this);

		//this.cursor?.addFocuser(this);


		if (!this.root)
		{

			let parent = this.parent;

			if (!parent)
			{
				$error(`Не удаётся найти parent`);
				return;
			}


			parent.addItem(this);


			if (this.props.exitSlot)
			{
				//$log("add exitSlot:", parent, ".exitSlot = ", this);
				parent.exitSlot = this;
			}

		}


		this.focusOnMount();


		this.props.onMount?.(this);

		this.props.listener?.ff_onMount?.(this);


	}



	private async focusOnMount()
	{

		let autoFocus = this.props.autoFocus;


		if (autoFocus)
		{

			if (typeof autoFocus === "number")
			{
				await adelay(autoFocus);
			}

			await this.focusAutoFocus() || this.ghost && await this.focusLastItemOrFirstWithHighPriority();

		}

	}



	private initElement(el: HTMLElement | null | undefined)
	{

		if (!el)
			return;


		let props = this.props;
		//this.domLevel = domLevel(el);


		if (props.hover/* !== false*/)
		{
			el.addEventListener("mouseover", e => this.onHover(e), false);
			el.addEventListener("mouseleave", e => this.onUnhover(e), false);
		}



		if (props.domFocus)
		{

			let control = this.getDOMControl(el);

			if (control)
			{
				control.addEventListener("focus", () => this.focus(), false);

				if (document.activeElement === control)
					this.focus();
			}

		}



		//this.updateCarets(null);
		this.updateBorderer();

	}



	get caret() { return this.carets[0] || null; }


	registerCaret(caret: CaretBehavior)
	{
		this.carets.register(caret);
	}



	removeCaret(caret: CaretBehavior)
	{
		this.carets.remove(caret);
	}



	updateCarets(prior: Focuser | null)
	{

		if (this.canFocus() && !this.carets.length)
		{
			$error(`Focuser: не найден Focuser.Caret для "${this}"`);
			_$log("focuser:", this);
		}


		this.carets.reverse().forEach(a => a.update(prior));

	}



	updateBorderer()
	{

		this.props.borderer?.current?.updateByFocuser(this);

	}


	shouldComponentUpdate(nextProps: any, nextState: any): boolean
	{

		this._prioriry = undefined;
		this._level = undefined;

		return true;// super.shouldComponentUpdate(nextProps, nextState);

	}



	componentDidUpdate()
	{

		this.updateBorderer();
		//this.updateCarets(null);


		if (this.focused && this.disabled /*&& !Bindera.$responseHasAction("focus")*/)
		{
			this.focusNearest();
		}

	}



	componentWillUnmount()
	{

		this._unmounted = true;


		//$log("currentFocuser():", currentFocuser());


		if (this.props.onUnmount || this.props.listener?.ff_onUnmount)
		{

			this.props.onUnmount?.(this);

			this.props.listener?.ff_onUnmount?.(this);

		}

		else if (this.focused && currentFocuser() === this)
		{

			//this.unfocus();

			if (/*this.props.disabledFocusOnUnmount !== true &&*/
				!isDisabledFocusOnUnmount()
				//**&& !Bindera.$responseHasAction("focus")
			)
			{
				Task.run(() => this.focusNearest());
				//this.focusNearest();
			}
			else
				this.unfocus();

		}



		coreUnmountFocuser(this);

		//this.cursor?.removeFocuser(this);



		this.el?.removeEventListener("mouseover", this.onHover);
		this.el?.removeEventListener("mouseleave", this.onUnhover);


		this._el = undefined;



		let parent = this.parent;

		if (!parent)
			return;



		parent.removeItem(this);

		if (parent.exitSlot === this)
			parent.exitSlot = undefined;  //null;



	}



	render()
	{

		this.clearState();



		let body: ReactNode = <FocuserContext.Provider
			value={this}
			children={this.props.children ?? null}
		/>;


		if (this.props.cursor)
		{

			if (!this.setCursorEl)
			{
				this.setCursorEl = a => this._cursorEl = a;
			}


			body = <>
				{body}
				<Div ref={this.setCursorEl} display="none" />
			</>;
		}


		return body;

	}



	//---



	/** сотрирует items по положению в DOM */
	private resyncItems()
	{


		if (!this._itemsChanged)
		{
			return;
		}



		let items = this._items;


		if (!items || !items.length)
		{
			this._items = null;
			this._itemsByPriority = null;
		}



		items!.sort((a, b) =>
		{

			if (a === b)
				return 0;


			if (!a.el || !b.el)
				return 0;


			if (a.el.compareDocumentPosition(b.el) & 2)
			{
				// b comes before a
				return 1;
			}


			return -1;

		});


		this._itemsByPriority = [...items!];

		this._itemsByPriority.sort((a, b) => (b.priority || 0) - (a.priority || 0));


		this._itemsChanged = false;

	}



	addItem(item: Focuser)
	{
		//$$log("item:", item);

		if (!this._items)
			this._items = [item];
		else
		{
			this._itemsChanged = this._items.register(item) || this._itemsChanged;
		}

		if (item.focused)
			this.setLastFocusedItem(item);
	}



	removeItem(item: Focuser)
	{
		//$$log("item:", item);

		if (this._items)
		{
			this._itemsChanged = this._items.remove(item) || this._itemsChanged;
		}


		if (this.lastFocusedItem === item)
		{
			this.setLastFocusedItem(null);
		}
	}



	setLastFocusedItem(value: Focuser | null, item?: Focuser | null)
	{

		this.lastFocusedItem = value;


		item = item || value;

		if (item && this.props.lastItemLikeBro && this.cls)
		{
			Focuser.lastItemsOfBro[this.cls] =
			{
				itemCls: item.cls,
				itemName: item.name
			};
		}


		this.parent?.setLastFocusedItem(
			this.isScope ? this : value || this,
			this
		);

	}



	//---



	private findInDirection(

		dir: "left" | "up" | "right" | "down",
		match?: (ff: Focuser) => boolean,
		_nvgId?: number

	): Focuser | null
	{

		if (!this.isPositioned)
			throw new Error(`Не поддерживается вызов метода .findInDirection() для focuser, отмеченного как hnav=${!!this.props.hnav} и vnav=${!!this.props.vnav}`);


		let ffs = positionedFocusers();

		if (!ffs?.length)
			return null;


		this.position = null;

		this.recalcPositionOfAll(ffs, _nvgId);

		if (!this.position)
			this.recalcPosition();


		//$log("ffs:", ffs.filter(a => a.position));

		return findInDirection(
			ffs, dir, this, match
		);

	}



	recalcPosition()
	{

		let el = this.el;

		if (!el)
			return null;


		let p = this.position;

		if (!p)
			this.position = p = {} as any;


		let pos = el.getBoundingClientRect();

		p!.x1 = pos.left;
		p!.y1 = pos.top;
		p!.x2 = pos.right;
		p!.y2 = pos.bottom;


		return p;

	}



	static _lastNavigationId?: number;



	private recalcPositionOfAll(focusers: Focuser[], _nvgId: number | undefined)
	{

		if (_nvgId === Focuser._lastNavigationId)
			return;


		Focuser._lastNavigationId = _nvgId;


		focusers.forEach(ff =>
		{
			if (ff.canFocus() && ff.isPositioned)
			{
				ff.recalcPosition();
			}
			else
			{
				ff.position = null;
			}
		});

	}




	//---



	parentBy(match?: (parent: Focuser) => boolean | Focuser): Focuser | null
	{

		if (match === undefined)
			match = a => a.canFocus();


		let parent = this.parent;


		while (parent)
		{

			let res = match(parent);


			if (res === true)
				return parent;


			if (res instanceof Focuser)
				return res;


			parent = parent.parent;

		}



		return null;

	}



	itemBy(match: (item: Focuser) => boolean | Focuser): Focuser | null
	{

		if (!match || !this.hasItems)
			return null;



		let items = this.items!;

		for (let item of items)
		{
			let res = match(item);

			if (res === true)
				return item;

			if (res instanceof Focuser)
				return res;
		}



		for (let item of items)
		{
			let res = item.itemBy(match);

			if (res)
				return res;
		}



		return null;

	}



	isParentOf(ff: Focuser): boolean
	{

		if (!ff)
			return false;



		let parent = ff.parent;

		while (parent)
		{
			if (parent === this)
				return true;

			parent = parent.parent;
		}



		return false;

	}



	first(
		match?: null | ((ff: Focuser) => boolean),
		itemsGetter?: (ff: Focuser) => Focuser[] | null | undefined
	): Focuser | null
	{

		let items = itemsGetter ? itemsGetter(this) : this.items;

		if (!items?.length)
			return null;


		let maxPriority = -Infinity;

		for (let item of items)
		{
			if (maxPriority < item.priority && item.enabled)
				maxPriority = item.priority;
		}


		for (let item of items)
		{

			if (item.priority < maxPriority || item.disabled)
				continue;


			let first = item.firstOrMe(match, itemsGetter);

			if (first)
				return first;

		}


		return null;

	}



	firstOrMe(
		match?: null | ((ff: Focuser) => boolean),
		itemsGetter?: (ff: Focuser) => Focuser[] | null | undefined
	): Focuser | null
	{

		if (match && !match(this))
			return null;


		if (this.props.overNav && this.canFocus())
			return this;


		let first = this.first(match, itemsGetter);

		if (first)
			return first;


		if (this.canFocus())
			return this;


		return null;

	}



	last(
		match?: null | ((ff: Focuser) => boolean),
		itemsGetter?: (ff: Focuser) => Focuser[]
	): Focuser | null
	{

		let items = itemsGetter ? itemsGetter(this) : this.items;

		if (!items?.length)
			return null;


		let minPriority = Infinity;

		for (let item of items)
		{
			if (minPriority > item.priority && item.enabled)
				minPriority = item.priority;
		}


		for (let i = items.length - 1; i >= 0; --i)
		{

			let item = items[i];

			if (item.priority > minPriority || item.disabled)
				continue;


			let last = item.lastOrMe(match, itemsGetter);

			if (last)
				return last;

		}


		return null;

	}



	lastOrMe(
		match?: null | ((ff: Focuser) => boolean),
		itemsGetter?: (ff: Focuser) => Focuser[]
	): Focuser | null
	{

		if (match && !match(this))
			return null;


		if (this.props.overNav && this.canFocus())
			return this;


		let last = this.last(match, itemsGetter);

		if (last)
			return last;


		if (this.canFocus())
			return this;


		return null;

	}



	lastFocused(deep?: boolean): Focuser | null
	{

		//$$log("this:", this);

		let lastFocusedItem = this.lastFocusedItem;

		if (lastFocusedItem && lastFocusedItem.enabled)
		{
			return deep ? lastFocusedItem.lastFocused() || lastFocusedItem : lastFocusedItem;
		}


		let { items } = this;

		if (!items)
			return null;



		for (let item of items)
		{
			let itemLast = item.lastFocused();

			if (itemLast)
				return itemLast;
		}


		return null;

	}



	firstSibling(match?: (sibling: Focuser) => boolean | Focuser): Focuser | null
	{

		let siblings = this.parent?.items;

		if (!siblings)
			return null;


		if (match === undefined)
			match = a => a.canFocus();


		for (let j = 0, len = siblings.length; j < len; j++)
		{

			let res = /*siblings[j].enabled &&*/ match(siblings[j]);


			if (res === true)
				return siblings[j];


			if (res instanceof Focuser)
				return res;

		}


		return null;

	}



	lastSibling(match?: (sibling: Focuser) => boolean | Focuser): Focuser | null
	{

		let siblings = this.parent?.items;

		if (!siblings)
			return null;


		if (match == null)
			match = a => a.canFocus();


		for (let j = siblings.length - 1; j >= 0; j--)
		{

			let res = /*siblings[j].enabled &&*/ match(siblings[j]);


			if (res === true)
				return siblings[j];


			if (res instanceof Focuser)
				return res;

		}


		return null;

	}



	priorSibling(match?: (sibling: Focuser) => boolean | Focuser | null): Focuser | null
	{

		let siblings = this.parent?.items;

		if (!siblings)
			return null;


		let i = siblings.indexOf(this);

		if (i < 0)
		{
			$error("Как-то странно:", this, "не нашёл себя в items в", this.parent);
			throw Error(`Как-то странно: не нашёл себя в parent.items`);

		}


		if (match == null)
			match = a => a.canFocus();


		for (let j = i - 1; j >= 0; j--)
		{

			let res = /*siblings[j].enabled &&*/ match(siblings[j]);


			if (res === true)
				return siblings[j];


			if (res instanceof Focuser)
				return res;

		}


		return null;

	}



	nextSibling(match?: (sibling: Focuser) => boolean | Focuser | null): Focuser | null
	{

		let siblings = this.parent?.items;

		if (!siblings)
			return null;


		let i = siblings.indexOf(this);

		if (i < 0)
		{
			$error("Как-то странно:", this, "не нашёл себя в items в", this.parent);
			throw Error(`Как-то странно: не нашёл себя в parent.items`);
		}


		if (match == null)
			match = a => a.canFocus();


		for (let j = i + 1, len = siblings.length; j < len; j++)
		{

			let res = /*siblings[j].enabled &&*/ match(siblings[j]);


			if (res === true)
				return siblings[j];


			if (res instanceof Focuser)
				return res;

		}


		return null;

	}



	prior(match?: (ff: Focuser) => boolean): Focuser | null
	{

		let priorSibling = this.priorSibling(a => a.lastOrMe(match));

		if (priorSibling)
			return priorSibling;



		let parent = this.parent;


		while (parent)
		{

			if (parent.root)
				break;


			let priorParent = parent.priorSibling(a => a.lastOrMe(match));

			if (priorParent?.canFocus())
				return priorParent;


			parent = parent.parent;

		}



		parent = this.parent;


		while (parent)
		{

			if (!parent.root && parent.canFocus())
				return parent;


			if (parent.ghost)
			{

				let priorParent = parent.priorSibling(a => a.lastOrMe(match));

				if (priorParent?.canFocus())
					return priorParent;

			}


			parent = parent.parent;

		}



		return null;

	}



	next(match?: (ff: Focuser) => boolean): Focuser | null
	{

		let nextSibling = this.nextSibling(a => a.firstOrMe(match));

		if (nextSibling)
			return nextSibling;



		let parent = this.parent;


		while (parent)
		{

			if (parent.root)
				break;


			let nextParent = parent.nextSibling(a => a.firstOrMe(match));

			if (nextParent?.canFocus())
				return nextParent;


			parent = parent.parent;

		}



		parent = this.parent;


		while (parent)
		{

			if (!parent.root && parent.canFocus())
				return parent;


			if (parent.ghost)
			{

				let nextParent = parent.nextSibling(a => a.firstOrMe(match));

				if (nextParent?.canFocus())
					return nextParent;

			}


			parent = parent.parent;

		}



		return null;

	}



	//---



	canFocus()
	{
		return (!!this.props.focusable || !this.ghost) && this.enabled;
	}



	async focus(focusProps?: FocusActionProps | null): Promise<Focuser | null>
	{

		if (this._unmounted)
		{
			//$error("Focuser: unmounted");
			return null;
		}


		//$log("focusing:", this.fullName(), this._el);

		let disabled = this.disabled;


		if (focusProps)
		{

			if (focusProps.skipIfItemFocused && this.itemFocused)
				return null;


			let { focusFirst, focusLast, enter, exitTarget, ...focusProps2 } = focusProps;



			if (!focusProps.exitTarget && this.props.exitToPrior)
			{
				exitTarget = currentFocuser();
			}


			if (exitTarget !== undefined)
			{
				this.exitTargetId = exitTarget === true ? currentFocuser()?.id : exitTarget?.id;
				//$log("set exitTargetId:", this.exitTargetId);
			}



			if (focusFirst && !disabled)
			{
				let ff2 = await this.focusFirst(focusProps2 as FocusActionProps);

				if (ff2)
					return ff2;
			}


			if (focusLast && !disabled)
			{
				let ff2 = await this.focusLast(focusProps2 as FocusActionProps);

				if (ff2)
					return ff2;
			}


			if (enter && !disabled)
			{
				let ff2 = await this.enter(focusProps2 as FocusActionProps) || await this.focus(focusProps2 as FocusActionProps);

				if (ff2)
					return ff2;
			}

			if (focusProps.outer && !this.canFocus())
			{
				return await this.focusParent(focusProps2 as FocusActionProps);
			}

		}




		if (!this.checkDisabled())
		{
			return null;
		}



		if (this.focused)
		{
			//$log("focused:", this.focused);
			return currentFocuser();
		}



		if (this.ghost)
		{
			return await this.enter();
		}



		try
		{
			$focusExecutingCount++;

			//FlowFocuser.$hoveringFocuserDisabled = true;

			this.focusing = true;


			await arequestAnimationFrame();


			this.doFocus(focusProps);


			//if (!(focusProps?.awaitImmidiate))
			//await adelay($animationDurationMs + 50);

			if (!(focusProps?.awaitImmidiate))
				await adelay(40);

			return this;
		}
		finally
		{
			this.focusing = false;

			if ($focusExecutingCount > 0)
				$focusExecutingCount--;
		}

	}



	private doFocus(focusProps?: FocusActionProps | null)
	{

		focuserFocus(this, focusProps);


		this.scrollIntoView();


		let domFocus0 = focusProps?.domFocus;
		let domFocus1 = this.props.domFocus;
		let domFocus = domFocus0 || domFocus1;


		if (domFocus === true)
		{
			if (domFocus1 === "lazy")
				this.focusDOM(true);
			else
				this.focusDOM();
		}

		else if (domFocus === "fast")
		{
			this.focusDOM(true);
		}

		else if (domFocus === "lazy")
		{
			this.focusDOM(true);
		}

		else
		{
			let active = document.activeElement as HTMLElement;
			active?.blur?.();
		}



		return this;

	}



	unfocus()
	{

		if (currentFocuser() === this)
		{
			focuserFocus(null);
		}

	}



	onFocus(prior: Focuser | null, next: Focuser | null, focusProps: FocusActionProps | null | undefined)
	{
		//$log("this.props.borderer:", this.props.borderer)

		this.props.onFocus?.(this, prior, next);

		this.props.listener?.ff_onFocus?.(this, prior, next);


		this.parent?.setLastFocusedItem(this);


		this.updateCarets(prior);
		this.updateBorderer();

	}



	onItemFocus(prior: Focuser | null, next: Focuser | null)
	{

		this.props.onItemFocus?.(this, prior, next);

		this.props.listener?.ff_onItemFocus?.(this, prior, next);

	}


	onItemUnfocus(prior: Focuser | null, next: Focuser | null)
	{

		this.props.onItemUnfocus?.(this, prior, next);

		this.props.listener?.ff_onItemUnfocus?.(this, prior, next);

	}


	onChangeItemFocus(prior: Focuser | null, next: Focuser | null)
	{

		this.props.onChangeItemFocus?.(this, prior, next);

		this.props.listener?.ff_onChangeItemFocus?.(this, prior, next);


		this.updateCarets(prior);
		this.updateBorderer();

	}



	onUnfocus(prior: Focuser | null, next: Focuser | null)
	{

		if (this._unmounted)
			return;


		this.exitTargetId = null;

		this.props.onUnfocus?.(this, prior, next);

		this.props.listener?.ff_onUnfocus?.(this, prior, next);


		this.updateCarets(prior);
		this.updateBorderer();


		if (this.props.domFocus)
		{
			this.unfocusDOM();
		}

	}



	//---



	private getDOMControl(el?: HTMLElement | null)
	{

		el = el || this.el;


		let control = el?.querySelector(
			`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`
		) as HTMLElement;


		return control;

	}



	domIsFocused()
	{
		return this.getDOMControl() === document.activeElement;
	}



	static domFocusing = false;



	async focusDOM(delay?: boolean)
	{

		if (Focuser.domFocusing)
			return false;


		let control = this.getDOMControl();

		if (!control)
			return false;


		if (control === document.activeElement)
			return false;


		Focuser.domFocusing = true;

		try
		{
			delay && await adelay(100);
			control.focus();
			(control as any)["select"]?.();
		}
		finally
		{
			Focuser.domFocusing = false;
		}


		return true;

	}



	unfocusDOM()
	{

		let control = this.getDOMControl();


		if (!control || control !== document.activeElement)
			return false;


		control.blur();


		return true;

	}



	//---



	scrollIntoView(cfg?: ScrollIntoViewOptions)
	{

		//console.profile("scrollIntoView");


		if (this.props.scrollIntoView === false || !this.el || !this.cursorEl)
			return false;


		let container = this.cursorEl.parentElement;
		//$log("container:", container);
		if (!container)
			return false;


		let topOffset = cfg?.topOffset ?? scrollIntoViewYOffset;


		let el = this._el!;

		let pos = el.getBoundingClientRect();
		let cpos = container.getBoundingClientRect();


		let top: number;

		//$log("pos.top:", pos.top);
		//$log("topOffset:", topOffset);
		//$log("cpos.top:", cpos.top);

		if (-cpos.top + pos.top - topOffset < 0)
		{
			top = container.scrollTop - cpos.top + pos.top - topOffset;
			//$log("top:", top);
		}

		else if (-cpos.bottom + pos.bottom + topOffset > 0)
		{
			let top1 = container.scrollTop - container.clientHeight + pos.bottom + topOffset;

			let top2 = container.scrollTop - cpos.top + pos.top - topOffset;

			//$log("top1:", top1);
			//$log("top2:", top2);
			top = Math.min(top1, top2);
		}
		else
		{
			return false;
		}


		if (Math.abs(top - container.scrollTop) <= 1)
		{
			return false;
		}

		//$log("top:", top);

		container.scrollTo({ top, behavior: "smooth" });

		return true;

	}



	scrollIntoViewTop(cfg?: ScrollIntoViewOptions): boolean
	{

		if (!this.el)
			return false;

		let el = this._el!;


		let container = this.cursorEl?.parentElement;
		//$log("container:", container);
		if (!container)
			return false;


		let topOffset = cfg?.topOffset ?? scrollIntoViewTopOffset;

		let pos = el.getBoundingClientRect();
		let cpos = container.getBoundingClientRect();

		let top = container.scrollTop - cpos.top + pos.top - topOffset;
		//$log("top:", top);
		//$log("scrollTop:", container.scrollTop)

		if (Math.abs(top - container.scrollTop) <= 1)
			return false;

		//$log("container.scrollHeight:", container.scrollHeight);
		//$log("el.clientHeight:", el.clientHeight);
		top = Math.min(top, container.scrollHeight - el.clientHeight);
		//$log("top:", top);

		container.scrollTo({ top, behavior: "smooth" });

		return true;

	}



	//getScrollParent(element, includeHidden?)
	//{

	//	let style = getComputedStyle(element);

	//	let excludeStaticParent = style.position === "absolute";

	//	let overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;


	//	if (style.position === "fixed")
	//	{
	//		return document.body;
	//	}


	//	for (let parent = element; (parent = parent.parentElement);)
	//	{

	//		style = getComputedStyle(parent);

	//		if (excludeStaticParent && style.position === "static")
	//			continue;

	//		if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX))
	//		{
	//			return parent;
	//		}

	//	}


	//	return document.body;

	//}



	async focusIfCan(focusProps?: FocusActionProps | null)
	{

		if (!this.canFocus())
			return null;

		return await this.focus(focusProps);

	}



	focusFirst(focusProps?: FocusActionProps | null)
	{
		return this.first()?.focus(focusProps);
	}



	focusFirstWithHighPriority(focusProps?: FocusActionProps | null)
	{

		let first = this.first(null, ff => ff.itemsByPriority);

		//$log("first:", first);

		return first?.focus(focusProps);

	}



	focusLast(focusProps?: FocusActionProps | null)
	{
		return this.last()?.focus(focusProps);
	}



	focusBy(match: (ff: Focuser) => boolean | Focuser, focusProps?: FocusActionProps | null)
	{
		return this.itemBy(match)?.focus(focusProps);
	}



	focusByName(name: string, focusProps?: FocusActionProps | null)
	{

		if (!name)
			return null;

		let item = this.itemBy(a => a.name === name);

		return item?.focus(focusProps);

	}



	//itemByAnchor(anchor: string[])
	//{
	//	if (!anchor || !anchor.length) return null;


	//	let item: Focuser = null;


	//	for (var name of anchor)
	//	{
	//		item = (item || this).itemBy(a => anchorStartWith(a.name, name));

	//		if (!item) break;
	//	}


	//	return item;
	//}



	//async focusByAnchor(anchor: string[], focusProps?: FocuserProps | null)
	//{
	//	let item = this.itemByAnchor(anchor);
	//	return item && await item.focus(focusProps);
	//}


	//focusPrior()
	//{
	//	let prior = this.prior();
	//	prior && prior.focus();
	//}



	focusNext(focusProps?: FocusActionProps | null, match?: (ff: Focuser) => boolean)
	{
		return this.next(match)?.focus(focusProps) || null;
	}



	focusPrior(focusProps?: FocusActionProps | null, match?: (ff: Focuser) => boolean)
	{
		return this.prior(match)?.focus(focusProps) || null;
	}



	focusInDirection(

		dir: "left" | "up" | "right" | "down",
		e: KeyboardEvent,
		match?: (ff: Focuser) => boolean,
		_nvgId?: number

	): Promise<boolean | Focuser | null> | null
	{

		let next = this.findInDirection(dir, match, _nvgId);


		if (next)
		{
			return next.focus(/*this.nextFocusProps()*/);
		}



		let through = this._scope?.scopeOptions?.through;

		if (through && (through === true || through[dir]))
		{

			if (this._scope!.ghost)
			{
				return this._scope!.navigate(dir, e, match, _nvgId);
			}


			return this._scope!.focus(/*this.nextFocusProps()*/);

		}


		return null;

	}



	focusParent(focusProps?: FocusActionProps | null)
	{

		let parent = this.parentBy();

		return parent?.focus(focusProps) || null;

	}



	async focusNearest(focusProps?: FocusActionProps | null)
	{

		let ff = await this.focusExitTarget();

		if (ff)
			return ff;



		let parent = this.parent;


		while (parent)
		{

			if (parent.disabled)
			{
				if ((ff = await parent.focusExitTarget(focusProps)))
					return ff;
			}
			else if (parent.ghost)
			{
				if ((ff = await parent.focusLastItem(focusProps) || await parent.focusExitTarget(focusProps)))
					return ff;
			}
			else
			{
				if ((ff = await parent.focusLastItem(focusProps) || await parent.focus(focusProps)))
					return ff;
			}


			parent = parent.parent;

		}



		return null;

	}



	focusOuter(focusProps?: FocusActionProps | null)
	{

		//$log("mounted:", this._mounted);
		//$log("props.disabled:", this.props.disabled);
		//$log("parent.baseDisabled:", this.parent?.baseDisabled);
		//$log("loadingMask.loading:", this.context.loadingMask?.loading);
		//$log("props.disableIfParentIsCollapsed:", this.props.disableIfParentIsCollapsed);
		//$log("spread.expanded:", this.context.spread && !this.context.spread.expanded);

		//$log("priority:", this.priority);
		//$log("$min_priority:", $min_priority);
		//$log("baseDisabled:", this.baseDisabled);

		if (this.canFocus())
			return this.focus(focusProps);

		return this.focusParent(focusProps);
	}




	findLastItem(): Focuser | null
	{

		//$log("items:", this.items);

		let result: Focuser | null;
		let lastItem = this.lastFocusedItem;


		if (lastItem?.enabled && (result = lastItem!.findLastItem()))
			return result;


		if (lastItem?.enabled && lastItem!.canFocus())
			return lastItem!;


		let items = this.itemsByPriority;


		if (!items)
			return null;


		for (let item of items)
		{

			if (item === lastItem)
				continue;


			if (item && (result = item.findLastItem()))
				return result;

		}


		return null;

	}



	focusLastItem(focusProps?: FocusActionProps | null)
	{
		return this.findLastItem()?.focus(focusProps);
	}


	async focusLastItemOrFirst(focusProps?: FocusActionProps | null)
	{
		return await this.focusLastItem(focusProps) || await this.focusFirst(focusProps);
	}



	async focusLastItemOrFirstWithHighPriority(focusProps?: FocusActionProps | null)
	{
		return await this.focusLastItem() || await this.focusFirstWithHighPriority();
	}



	static lastItemsOfBro: {
		[broCls: string]: {
			itemCls: string | null;
			itemName: string | null;
		}
	} = {};



	async focusLastItemLikeBro(focusProps?: FocusActionProps | null)
	{

		let cls = this.cls;

		if (!cls)
			return null;


		//$log("Focuser.lastItemsOfBro:", Focuser.lastItemsOfBro);

		let lastItemOfBro = Focuser.lastItemsOfBro[cls];

		if (!lastItemOfBro)
			return null;

		//$log("lastItemOfBro:", lastItemOfBro);
		let { itemCls, itemName } = lastItemOfBro;


		let item =
			this.itemBy(a => a.cls === itemCls && a.name === itemName) ??
			this.itemBy(a => a.cls === itemCls);


		return item && await item.focus(focusProps);

	}




	findAutoFocus(): Focuser | null
	{

		let props: FocuserProps = this.props;

		//$log(this, "items:", this.items);
		//$log(this, "autoFocus:", props.autoFocus);


		if (props.autoFocus === true)
		{
			return this; //.focus({ domFocus: "fast" });
		}

		else if (props.autoFocus === "lazy")
		{

			this.parent?.setLastFocusedItem(this);

			return this;

		}

		else if (props.autoFocus === "first")
		{

			let first = this.first();

			return first; //?.focus({ domFocus: "fast" });

		}

		else if (props.autoFocus && !this.ghost)
		{
			return this; //.focus({ domFocus: "fast" });
		}


		return this.findAutoFocusItem();

	}



	focusAutoFocus(focusProps?: FocusActionProps | null): Promise<Focuser | null> | null
	{
		return this.findAutoFocus()?.focus(focusProps) || null;
	}



	findAutoFocusItem(): Focuser | null
	{

		let items = this.itemsByPriority;

		if (!items)
			return null;


		let result: Focuser | null;

		for (let item of items)
		{
			if (item && (result = item.findAutoFocus()))
				return result;
		}


		return null;

	}



	focusAutoFocusItem(focusProps?: FocusActionProps | null): Promise<Focuser | null> | null
	{

		return this.findAutoFocusItem()?.focus(focusProps) || null;

	}



	focusExitTarget(focusProps?: FocusActionProps | null): Promise<Focuser | null> | null
	{

		//$log("exitTargetId:", this.exitTargetId);

		let exitTarget = focuserById(this.exitTargetId);

		//$log("exitTarget:", exitTarget);

		this.exitTargetId = null;

		return exitTarget?.focus(focusProps) || null;

	}



	//nextFocusProps()
	//{

	//	let domFocus = useWASD && this.domIsFocused() || undefined;

	//	return { domFocus } as FocusActionProps;

	//}



	//---



	checkDisabled(): boolean
	{

		if (!this.disabled)
			return true;

		if (!Focuser.TRACE_DISABLED_CHECKS)
			return false;



		$error("Попытка провести операцию над disabled-focuser-ом!");
		_$log("ff:", this);

		_$error("disabled:", this.disabled);

		if (this.priority < $min_priority)
		{
			__$error("priority < $min_priority");
			___$error("priority:", this.priority);
			___$error("$min_priority:", $min_priority);
		}


		_$error("baseDisabled:", this.baseDisabled);


		//if (this._baseDisabled)
		//{
		//	__$error("this._baseDisabled:", this._baseDisabled);
		//}


		if (this._unmounted)
		{
			__$error("unmounted:", this._unmounted);
		}


		if (this.props.disabled && !this.props.forceEnabled)
		{
			__$error("props.disabled:", this.props.disabled);
		}


		if (SpaWaitingMask.isWaiting())
		{
			__$error("SpaWaitingMask.isWaiting:", SpaWaitingMask.isWaiting());
		}


		if (this.props.disableIfParentIsCollapsed && this.parentIsCollapsed)
		{
			__$error("props.disableIfParentIsCollapsed:", this.props.disableIfParentIsCollapsed);
			__$error("parentIsCollapsed:", this.parentIsCollapsed);
		}


		if (this.props.disableIfParentIsNotFocused && this.parentIsNotFocused)
		{
			__$error("props.disableIfParentIsNotFocused:", this.props.disableIfParentIsNotFocused);
			__$error("parentIsNotFocused:", this.parentIsNotFocused);
		}


		if (this.parent?.baseDisabled)
		{
			__$error("parent.baseDisabled:", this.parent!.baseDisabled);
			$logb("parent:", () => this.parent!.checkDisabled());
		}



		return false;

	}



	async enter(focusProps?: FocusActionProps | null): Promise<Focuser | null>
	{

		if (this._unmounted)
			return null;


		if (!this.checkDisabled())
			return null;



		let props = this.props;


		if (props.onEnter)
		{
			//if (isMethodSemantic(props.onEnter))
			//{
			//	await props.onEnter.call(this.model, null);
			//	return currentFocuser();
			//}
			//else
			if (await props.onEnter(this) !== false)
			{
				return currentFocuser();
			}
		}



		if (props.listener?.ff_onEnter && await props.listener.ff_onEnter(this) !== false)
		{
			return currentFocuser();
		}



		if (props.domFocus === "lazy" && await this.focusDOM())
		{
			return currentFocuser();
		}



		//if (focusProps)
		//	focusProps = { ...this.nextFocusProps(), ...focusProps } as FocusActionProps;
		//else
		//	focusProps = this.nextFocusProps();



		let result: Focuser | null | undefined;



		if (props.lastItemLikeBro && (result = await this.focusLastItemLikeBro(focusProps)) && result !== this)
		{
			return result;
		}


		if ((result = await this.focusLastItem(focusProps)) && result !== this)
		{
			return result;
		}



		//else if (this.props.exitSlot && (result = await this.focusFirst(this.nextFocusProps()) /*|| await this.exit()*/) && result !== this)
		//{
		//	return result;
		//}



		if ((result = await this.focusFirst(focusProps)))
		{
			return result;
		}



		if (this.isScope)
		{
			return null;
		}



		let parent = this.parent;


		while (parent)
		{

			let onItemEnter = parent.props.onItemEnter;

			if (onItemEnter)
			{
				//if (isMethodSemantic(onItemEnter))
				//{
				//	await onItemEnter.call(this.model, null);
				//	return this;
				//}
				//else
				if (await onItemEnter(parent, this) !== false)
				{
					return this;
				}
			}



			if (parent.props.listener?.ff_onItemEnter && await parent.props.listener.ff_onItemEnter(parent, this) !== false)
				return this;


			if (parent.isScope)
				break;


			parent = parent.parent;

		}



		//result = await this.focusNext(focusProps);



		return null;

	}



	async enterOrFocus(focusProps?: FocusActionProps | null): Promise<Focuser | null>
	{

		if (this.hasItems && this._items!.find(a => a.enabled))
		{
			return await this.enter(focusProps) || await this.focus(focusProps);
		}
		else
		{
			return await this.focus(focusProps);
		}

	}



	async enterOrFocusNext(): Promise<Focuser | null>
	{

		if (this._unmounted)
			return null;


		return await this.enter() || await this.focusNext(/*this.nextFocusProps()*/);

	}



	async exit(): Promise<Focuser | null>
	{

		let props = this.props;



		if (props.onExit)
		{
			//if (isMethodSemantic(props.onExit))
			//{
			//	await props.onExit.call(this.model, null);
			//	return currentFocuser();
			//}
			//else
			if (await props.onExit(this) !== false)
			{
				return currentFocuser();
			}
		}



		if (props.listener?.ff_onExit && await props.listener.ff_onExit(this) !== false)
		{
			return currentFocuser();
		}



		let exitTarget = this.focusExitTarget();

		if (exitTarget)
			return exitTarget;



		if (props.domFocus === "lazy" && this.unfocusDOM())
			return currentFocuser();



		let parent = this.parent;


		while (parent)
		{

			//$log("parent:", parent);

			let exitSlot = parent.exitSlot;
			//$log("parent:", parent);
			//$log("exitSlot:", exitSlot);

			if (exitSlot && exitSlot !== this && !this.parentBy(a => a === exitSlot) && exitSlot.enabled)
			{

				if (!exitSlot.root)
				{

					let result = await exitSlot.focus();

					if (result)
					{
						return result;
					}

				}

			}


			if (parent.enabled)
			{

				if (parent.ghost)
				{

					let parentOnExit = parent.props.onExit;

					if (parentOnExit)
					{

						//if (isMethodSemantic(parentOnExit))
						//{
						//	await parentOnExit.call(this.model, null);
						//}
						//else
						//{

						let focusResult = await parentOnExit(this);

						if (focusResult instanceof Focuser)
							return focusResult;

						if (focusResult !== false)
							return null;

						//}

					}


					if (parent.props.listener?.ff_onExit)
					{

						let focusResult = await parent.props.listener.ff_onExit(this);

						if (focusResult instanceof Focuser)
							return focusResult;

						if (focusResult !== false)
							return null;

					}

				}

				else if (!parent.root)
				{

					let result = await parent.focus();

					if (result)
					{
						return result;
					}

				}

			}


			parent = parent.parent;

		}



		this.unfocus();

		return null;

	}



	async insert(applyToParents: boolean = true): Promise<boolean>
	{

		let props = this.props;


		if (props.onInsert)
		{
			//if (isMethodSemantic(props.onInsert))
			//{
			//	await props.onInsert.call(this.model, null);
			//	return true;
			//}
			//else
			if (await props.onInsert(this) !== false)
			{
				return true;
			}
		}



		if (props.listener?.ff_onInsert && await props.listener.ff_onInsert(this) !== false)
			return true;


		if (applyToParents && (!props.scope || this.focused) && this.parent && await this.parent.insert())
			return true;


		return false;

	}



	get inspectIsStarted() { return this._inspectIsStarted; }
	private _inspectIsStarted?: boolean;



	//async inspect(e?: InspectArgs, applyToParents: boolean = true): Promise<boolean>
	//{

	//	if (this._inspectIsStarted)
	//		return false;


	//	this._inspectIsStarted = true;



	//	try
	//	{
	//		e = e || {};

	//		let props = this.props;



	//		if (props.onInspect)
	//		{
	//			//if (isMethodSemantic(props.onInspect))
	//			//{
	//			//	await props.onInspect.call(this.model, null);
	//			//	return true;
	//			//}
	//			//else
	//			if (await props.onInspect(this, e) !== false)
	//			{
	//				return true;
	//			}
	//		}



	//		if (props.listener?.ff_onInspect && await props.listener.ff_onInspect(this, e) !== false)
	//		{
	//			return true;
	//		}



	//		if (applyToParents && !props.scope && this.parent && await this.parent.inspect(e))
	//		{
	//			return true;
	//		}



	//		return false;

	//	}
	//	finally
	//	{
	//		this._inspectIsStarted = false;
	//	}

	//}



	//get pinIsStarted() { return this._pinIsStarted; }
	//private _pinIsStarted: boolean;


	//async pin(applyToParents: boolean = true): Promise<boolean>
	//{
	//	if (this._pinIsStarted) return false;

	//	this._pinIsStarted = true;

	//	try
	//	{
	//		if (this.props.onPin && await this.props.onPin(this) !== false)
	//			return true;

	//		//$log("this.props.scope:", this.props.scope);

	//		if (applyToParents && (!this.props.scope || this.scopeOptions.through) && this.parent && await this._parent.pin())
	//			return true;

	//		return false;
	//	}
	//	finally
	//	{
	//		this._pinIsStarted = false;
	//	}
	//}



	//---



	get activated() { return this._activated === true; }
	protected _activated?: boolean;

	set activated(value: boolean) { this.toggleActivated(value); }



	//async activate(): Promise<boolean>
	//{
	//	if (this.props.onActivate && await this.props.onActivate(this) !== false)
	//		return true;

	//	if (!this.props.scope && this.parent && await this._parent.activate())
	//		return true;


	//	await this.enter();


	//	return false;
	//}



	async activate()
	{
		this.toggleActivated(true);
	}



	async deactivate()
	{
		this.toggleActivated(false);
	}



	async toggleActivated(force?: boolean)
	{

		if (force === undefined)
		{
			this._activated = !this._activated;
		}

		else if (force !== !!this._activated)
		{
			this._activated = force;
		}

		else
		{
			return false;
		}



		let props = this.props;



		if (props.onActivate)
		{
			//if (isMethodSemantic(props.onActivate))
			//{
			//	await props.onActivate.call(this.model, null);
			//	return true;
			//}
			//else
			if (await props.onActivate(this, this._activated) !== false)
			{
				return true;
			}
		}



		if (props.listener?.ff_onActivate && await props.listener.ff_onActivate(this, this._activated) !== false)
		{
			return true;
		}



		if (!props.scope && this.parent && await this.parent.toggleActivated(force))
		{
			return true;
		}



		if (this._activated)
		{
			return !!await this.enter();
		}



		return false;

	}



	//---



	async delete()
	{

		let props = this.props;



		if (props.onDelete)
		{
			//if (isMethodSemantic(props.onDelete))
			//{
			//	await props.onDelete.call(this.model, null);
			//	return true;
			//}
			//else
			if (await props.onDelete(this) !== false)
			{
				return true;
			}
		}


		if (props.listener?.ff_onDelete && await props.listener.ff_onDelete(this) !== false)
		{
			return true;
		}


		return false;

	}



	async select(applyToParents: boolean = true)
	{

		let props = this.props;



		if (props.onSelect)
		{
			//if (isMethodSemantic(props.onSelect))
			//{
			//	await props.onSelect.call(this.model, null);
			//	return true;
			//}
			//else
			if (await props.onSelect(this) !== false)
			{
				return true;
			}
		}



		if (props.listener?.ff_onSelect && await props.listener.ff_onSelect(this) !== false)
			return true;


		if (applyToParents && !props.scope && this.parent && await this.parent.select())
			return true;

		//if (this.props.onEnter && this.props.onEnter(this))
		//	return;

		//if (this.props.domFocus === "lazy" && this.focusDOM())
		//	return;


		return false;

	}



	//---



	async forceAnimation(delay: number = $animationDurationMs)
	{

		this.useForceAnimation = true;

		await adelay(delay);

		this.useForceAnimation = false;

	}



	async fastAnimation(delay: number = $animationDurationMs)
	{

		this.useFastAnimation = true;

		await adelay(delay);

		this.useFastAnimation = false;

	}



	//static pauseAnimationId = 0;


	async pauseAnimation(delay?: number, delayOffset?: number)
	{

		//let id = Focuser.pauseAnimationId++;
		//$log(`[${id}] pauseAnimation: BEGIN`);


		this.useNoAnimation = true;


		if (delay == null)
			delay = $animationDurationMs + (delayOffset || 0);
		else
			delay += (delayOffset || 0);


		//$log("delay:", delay);


		await adelay(delay);


		this.useNoAnimation = false;

		//$log(`[${id}] pauseAnimation: END`);

	}



	//---



	canKeyDown()
	{
		return this.enabled;
	}



	async onKeyDown(e: KeyboardEvent)
	{

		if (!this.canKeyDown())
			return;

		//let e2 = cloneEvent(e) as KeyboardEvent;


		if (this.root)
		{
			await this.rootKeyDown(e/*e2*/);
		}
		else
		{
			try
			{
				if (await this.defaultKeyDown(e/*e2*/) === false)
				{
					await (!this.isScope || !this.itemFocused) && this.parent?.onKeyDown(e);
				}
			}
			catch (ex)
			{
				$error(ex);
			}
		}



		//function cloneEvent<TEvent extends Event>(evt: TEvent, props?): TEvent
		//{

		//	const proxy = new Proxy(evt, {
		//		get: (target, prop) => props && props[prop] || target[prop]
		//	});


		//	let cnstr = evt.constructor as any;

		//	return new cnstr(evt.type, proxy) as TEvent;

		//}

	}



	async rootKeyDown(e: KeyboardEvent)
	{

		if (!this.checkDisabled())
			return;


		if (this.props.onKeyDown && await this.props.onKeyDown(this, e) !== false)
			return;


		if (this.props.listener?.ff_onKeyDown && await this.props.listener.ff_onKeyDown(this, e) !== false)
			return;


		let key = e.key as any;
		let code = e.code;
		let alt = e.altKey;
		let ctrl = e.ctrlKey;
		let shift = e.shiftKey;


		if (!alt && !ctrl && !shift)
		{
			if (key === Key.ArrowUp || key === Key.ArrowDown || key === Key.Enter || key === " " ||
				code === "KeyW" || code === "KeyS" || code === "KeyE"
			)
			{
				if (this.lastFocusedItem?.enabled)
					await this.lastFocusedItem.focus();
				else
					await this.focusFirst();
			}
			else
				return;
		}
		else
			return;


		e.preventDefault();

	}




	_navigating?: boolean;
	static _navigationCount = 0;



	async navigate(

		dir: "left" | "up" | "right" | "down",
		e: KeyboardEvent,
		match?: (ff: Focuser) => boolean,
		_nvgId?: number

	): Promise<boolean | Focuser | null>
	{

		//return await this.focusInDirection(dir, this.nextFocusProps());
		if (this._navigating)
			return true;


		this._navigating = true;

		try
		{


			let props = this.props;



			if (dir === "left")
			{

				if (props.onFocusLeft && await props.onFocusLeft(this) !== false)
					return null;

				if (props.listener?.ff_onFocusLeft)
				{
					let focusResult = await props.listener.ff_onFocusLeft(this, e);

					if (focusResult instanceof Focuser)
						return focusResult;

					if (focusResult !== false)
						return null;

				}

			}

			else if (dir === "up")
			{

				if (props.onFocusUp && await props.onFocusUp(this) !== false)
					return null;

				if (props.listener?.ff_onFocusUp)
				{
					let focusResult = await props.listener.ff_onFocusUp(this, e);

					if (focusResult instanceof Focuser)
						return focusResult;

					if (focusResult !== false)
						return null;

				}

			}

			else if (dir === "right")
			{

				if (props.onFocusRight && await props.onFocusRight(this) !== false)
					return null;

				if (props.listener?.ff_onFocusRight)
				{
					let focusResult = await props.listener.ff_onFocusRight(this, e);

					if (focusResult instanceof Focuser)
						return focusResult;

					if (focusResult !== false)
						return null;

				}

			}

			else if (dir === "down")
			{

				if (props.onFocusDown && await props.onFocusDown(this) !== false)
					return null;

				if (props.listener?.ff_onFocusDown)
				{
					let focusResult = await props.listener.ff_onFocusDown(this, e);

					if (focusResult instanceof Focuser)
						return focusResult;

					if (focusResult !== false)
						return null;

				}

			}



			if (_nvgId == null)
				_nvgId = Focuser._navigationCount++;



			if (props.hnav || props.vnav)
			{

				let next: Focuser | null = null;


				if (dir === "left" || dir === "up")
				{
					next = this.prior(match);
				}
				else if (dir === "right" || dir === "down")
				{
					next = this.next(match);
				}


				if (next && next.props.focusable && next.ghost)
				{
					return await this.focusInDirection(dir, e, match, _nvgId);
				}


				return next && await next.focus(/*this.nextFocusProps()*/);

			}



			return await this.focusInDirection(dir, e, match, _nvgId);

		}
		finally
		{
			this._navigating = false;
		}

	}



	async defaultKeyDown(e: KeyboardEvent): Promise<boolean>
	{

		let props = this.props;



		if (props.onKeyDown && await props.onKeyDown(this, e) !== false)
		{
			e.preventDefault();
			return true;
		}



		if (props.listener?.ff_onKeyDown && await props.listener.ff_onKeyDown(this, e) !== false)
		{
			e.preventDefault();
			return true;
		}



		let key = e.key;
		let code = e.code;
		let alt = e.altKey;
		let ctrl = e.ctrlKey;
		let shift = e.shiftKey;



		if (!alt && (!ctrl || props.allowCtrlKey || props.listener?.ff_allowCtrlKey) && (!shift || props.allowShiftKey))
		{

			if (key === Key.ArrowLeft || code === "KeyA")
			{

				e.preventDefault();

				await Task.run(() => this.navigate("left", e, ignoreOnKeyboardNavigation));

			}


			else if (key === Key.ArrowRight || code === "KeyD")
			{

				e.preventDefault();

				await Task.run(() => this.navigate("right", e, ignoreOnKeyboardNavigation));

			}


			else if (key === Key.ArrowUp || code === "KeyW")
			{

				e.preventDefault();

				if (!await Task.run(() => this.navigate("up", e, ignoreOnKeyboardNavigation)))
				{
					vScroll(this.cursorEl, /*this.el,*/ -1 as -1);
				}

			}


			else if (key === Key.ArrowDown || code === "KeyS")
			{

				e.preventDefault();

				if (!await Task.run(() => this.navigate("down", e, ignoreOnKeyboardNavigation)))
				{
					vScroll(this.cursorEl, /*this.el,*/ 1);
				}

			}


			else if (this.enabled)
			{

				if (key === Key.Enter || code === "KeyE")
				{
					e.preventDefault();
					await Task.run(() => this.enterOrFocusNext());
				}


				else if (key === Key.Escape || code === "KeyQ")
				{
					e.preventDefault();
					await Task.run(() => this.exit());
				}


				else if (key === Key.Insert)
				{
					e.preventDefault();
					await Task.run(() => this.insert());
				}


				//else if (key === Key.Tab)
				//{
				//	e.preventDefault();
				//	e.stopPropagation();
				//	await Task.run(() => this.inspect({ frameCode: "next", float: false, }));
				//}


				//else if (key === Key.F2)
				//{
				//	e.preventDefault();
				//	await Task.run(() => this.inspect({ frameCode: "view", float: true, }));
				//}


				//else if (key === Key.F4)
				//{
				//	e.preventDefault();
				//	await Task.run(() => this.inspect({ frameCode: "view", float: false }));
				//	//await this.pin();
				//}


				else if (key === Key.Delete)
				{
					e.preventDefault();
					await Task.run(() => this.delete());
				}


				else if (key === " ")//Key.Space)
				{
					e.preventDefault();
					e.stopPropagation();
					await Task.run(() => this.toggleActivated());
				}


				else if (key === Key.Shift)
				{
					e.preventDefault();
					await Task.run(() => this.select());
				}


				else
				{
					return false;
				}

			}


			else
			{
				return false;
			}


		}
		else if (!alt && !ctrl && shift)
		{
			//else if (key === Key.Tab)
			//{
			//	e.preventDefault();
			//	await this.inspect();
			//}

			return false;
		}



		//FlowFocuser.$hoveringFocuserDisabled = true;


		return true;




		function ignoreOnKeyboardNavigation(ff: Focuser)
		{
			return !ff.ignoreOnKeyboardNavigation();
		}

	}



	//---



	canClick()
	{
		return this.enabled && !!(this.props.click /*&& !this.ghost*/ || this.props.onClick || this.props.listener?.ff_onClick);
	}


	canContextMenu()
	{
		return this.enabled && !!(this.props.onContextMenu || this.props.listener?.ff_onContextMenu);
	}



	async onClick(e: MouseEvent): Promise<boolean>
	{

		if (!this.canClick())
			return false;



		let props = this.props;

		//$log("props.onClick:", props.onClick);

		if (props.onClick || props.listener?.ff_onClick)
		{

			//beginFreeze();

			//try
			//{

			if (props.onClick && await props.onClick(this, e) !== false)
				return true;

			if (props.listener?.ff_onClick && await props.listener.ff_onClick(this, e) !== false)
				return true;

			//	}
			//	finally
			//	{
			//		endFreeze();
			//	}

		}



		if (await this.defaultClick(e))
			return true;



		return !!this.parent && this.parent.canClick() && await this.parent.onClick(e);

	}



	async defaultClick(e: MouseEvent)
	{

		let props = this.props;

		let click = typeof props.click === "function" ? props.click(this) : props.click;


		//$log("click:", click);
		//$log("this.focused:", this.focused);


		if (click === true || click === "focus")
		{
			if (!this.focused /*&& !this.ghost*/)
			{
				if (!await this.focus())
				{
					if (this.ghost)
						return false;
				}
			}
			else if (/*props.enterOnClick ||*/ this.ghost)
			{
				await this.enter();
			}
		}


		else if (click === "focus, enter")
		{
			await this.enter();

			await this.focus();
		}


		else if (click === "focus; enter")
		{
			if (!this.focused)
			{
				await this.focus();
			}
			else 
			{
				await this.enter();
			}
		}


		else if (click === "enter")
		{
			await this.enter();
		}


		else if (click === "enter, focus")
		{
			this.enter();

			await this.focus();
		}


		else if (click === "unfocus")
		{
				/*this.*/unfocus();
		}


		//else if (click === "focus, row-expand; enter")
		//{
		//	if (!this.focused)
		//	{
		//		//$log("focus");
		//		this.focus();


		//		let row = this.context.row;

		//		if (row && !row.expanded)
		//		{
		//			//$log("row expand");
		//			await row.expand();
		//		}
		//		else
		//		{
		//			//$log("toggle1");
		//			await this.enter();
		//		}
		//	}
		//	else
		//	{
		//		//$log("toggle2");
		//		await this.enter();
		//	}
		//}


		//else if (click === "focus, row-expand, enter")
		//{
		//	//$log("focus");

		//	let row = this.context.row;

		//	if (row && !row.expanded)
		//	{
		//		await row.expand();
		//	}


		//	await this.focus();

		//	await this.enter();
		//}


		else
			return false;



		return true;

	}



	async onContextMenu(e: MouseEvent): Promise<boolean>
	{

		if (!this.canContextMenu())
			return false;


		let props = this.props;


		if (props.onContextMenu && await props.onContextMenu(this, e) !== false)
			return true;


		if (props.listener?.ff_onContextMenu && await props.listener.ff_onContextMenu(this, e) !== false)
			return true;


		if (await this.defaultContextMenu(e))
			return true;


		return !!this.parent && this.parent.canContextMenu() && await this.parent.onContextMenu(e);

	}



	async defaultContextMenu(e: MouseEvent)
	{
		return false;
	}



	onHover(e: MouseEvent)
	{


		//FlowFocuser.$hoveringFocuserDisabled = false;



		if (this.ghost || this.disabled)
			return;



		//if (this.props.nohoverCollapsed)
		//{
		//	let spread = this.context.spread;

		//	if (spread && !spread.expanded)
		//		return;
		//}



		//hoverFocuser(this);



		if (this.props.hover)
		{
			!this.focused && this.focus();
		}


		e.stopPropagation();

	}



	onUnhover(e: MouseEvent)
	{

		//if (unhoverFocuser(this))
		//{
		//	e.stopPropagation();
		//}

	}



	//---

}






//===






export module Focuser
{



	export type BorderRadius = (
		null /* 0 */ |
		undefined |
		"inherit" /* default */ |
		string |
		Values.Many<number | boolean>
	);


	export type BorderWidth = Values.Many<number | boolean>;



	export type Props = FocuserProps;
	export type Listener = IFocuserListener;

	export const Tasks = Task;



}






//===






//function domLevel(el: any)
//{
//	let i = 0;
//	while (el)
//	{
//		el = el.parentNode;
//		i++;
//	};
//	return i;
//}



function vScroll(scroller: HTMLElement | null | undefined, /*el: HTMLElement | null,*/ dir: -1 | 1)
{

	//let scroller = el && el.offsetParent as HTMLElement;

	if (!scroller)
		return;


	//let overflowY = getComputedStyle(scroller).overflowY;


	//while (scroller && (overflowY !== "scroll" && overflowY !== "auto"))
	//{

	//	//$log("offsetParent:", scroller, overflowY);
	//	scroller = scroller.offsetParent as HTMLElement;

	//	if (!scroller)
	//		break;


	//	overflowY = getComputedStyle(scroller).overflowY;

	//}


	//$log("scroller:", scroller, overflowY);

	if (scroller)
	{
		scroller.scrollBy({ top: dir * scroller.offsetHeight / 10, behavior: "smooth" });
	}

}
