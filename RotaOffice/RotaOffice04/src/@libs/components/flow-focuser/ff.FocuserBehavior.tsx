import { createRef } from "react";

import { $defaultAnimationDurationMs, $log, SpaWaitingMask } from "../core";

import { adelay, arequestAnimationFrame, Keys } from "../core";


import { anchorPropsToString, type Anchor, type AnchorPart, type AnchorProps } from "./ff.Anchor";
import { Caret } from "./ff.Caret";
import { CaretBehavior } from "./ff.CaretBehavior";
import { $min_priority, coreMountFocuser, coreUnmountFocuser, currentFocuser, focuserById, focuserFocus, isDisabledFocusOnUnmount, positionedFocusers, refreshModalFocusers, unfocus } from "./ff.Core";
import { Events } from "./ff.Events";
import type { Focuser } from "./ff.Focuser";
import { findInDirection } from "./ff.Navigation";
import { Scroll } from "./ff.Scroll";
import { Task } from "./ff.Task";






//===






export var $focusExecutingCount = 0;






//===






//type Focuser = FocuserBehavior;
type FocusActionProps = Focuser.FocusActionProps;






export class FocuserBehavior //extends Component<FocuserProps>
{

	//---



	//static useContext(): Focuser | null
	//{
	//	return useContext(FocuserContext);
	//}



	//static Core = Core;


	//static current = currentFocuser;


	//static defaultColor: MuiColor = "primary";



	//---



	static TRACE_DISABLED_CHECKS: boolean | undefined = false;



	//---



	//static override contextType = FocuserContext;

	//override context: Focuser | undefined = undefined;



	//---



	constructor(
		public parent: Focuser | null,
	)
	{

	}


	props!: Focuser.Props;


	setProps(props: Focuser.Props)
	{
		this.props = { ...props };
	}




	static #instanceCount = 0;
	id: number = FocuserBehavior.#instanceCount++;


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



	get scopeOptions(): Focuser.ScopeOptions | null
	{

		if (this._scopeOptions === undefined)
		{
			let scope = this.props.scope;

			return (
				this._scopeOptions = !scope ? null :
					scope === true ? {} as Focuser.ScopeOptions :
						scope as Focuser.ScopeOptions
			);
		}


		return this._scopeOptions;

	}


	private _scopeOptions?: Focuser.ScopeOptions | null;



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


	get color() { return this.caret?.props.color ?? this.props.color ?? Caret.defaultColor; }
	get borderRadius() { return this.caret?.props.borderRadius ?? this.props.borderRadius; }
	get borderWidth() { return this.caret?.props.borderWidth ?? this.props.borderWidth; }



	/** target element */
	get el(): HTMLElement | null
	{

		//let refEl = this.elRef.current;


		//$log.___("#el:", this.#el)
		//$log.___("refEl:", refEl)

		//if (this.#el != refEl)
		//{
		//	this.#el = refEl;

		//	this.initElement(refEl);
		//}


		/*return refEl || null;*/



		return this.elRef.current || null;

		////if (this.setEl)
		////{
		////	return this._el || null;
		////}


		//if (this._el === undefined)
		//{
		//	//if (this.props.element)
		//	//	this._el = this.props.element();
		//	//else
		//	this._el = ReactDOM.findDOMNode(this) as HTMLElement || null;
		//	//this._el = this.caret?.el;

		//	this.initElement(this._el);

		//}


		//return this._el;

	}
	//#el?: HTMLElement | null;

	readonly elRef = createRef<HTMLElement>();
	get divRef() { return this.elRef as React.RefObject<HTMLDivElement> }
	//private _el?: HTMLElement | null;
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

		return this._level!;
	}
	private _level?: number;



	get priority(): number
	{
		if (this._prioriry === undefined)
		{
			this._prioriry = (this.parent?.priority || 0) + (this.props.priority || 0);
		}

		return this._prioriry!;
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



	#listeners?: Events.Listener[];


	addListener(listener: Events.Listener): Events.Listener | null
	{

		let listeners = this.#listeners ??= [];


		if (listeners.indexOf(listener) >= 0)
			return null;

		listeners.push(listener);

		return listener;

	}


	removeListener(listener: Events.Listener | null | undefined): boolean
	{
		return listener && this.#listeners?.remove(listener) || false;
	}



	on(listener: Events.Listener): () => void
	{

		let listeners = this.#listeners ??= [];

		if (listeners.indexOf(listener) < 0)
		{
			listeners.push(listener);
		}

		return () => this.removeListener(listener);

	}


	//addListeners(...newListeners: Focuser.IListener[]): () => void
	//{

	//	let listeners = this.#listeners ?? (this.#listeners = new Set());


	//	newListeners.forEach(listeners.add, listeners);


	//	return () =>
	//	{
	//		newListeners.forEach(listeners.delete, listeners);
	//	};

	//}



	hasListenerEvent(eventName: Events.Name): boolean
	{
		return !!(
			this.props.listener && this.props.listener[Events.toBehaviorEventName(eventName)] ||
			this.#listeners?.find(a => a[eventName])
		);
	}


	callListenerEvent<
		TEventName extends Events.Name,
		TEvent extends NonNullable<Events.Listener[TEventName]>,
		TArgs extends Parameters<TEvent>
	>(
		eventName: TEventName,
		...args: TArgs
		//caller: (event: TEvent) => void
	): void
	{

		call(this.props.listener, Events.toBehaviorEventName(eventName));

		this.#listeners?.forEach(l =>
		{
			call(l, eventName);
		});


		function call(listener: any, eventName: string)
		{
			var eventMethod = listener?.[eventName] as Function;

			eventMethod && eventMethod.apply(listener, args);
		}
	}


	async callListenerEventUntil<
		TEventName extends Events.Name,
		TEvent extends NonNullable<Events.Listener[TEventName]>,
		TArgs extends Parameters<TEvent>
	>(
		eventName: TEventName,
		...args: TArgs
		//caller: (event: TEvent) => void | boolean | Promise<void | boolean | Focuser>,

	): Promise<boolean>
	{

		if (await call(this.props.listener, Events.toBehaviorEventName(eventName)))
			return true;


		if (this.#listeners)
		{
			for (let l of this.#listeners)
			{
				if (await call(l, eventName))
					return true;
			}
		}


		return false;


		async function call(listener: any, eventName: string): Promise<boolean>
		{

			var eventMethod = listener?.[eventName] as Function;

			if (!eventMethod)
				return false;


			let result = eventMethod && await eventMethod.apply(listener, args);

			return result !== false;

		}

	}



	//TODO: eventName заменить на метод
	async callListenerEventUntilFocuser<
		TEventName extends Events.Name,
		TEvent extends NonNullable<Events.Listener[TEventName]>,
		TArgs extends Parameters<TEvent>
	>(
		eventName: TEventName,
		...args: TArgs
		//caller: (event: TEvent) => void | boolean | Promise<void | boolean | Focuser>
	): Promise<Focuser | null | undefined>
	{

		let ff = await call(this.props.listener, Events.toBehaviorEventName(eventName));

		if (ff != undefined)
			return ff;


		if (this.#listeners)
		{
			for (let l of this.#listeners)
			{

				let ff = await call(l, eventName);

				if (ff != undefined)
					return ff;

			}
		}


		return undefined;



		async function call(listener: any, eventName: string): Promise<Focuser | null | undefined>
		{

			var eventMethod = listener?.[eventName] as Function;

			if (!eventMethod)
				return undefined;


			//let focusResult = await caller(((...args: any[]) => (eventMethod as Function).apply(listener, args)) as any);
			let focusResult = await eventMethod.apply(listener, args);

			if (focusResult instanceof FocuserBehavior)
				return focusResult;

			if (focusResult !== false)
				return null;


			return undefined;

		}


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
	borderers?: Array<(ff: Focuser) => void>;
	itemBorderers?: Array<(ff: Focuser) => void>;


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
			`Focuser[${this.id}]`
			+ (this.ghost ? ".Ghost" : "")
			+ " "
			+ this.fullName()
			+ (this.caret ? " " + this.caret : "")
			+ (" -lvl:" + this.level)
			+ (this.root ? " -root=" + this.root : "")
			+ (this.props.focusable ? " -focusable" : "")
			+ (this.focused ? " -focused" : "")
			+ (this.itemFocused ? " -itemFocused" : "")
			+ (this.disabled ? " -disabled" : "")
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

		if (this.el)
			sb.push(this.el);

		return sb;

	}



	//---





	beginDelete(value: boolean = true)
	{

		this.deleting = value;

		this.modal && refreshModalFocusers();

	}



	private _unmounted?: boolean;

	get isFirstMount() { return this._unmounted === undefined; }


	//@$log.m
	willMount()
	{

		coreMountFocuser(this);


		this.#addToParent();


		this._unmounted = false;

	}


	//@$log.m
	updateDidMount()
	{

		this._prioriry = undefined;
		this._level = undefined;

		let { el, props } = this;


		if (el && props.hover)
		{
			el.addEventListener("mouseover", this.#onHover, false);
			el.addEventListener("mouseleave", this.#onUnhover, false);
		}


		let control: HTMLElement | null = null;

		if (el && props.domFocus)
		{
			control = this.getDOMControl(el);
			control?.addEventListener("focus", this.#controlFocus, false);
		}



		if (this.isFirstMount)
		{
			if (document.activeElement === control)
				this.focus();
			else
				this.#focusOnMount();
		}
		else
		{
			this.#focusOnUpdate();
		}


		this.updateBorderers();

	}


	//@$log.m
	didMount()
	{

		this.#addToParent();


		this.props.onMount?.(this);
		this.callListenerEvent("mount", this);

	}




	//@$log.m
	updateDidUnmount()
	{

		let { el } = this;
		if (!el) return;

		el.removeEventListener("mouseover", this.#onHover);
		el.removeEventListener("mouseleave", this.#onUnhover);

		let control = this.getDOMControl(el);
		control?.removeEventListener("focus", this.#controlFocus);

	}


	//@$log.m
	didUnmount()
	{

		this._unmounted = true;


		if (this.props.onUnmount)
		{
			this.props.onUnmount(this);
		}

		else if (this.hasListenerEvent("unmount"))
		{
			this.callListenerEvent("unmount", this);
		}


		this.#unfocusOnUnmount();



		coreUnmountFocuser(this);


		this.#removeFromParent();

	}




	#addToParent()
	{

		let parent = this.parent;

		if (!parent)
		{
			!this.root && $log.error(`Не удаётся найти parent`);
			return;
		}


		parent.addItem(this);


		if (this.props.exitSlot)
		{
			//$log("add exitSlot:", parent, ".exitSlot = ", this);
			parent.exitSlot = this;
		}

	}


	#removeFromParent()
	{

		let parent = this.parent;

		if (!parent)
			return;

		parent.removeItem(this);

		if (parent.exitSlot === this)
		{
			parent.exitSlot = undefined;
		}

	}



	//---



	//componentDidMount()
	//{

	//	coreMountFocuser(this);


	//	if (!this.root)
	//	{

	//		let parent = this.parent;

	//		if (!parent)
	//		{
	//			$log.error(`Не удаётся найти parent`);
	//			return;
	//		}


	//		parent.addItem(this);


	//		if (this.props.exitSlot)
	//		{
	//			//$log("add exitSlot:", parent, ".exitSlot = ", this);
	//			parent.exitSlot = this;
	//		}

	//	}


	//	this.#focusOnMount();


	//	this.props.onMount?.(this);


	//	this.callListenerEvent("mount", this);


	//}



	async #focusOnMount()
	{

		let { autoFocus } = this.props;


		if (autoFocus)
		{

			if (typeof autoFocus === "number")
			{
				await adelay(autoFocus);
			}

			await this.focusAutoFocus() || this.ghost && await this.focusLastItemOrFirstWithHighPriority();

		}

	}


	#controlFocus = () => this.focus();


	async #focusOnUpdate()
	{

		if (this.focused && this.disabled /*&& !Bindera.$responseHasAction("focus")*/)
		{
			await this.focusNearest();
		}

	}


	async #unfocusOnUnmount()
	{

		if (this.focused && currentFocuser() === this)
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

	}



	//initElement(el: HTMLElement | null | undefined)
	//{

	//	if (!el)
	//		return;


	//	let props = this.props;
	//	//this.domLevel = domLevel(el);


	//	if (props.hover/* !== false*/)
	//	{
	//		el.addEventListener("mouseover", this.onHover, false);
	//		el.addEventListener("mouseleave", this.onUnhover, false);
	//	}



	//	if (props.domFocus)
	//	{

	//		let control = this.getDOMControl(el);

	//		if (control)
	//		{
	//			control.addEventListener("focus", () => this.focus(), false);

	//			if (document.activeElement === control)
	//				this.focus();
	//		}

	//	}



	//	//this.updateCarets(null);
	//	this.updateBorderers();

	//}



	get caret() { return this.carets[0] || null; }


	registerCaret(caret: CaretBehavior)
	{
		this.carets.register(caret);
	}

	unregisterCaret(caret: CaretBehavior)
	{
		this.carets.remove(caret);
	}



	//@$log.m
	updateCarets(prior: Focuser | null, mustRepaint: boolean)
	{

		if (!this.canFocusCaret())
			return;


		if (!this.carets.length)
		{
			$log.error(`Focuser: не найден Focuser.Caret для "${this}"`);
			$log._("focuser:", this);
			$log._("focuser.el:", this.el);
		}

		else if (this.carets.length === 1)
		{
			this.carets[0].update(prior, mustRepaint);
		}

		else
		{
			this.carets.reverse().forEach(a => a.update(prior, mustRepaint));
		}

	}



	//---



	registerBorderer(borderer: (ff: Focuser) => void)
	{
		(this.borderers ?? (this.borderers = [])).register(borderer);
	}

	unregisterBorderer(borderer: (ff: Focuser) => void)
	{
		this.borderers?.remove(borderer);
	}


	updateBorderers()
	{
		this.borderers?.forEach(a => a(this));
	}


	registerItemBorderer(borderer: (ff: Focuser) => void)
	{
		(this.itemBorderers ?? (this.itemBorderers = [])).register(borderer);
	}

	unregisterItemBorderer(borderer: (ff: Focuser) => void)
	{
		this.itemBorderers?.remove(borderer);
	}


	updateItemBorderers()
	{

		this.itemBorderers && $log(this + " updateItemBorderers")

		this.itemBorderers?.forEach(a => a(this));
	}



	//---



	//shouldComponentUpdate()
	//{

	//	this._prioriry = undefined;
	//	this._level = undefined;

	//	return true;// super.shouldComponentUpdate(nextProps, nextState);

	//}



	//componentDidUpdate()
	//{

	//	this.updateBorderers();
	//	//this.updateCarets(null);


	//	if (this.focused && this.disabled /*&& !Bindera.$responseHasAction("focus")*/)
	//	{
	//		this.focusNearest();
	//	}

	//}



	//componentWillUnmount()
	//{

	//	this._unmounted = true;


	//	//$log("currentFocuser():", currentFocuser());


	//	if (this.props.onUnmount)
	//	{
	//		this.props.onUnmount(this);
	//	}

	//	else if (this.hasListenerEvent("unmount"))
	//	{
	//		this.callListenerEvent("unmount", this);
	//	}

	//	else if (this.focused && currentFocuser() === this)
	//	{

	//		//this.unfocus();

	//		if (/*this.props.disabledFocusOnUnmount !== true &&*/
	//			!isDisabledFocusOnUnmount()
	//			//**&& !Bindera.$responseHasAction("focus")
	//		)
	//		{
	//			Task.run(() => this.focusNearest());
	//			//this.focusNearest();
	//		}
	//		else
	//			this.unfocus();

	//	}



	//	coreUnmountFocuser(this);

	//	//this.cursor?.removeFocuser(this);


	//	let { el } = this;

	//	el?.removeEventListener("mouseover", this.onHover);
	//	el?.removeEventListener("mouseleave", this.onUnhover);


	//	//this.#elRef.current = null;



	//	let parent = this.parent;

	//	if (!parent)
	//		return;



	//	parent.removeItem(this);

	//	if (parent.exitSlot === this)
	//		parent.exitSlot = undefined;  //null;



	//}



	//@$log.m
	//render(children: ReactNode)
	//{

	//	this.clearState();



	//	let body: ReactNode = <FocuserContext.Provider
	//		value={this}
	//		children={children}
	//	/>;


	//	if (this.props.cursor)
	//	{

	//		this.setCursorEl ??= a => this._cursorEl = a;


	//		body = <>
	//			{body}
	//			<Div ref={this.setCursorEl} display="none" />
	//		</>;
	//	}


	//	return body;

	//}



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
			FocuserBehavior.lastItemsOfBro[this.cls] =
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

		if (_nvgId === FocuserBehavior._lastNavigationId)
			return;


		FocuserBehavior._lastNavigationId = _nvgId;


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


			if (res instanceof FocuserBehavior)
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

			if (res instanceof FocuserBehavior)
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


			if (res instanceof FocuserBehavior)
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


			if (res instanceof FocuserBehavior)
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
			$log.error("Как-то странно:", this, "не нашёл себя в items в", this.parent);
			throw Error(`Как-то странно: не нашёл себя в parent.items`);

		}


		if (match == null)
			match = a => a.canFocus();


		for (let j = i - 1; j >= 0; j--)
		{

			let res = /*siblings[j].enabled &&*/ match(siblings[j]);


			if (res === true)
				return siblings[j];


			if (res instanceof FocuserBehavior)
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
			$log.error("Как-то странно:", this, "не нашёл себя в items в", this.parent);
			throw Error(`Как-то странно: не нашёл себя в parent.items`);
		}


		if (match == null)
			match = a => a.canFocus();


		for (let j = i + 1, len = siblings.length; j < len; j++)
		{

			let res = /*siblings[j].enabled &&*/ match(siblings[j]);


			if (res === true)
				return siblings[j];


			if (res instanceof FocuserBehavior)
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


	canFocusCaret()
	{
		return !this.ghost && this.enabled;
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
				let ff2 = await this.focusFirst(focusProps2);

				if (ff2)
					return ff2;
			}


			if (focusLast && !disabled)
			{
				let ff2 = await this.focusLast(focusProps2);

				if (ff2)
					return ff2;
			}


			if (enter && !disabled)
			{
				let ff2 = await this.enter(focusProps2) || await this.focus(focusProps2);

				if (ff2)
					return ff2;
			}

			if (focusProps.outer && !this.canFocus())
			{
				return await this.focusParent(focusProps2);
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

		//$log("doFocus");

		focuserFocus(this, focusProps);


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



	//@$log.m
	onFocus(
		prior: Focuser | null,
		next: Focuser | null,
		focusProps: FocusActionProps | null | undefined,
		mustRepaint: boolean
	)
	{
		//_$log("onFocus")

		//$log("this.props.borderer:", this.props.borderer)


		//$log("parent:", this.parent);

		this.props.onFocus?.(this, prior, next);

		this.callListenerEvent("focus", this, prior, next);


		this.parent?.setLastFocusedItem(this);


		this.updateCarets(prior, mustRepaint);
		this.updateBorderers();

	}



	onItemFocus(prior: Focuser | null, next: Focuser | null)
	{

		this.props.onItemFocus?.(this, prior, next);

		this.callListenerEvent("itemFocus", this, prior, next);

		this.updateItemBorderers();

	}


	onItemUnfocus(prior: Focuser | null, next: Focuser | null)
	{

		this.props.onItemUnfocus?.(this, prior, next);

		this.callListenerEvent("itemUnfocus", this, prior, next);

		this.updateItemBorderers();

	}


	//@$log.m
	onChangeItemFocus(
		prior: Focuser | null,
		next: Focuser | null,
		mustRepaint: boolean
	)
	{
		//_$log("onChangeItemFocus")
		this.props.onChangeItemFocus?.(this, prior, next);

		this.callListenerEvent("changeItemFocus", this, prior, next);


		this.updateCarets(prior, mustRepaint);
		this.updateBorderers();

	}


	//@$log.m
	onUnfocus(
		prior: Focuser | null,
		next: Focuser | null,
		mustRepaint: boolean
	)
	{

		if (this._unmounted)
			return;

		//_$log(this + " onUnfocus")

		this.exitTargetId = null;

		this.props.onUnfocus?.(this, prior, next);

		this.callListenerEvent("unfocus", this, prior, next);

		this.updateCarets(prior, mustRepaint);
		this.updateBorderers();


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

		if (FocuserBehavior.domFocusing)
			return false;


		let control = this.getDOMControl();

		if (!control)
			return false;


		if (control === document.activeElement)
			return false;


		FocuserBehavior.domFocusing = true;

		try
		{
			delay && await adelay(100);
			control.focus();
			(control as any)["select"]?.();
		}
		finally
		{
			FocuserBehavior.domFocusing = false;
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



	scrollIntoView(cfg?: Scroll.ScrollIntoViewOptions)
	{

		//_$log("scrollIntoView");

		let { el } = this;


		if (this.props.scrollIntoView === false || !el || !this.cursorEl)
			return false;


		let container = this.cursorEl.parentElement;
		//$log("container:", container);
		if (!container)
			return false;


		let topOffset = cfg?.topOffset ?? Scroll.scrollIntoViewYOffset;


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


		Scroll.scrollToTop(container, top);


		return true;

	}



	scrollIntoViewTop(cfg?: Scroll.ScrollIntoViewOptions): boolean
	{

		let { el } = this;


		if (!el)
			return false;


		let container = this.cursorEl?.parentElement;
		//$log("container:", container);
		if (!container)
			return false;


		let topOffset = cfg?.topOffset ?? Scroll.scrollIntoViewTopOffset;

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



	focusParentIfCan(focusProps?: FocusActionProps | null)
	{

		let parent = this.parentBy();

		if (!parent?.canFocus())
			return null;

		return parent.focus(focusProps) || null;

	}



	focusParentFirst(focusProps?: FocusActionProps | null)
	{

		let parentFirst = this.parentBy(a => a.enabled)?.first();

		return parentFirst?.focus(focusProps) || null;

	}



	focusParentFirstIfCan(focusProps?: FocusActionProps | null)
	{

		let parentFirst = this.parentBy(a => a.enabled)?.first();

		if (!parentFirst?.canFocus())
			return null;

		return parentFirst.focus(focusProps) || null;

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

		let lastItemOfBro = FocuserBehavior.lastItemsOfBro[cls];

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

		let props: Focuser.Props = this.props;

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

		if (!FocuserBehavior.TRACE_DISABLED_CHECKS)
			return false;



		$log.error("Попытка провести операцию над disabled-focuser-ом!");
		$log._("ff:", this);

		$log._error("disabled:", this.disabled);

		if (this.priority < $min_priority)
		{
			$log.__error("priority < $min_priority");
			$log.___error("priority:", this.priority);
			$log.___error("$min_priority:", $min_priority);
		}


		$log._error("baseDisabled:", this.baseDisabled);


		//if (this._baseDisabled)
		//{
		//	$log.__error("this._baseDisabled:", this._baseDisabled);
		//}


		if (this._unmounted)
		{
			$log.__error("unmounted:", this._unmounted);
		}


		if (this.props.disabled && !this.props.forceEnabled)
		{
			$log.__error("props.disabled:", this.props.disabled);
		}


		if (SpaWaitingMask.isWaiting())
		{
			$log.__error("SpaWaitingMask.isWaiting:", SpaWaitingMask.isWaiting());
		}


		if (this.props.disableIfParentIsCollapsed && this.parentIsCollapsed)
		{
			$log.__error("props.disableIfParentIsCollapsed:", this.props.disableIfParentIsCollapsed);
			$log.__error("parentIsCollapsed:", this.parentIsCollapsed);
		}


		if (this.props.disableIfParentIsNotFocused && this.parentIsNotFocused)
		{
			$log.__error("props.disableIfParentIsNotFocused:", this.props.disableIfParentIsNotFocused);
			$log.__error("parentIsNotFocused:", this.parentIsNotFocused);
		}


		if (this.parent?.baseDisabled)
		{
			$log.__error("parent.baseDisabled:", this.parent!.baseDisabled);
			$log.b("parent:", () => this.parent!.checkDisabled());
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


		if (await this.callListenerEventUntil("enter", this))
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



			if (await parent.callListenerEventUntil("itemEnter", parent!, this))
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


		if (await this.callListenerEventUntil("exit", this))
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

						if (focusResult instanceof FocuserBehavior)
							return focusResult;

						if (focusResult !== false)
							return null;

						//}

					}


					let ff = await this.callListenerEventUntilFocuser("exit", this);

					if (ff !== undefined)
						return ff;

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


		if (await this.callListenerEventUntil("insert", this))
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


		if (await this.callListenerEventUntil("activate", this, !!this._activated))
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


		if (await this.callListenerEventUntil("delete", this))
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



		if (await this.callListenerEventUntil("select", this))
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



	async forceAnimation(delay: number = $defaultAnimationDurationMs)
	{

		this.useForceAnimation = true;

		await adelay(delay);

		this.useForceAnimation = false;

	}



	async fastAnimation(delay: number = $defaultAnimationDurationMs)
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
			delay = $defaultAnimationDurationMs + (delayOffset || 0);
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
				$log.error(ex);
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


		if (await this.callListenerEventUntil("keyDown", this, e))
			return;


		let key = e.key as any;
		let code = e.code;
		let alt = e.altKey;
		let ctrl = e.ctrlKey;
		let shift = e.shiftKey;


		if (!alt && !ctrl && !shift)
		{
			if (key === Keys.ArrowUp || key === Keys.ArrowDown || key === Keys.Enter || key === " " ||
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

				let ff = await this.callListenerEventUntilFocuser("focusLeft", this, e);

				if (ff !== undefined)
					return ff;

			}

			else if (dir === "up")
			{

				if (props.onFocusUp && await props.onFocusUp(this) !== false)
					return null;

				let ff = await this.callListenerEventUntilFocuser("focusUp", this, e);

				if (ff !== undefined)
					return ff;

			}

			else if (dir === "right")
			{

				if (props.onFocusRight && await props.onFocusRight(this) !== false)
					return null;

				let ff = await this.callListenerEventUntilFocuser("focusRight", this, e);

				if (ff !== undefined)
					return ff;

			}

			else if (dir === "down")
			{

				if (props.onFocusDown && await props.onFocusDown(this) !== false)
					return null;

				let ff = await this.callListenerEventUntilFocuser("focusDown", this, e);

				if (ff !== undefined)
					return ff;

			}



			if (_nvgId == null)
				_nvgId = FocuserBehavior._navigationCount++;



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



		if (await this.callListenerEventUntil("keyDown", this, e))
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

			if (key === Keys.ArrowLeft || code === "KeyA")
			{

				e.preventDefault();

				await Task.run(() => this.navigate("left", e, ignoreOnKeyboardNavigation));

			}


			else if (key === Keys.ArrowRight || code === "KeyD")
			{

				e.preventDefault();

				await Task.run(() => this.navigate("right", e, ignoreOnKeyboardNavigation));

			}


			else if (key === Keys.ArrowUp || code === "KeyW")
			{

				e.preventDefault();

				if (!await Task.run(() => this.navigate("up", e, ignoreOnKeyboardNavigation)))
				{
					Scroll.vScroll(this.cursorEl, /*this.el,*/ -1 as -1);
				}

			}


			else if (key === Keys.ArrowDown || code === "KeyS")
			{

				e.preventDefault();

				if (!await Task.run(() => this.navigate("down", e, ignoreOnKeyboardNavigation)))
				{
					Scroll.vScroll(this.cursorEl, /*this.el,*/ 1);
				}

			}


			else if (this.enabled)
			{

				if (key === Keys.Enter || code === "KeyE")
				{
					e.preventDefault();
					await Task.run(() => this.enterOrFocusNext());
				}


				else if (key === Keys.Escape || code === "KeyQ")
				{
					e.preventDefault();
					await Task.run(() => this.exit());
				}


				else if (key === Keys.Insert)
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


				else if (key === Keys.Delete)
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


				else if (key === Keys.Shift)
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
		return this.enabled && !!(
			this.props.click /*&& !this.ghost*/ ||
			this.props.onClick ||
			this.hasListenerEvent("click")
		);
	}


	canContextMenu()
	{
		return this.enabled && !!(
			this.props.onContextMenu ||
			this.hasListenerEvent("contextMenu")
		);
	}



	async onClick(e: MouseEvent): Promise<boolean>
	{

		if (!this.canClick())
			return false;



		let props = this.props;

		//$log("props.onClick:", props.onClick);

		if (props.onClick && await props.onClick(this, e) !== false)
			return true;

		if (await this.callListenerEventUntil("click", this, e))
			return true;


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


		if (await this.callListenerEventUntil("contextMenu", this, e))
			return true;


		if (await this.defaultContextMenu(e))
			return true;


		return !!this.parent && this.parent.canContextMenu() && await this.parent.onContextMenu(e);

	}



	async defaultContextMenu(e: MouseEvent)
	{
		return false;
	}



	#onHover = (e: MouseEvent) =>
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



	#onUnhover = (e: MouseEvent) =>
	{

		//if (unhoverFocuser(this))
		//{
		//	e.stopPropagation();
		//}

	}



	//---

}