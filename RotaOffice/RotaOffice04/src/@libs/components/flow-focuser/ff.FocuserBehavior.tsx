import React from "react";

import { $defaultAnimationDurationMs, $log } from "../core";

import { adelay, arequestAnimationFrame, Keys } from "../core";


import { anchorPropsToString, type Anchor, type AnchorPart, type AnchorProps } from "./ff.Anchor";
import { CaretBehavior } from "./ff.CaretBehavior";

import
{
	$min_priority, coreMountFocuser, coreUnmountFocuser, currentFocuser, focuserById, focuserFocus,
	isDisabledFocusOnUnmount, positionedFocusers, refreshModalFocusers, unfocus,
	type FocusConfig
} from "./ff.Core";

import { Events } from "./ff.Events";
import type { Focuser } from "./ff.Focuser";
import { findInDirection } from "./ff.Navigation";
import type { FocuserProps, ScopeOptions } from "./ff.Props";
import { scrollIntoView } from "./ff.Scroll";
import { Task } from "./ff.Task";
import { SpaWaitingMask } from "./ff.SpaWaitingMask";






//===






export var $focusExecutingCount = 0;






//===






export class FocuserBehavior
{

	//---



	static TRACE_DISABLED_CHECKS: boolean | undefined = false;



	//---



	constructor(
		public parent: Focuser | null,
	)
	{

	}


	props!: FocuserProps;


	useProps(props: FocuserProps)
	{

		this.props = props;


		let { parent } = this;


		this.scrollContainer = props.scrollable ? this : parent?.scrollContainer || null;

		this.scrollAnchorRef = props.scrollable ? React.createRef<HTMLDivElement>() : null;


		this.scope = parent?.isScope && parent.enabled
			? parent
			: parent?.scope || null;

		this.scopeOptions = props.scope === true
			? {}
			: props.scope || null;


		this.level = (this.ghost ? 0 : 1) + (parent?.level || 0);

		this.priority = (parent?.priority || 0) + (props.priority || 0);

		this.ghost = !!(
			props.ghost ||
			props.ghostIfParentIsCollapsed && parent?.isCollapsed ||
			props.ghostIfParentIsNotFocused && parent?.isNotFocused
		);


		this.ignoreOnKeyboardNavigation = (
			this.isNotFocused &&
			!!(props.ignoreOnKeyboardNavigation ?? parent?.ignoreOnKeyboardNavigation)
		);


	}



	//---



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



	get scrollContainerEl() { return this.scrollContainer?.scrollAnchorRef?.current?.parentElement || null; }

	scrollContainer: FocuserBehavior | null = null;
	scrollAnchorRef: React.RefObject<HTMLDivElement | null> | null = null;


	get isScope() { return !!this.props.scope; }
	scope: Focuser | null = null;
	scopeOptions: ScopeOptions | null = null;


	get isRoot(): boolean { return !!this.props.root };


	get isPositioned(): boolean
	{
		return !this.props.hnav && !this.props.vnav;
	}


	/** target element */
	get el(): HTMLElement | null { return this.elRef.current || null; }

	readonly elRef = React.createRef<HTMLElement>();
	get divRef() { return this.elRef as React.RefObject<HTMLDivElement> }


	get modal() { return !!this.props.modal; }


	level: number = 0;
	priority: number = 0;
	ghost: boolean = false;



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

		let { props, parent } = this;

		return !!(
			this.#unmounted ||
			props.disabled && !props.forceEnabled ||
			parent?.baseDisabled ||
			SpaWaitingMask.isWaiting() ||
			props.disableIfParentIsCollapsed && this.parent?.isCollapsed ||
			props.disableIfParentIsNotFocused && this.parent?.isNotFocused
		);

	}



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


	get isCollapsed() { return !!this.props.collapsed; }
	get isNotFocused() { return !(this.focused || this.itemFocused); }


	ignoreOnKeyboardNavigation = false;



	//clearState()
	//{
	//	//this._ghost = undefined; //null;
	//	//this._baseDisabled = undefined;//null;
	//	//this._ignoreOnKeyboardNavigation = undefined;//null;
	//}



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
			+ (this.isRoot ? " -root=" + this.isRoot : "")
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



	#unmounted?: boolean;

	get isFirstMount() { return this.#unmounted === undefined; }


	//@$log.m
	willMount()
	{

		coreMountFocuser(this);


		this.#addToParent();


		this.#unmounted = false;

	}


	//@$log.m
	updateDidMount()
	{

		//this._prioriry = undefined;
		//this._level = undefined;

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

		this.#unmounted = true;


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
			!this.isRoot && $log.error(`Не удаётся найти parent`);
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



	//---



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

		this.#recalcPositionOfAll(ffs, _nvgId);

		if (!this.position)
			this.#recalcPosition();


		//$log("ffs:", ffs.filter(a => a.position));

		return findInDirection(
			ffs, dir, this, match
		);

	}



	#recalcPosition()
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



	#recalcPositionOfAll(focusers: Focuser[], _nvgId: number | undefined)
	{

		if (_nvgId === FocuserBehavior._lastNavigationId)
			return;


		FocuserBehavior._lastNavigationId = _nvgId;


		focusers.forEach(ff =>
		{
			if (ff.canFocus() && ff.isPositioned)
			{
				ff.#recalcPosition();
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

			if (parent.isRoot)
				break;


			let priorParent = parent.priorSibling(a => a.lastOrMe(match));

			if (priorParent?.canFocus())
				return priorParent;


			parent = parent.parent;

		}



		parent = this.parent;


		while (parent)
		{

			if (!parent.isRoot && parent.canFocus())
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

			if (parent.isRoot)
				break;


			let nextParent = parent.nextSibling(a => a.firstOrMe(match));

			if (nextParent?.canFocus())
				return nextParent;


			parent = parent.parent;

		}



		parent = this.parent;


		while (parent)
		{

			if (!parent.isRoot && parent.canFocus())
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



	async focus(focusCfg?: FocusConfig | null): Promise<Focuser | null>
	{

		if (this.#unmounted)
		{
			//$error("Focuser: unmounted");
			return null;
		}


		//$log("focusing:", this.fullName(), this._el);

		let disabled = this.disabled;


		if (focusCfg)
		{

			if (focusCfg.skipIfItemFocused && this.itemFocused)
				return null;


			let { focusFirst, focusLast, enter, exitTarget, ...focusCfg2 } = focusCfg;



			if (!focusCfg.exitTarget && this.props.exitToPrior)
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
				let ff2 = await this.focusFirst(focusCfg2);

				if (ff2)
					return ff2;
			}


			if (focusLast && !disabled)
			{
				let ff2 = await this.focusLast(focusCfg2);

				if (ff2)
					return ff2;
			}


			if (enter && !disabled)
			{
				let ff2 = await this.enter(focusCfg2) || await this.focus(focusCfg2);

				if (ff2)
					return ff2;
			}

			if (focusCfg.outer && !this.canFocus())
			{
				return await this.focusParent(focusCfg2);
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


			this.#doFocus(focusCfg);


			//if (!(focusCfg?.awaitImmidiate))
			//await adelay($animationDurationMs + 50);

			if (!(focusCfg?.awaitImmidiate))
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



	#doFocus(focusCfg?: FocusConfig | null)
	{

		//$log("#doFocus");

		focuserFocus(this, focusCfg);


		let domFocus0 = focusCfg?.domFocus;
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
		focusCfg: FocusConfig | null | undefined,
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

		if (this.#unmounted)
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



	async focusIfCan(focusCfg?: FocusConfig | null)
	{

		if (!this.canFocus())
			return null;

		return await this.focus(focusCfg);

	}



	focusFirst(focusCfg?: FocusConfig | null)
	{
		return this.first()?.focus(focusCfg);
	}



	focusFirstWithHighPriority(focusCfg?: FocusConfig | null)
	{

		let first = this.first(null, ff => ff.itemsByPriority);

		//$log("first:", first);

		return first?.focus(focusCfg);

	}



	focusLast(focusCfg?: FocusConfig | null)
	{
		return this.last()?.focus(focusCfg);
	}



	focusBy(match: (ff: Focuser) => boolean | Focuser, focusCfg?: FocusConfig | null)
	{
		return this.itemBy(match)?.focus(focusCfg);
	}



	focusByName(name: string, focusCfg?: FocusConfig | null)
	{

		if (!name)
			return null;

		let item = this.itemBy(a => a.name === name);

		return item?.focus(focusCfg);

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



	//async focusByAnchor(anchor: string[], focusCfg?: FocuserProps | null)
	//{
	//	let item = this.itemByAnchor(anchor);
	//	return item && await item.focus(focusCfg);
	//}


	//focusPrior()
	//{
	//	let prior = this.prior();
	//	prior && prior.focus();
	//}



	focusNext(focusCfg?: FocusConfig | null, match?: (ff: Focuser) => boolean)
	{
		return this.next(match)?.focus(focusCfg) || null;
	}



	focusPrior(focusCfg?: FocusConfig | null, match?: (ff: Focuser) => boolean)
	{
		return this.prior(match)?.focus(focusCfg) || null;
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
			return next.focus(/*this.nextfocusCfg()*/);
		}



		let through = this.scopeOptions?.through;

		if (through && (through === true || through[dir]))
		{

			if (this.scope!.ghost)
			{
				return this.scope!.navigate(dir, e, match, _nvgId);
			}


			return this.scope!.focus(/*this.nextfocusCfg()*/);

		}


		return null;

	}



	focusParent(focusCfg?: FocusConfig | null)
	{

		let parent = this.parentBy();

		return parent?.focus(focusCfg) || null;

	}



	focusParentIfCan(focusCfg?: FocusConfig | null)
	{

		let parent = this.parentBy();

		if (!parent?.canFocus())
			return null;

		return parent.focus(focusCfg) || null;

	}



	focusParentFirst(focusCfg?: FocusConfig | null)
	{

		let parentFirst = this.parentBy(a => a.enabled)?.first();

		return parentFirst?.focus(focusCfg) || null;

	}



	focusParentFirstIfCan(focusCfg?: FocusConfig | null)
	{

		let parentFirst = this.parentBy(a => a.enabled)?.first();

		if (!parentFirst?.canFocus())
			return null;

		return parentFirst.focus(focusCfg) || null;

	}



	async focusNearest(focusCfg?: FocusConfig | null)
	{

		let ff = await this.focusExitTarget();

		if (ff)
			return ff;



		let parent = this.parent;


		while (parent)
		{

			if (parent.disabled)
			{
				if ((ff = await parent.focusExitTarget(focusCfg)))
					return ff;
			}
			else if (parent.ghost)
			{
				if ((ff = await parent.focusLastItem(focusCfg) || await parent.focusExitTarget(focusCfg)))
					return ff;
			}
			else
			{
				if ((ff = await parent.focusLastItem(focusCfg) || await parent.focus(focusCfg)))
					return ff;
			}


			parent = parent.parent;

		}



		return null;

	}



	focusOuter(focusCfg?: FocusConfig | null)
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
			return this.focus(focusCfg);

		return this.focusParent(focusCfg);
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



	focusLastItem(focusCfg?: FocusConfig | null)
	{
		return this.findLastItem()?.focus(focusCfg);
	}


	async focusLastItemOrFirst(focusCfg?: FocusConfig | null)
	{
		return await this.focusLastItem(focusCfg) || await this.focusFirst(focusCfg);
	}



	async focusLastItemOrFirstWithHighPriority(focusCfg?: FocusConfig | null)
	{
		return await this.focusLastItem() || await this.focusFirstWithHighPriority();
	}



	static lastItemsOfBro: {
		[broCls: string]: {
			itemCls: string | null;
			itemName: string | null;
		}
	} = {};



	async focusLastItemLikeBro(focusCfg?: FocusConfig | null)
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


		return item && await item.focus(focusCfg);

	}




	findAutoFocus(): Focuser | null
	{

		let props = this.props;

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



	focusAutoFocus(focusCfg?: FocusConfig | null): Promise<Focuser | null> | null
	{
		return this.findAutoFocus()?.focus(focusCfg) || null;
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



	focusAutoFocusItem(focusCfg?: FocusConfig | null): Promise<Focuser | null> | null
	{

		return this.findAutoFocusItem()?.focus(focusCfg) || null;

	}



	focusExitTarget(focusCfg?: FocusConfig | null): Promise<Focuser | null> | null
	{

		//$log("exitTargetId:", this.exitTargetId);

		let exitTarget = focuserById(this.exitTargetId);

		//$log("exitTarget:", exitTarget);

		this.exitTargetId = null;

		return exitTarget?.focus(focusCfg) || null;

	}



	//nextfocusCfg()
	//{

	//	let domFocus = useWASD && this.domIsFocused() || undefined;

	//	return { domFocus } as FocusConfig;

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


		if (this.#unmounted)
		{
			$log.__error("unmounted:", this.#unmounted);
		}


		if (this.props.disabled && !this.props.forceEnabled)
		{
			$log.__error("props.disabled:", this.props.disabled);
		}


		if (SpaWaitingMask.isWaiting())
		{
			$log.__error("SpaWaitingMask.isWaiting:", SpaWaitingMask.isWaiting());
		}


		if (this.props.disableIfParentIsCollapsed && this.parent?.isCollapsed)
		{
			$log.__error("props.disableIfParentIsCollapsed:", this.props.disableIfParentIsCollapsed);
			$log.__error("parentIsCollapsed:", this.parent?.isCollapsed);
		}


		if (this.props.disableIfParentIsNotFocused && this.parent?.isNotFocused)
		{
			$log.__error("props.disableIfParentIsNotFocused:", this.props.disableIfParentIsNotFocused);
			$log.__error("parentIsNotFocused:", this.parent?.isNotFocused);
		}


		if (this.parent?.baseDisabled)
		{
			$log.__error("parent.baseDisabled:", this.parent!.baseDisabled);
			$log.b("parent:", () => this.parent!.checkDisabled());
		}



		return false;

	}



	async enter(focusCfg?: FocusConfig | null): Promise<Focuser | null>
	{

		if (this.#unmounted)
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



		//if (focusCfg)
		//	focusCfg = { ...this.nextfocusCfg(), ...focusCfg } as FocusConfig;
		//else
		//	focusCfg = this.nextfocusCfg();



		let result: Focuser | null | undefined;



		if (props.lastItemLikeBro && (result = await this.focusLastItemLikeBro(focusCfg)) && result !== this)
		{
			return result;
		}


		if ((result = await this.focusLastItem(focusCfg)) && result !== this)
		{
			return result;
		}



		//else if (this.props.exitSlot && (result = await this.focusFirst(this.nextfocusCfg()) /*|| await this.exit()*/) && result !== this)
		//{
		//	return result;
		//}



		if ((result = await this.focusFirst(focusCfg)))
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



		//result = await this.focusNext(focusCfg);



		return null;

	}



	async enterOrFocus(focusCfg?: FocusConfig | null): Promise<Focuser | null>
	{

		if (this.hasItems && this._items!.find(a => a.enabled))
		{
			return await this.enter(focusCfg) || await this.focus(focusCfg);
		}
		else
		{
			return await this.focus(focusCfg);
		}

	}



	async enterOrFocusNext(): Promise<Focuser | null>
	{

		if (this.#unmounted)
			return null;


		return await this.enter() || await this.focusNext(/*this.nextfocusCfg()*/);

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

				if (!exitSlot.isRoot)
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

				else if (!parent.isRoot)
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



	scrollIntoView(cfg?: scrollIntoView.Options): boolean
	{


		if (this.props.scrollIntoView === false)
			return false;


		let { el } = this;
		if (!el)
			return false;


		let container = this.scrollContainerEl;
		if (!container)
			return false;


		return scrollIntoView(el, container, cfg);

	}



	scrollIntoViewTop(cfg?: scrollIntoView.Options): boolean
	{

		let { el } = this;
		if (!el)
			return false;


		let container = this.scrollContainerEl;
		if (!container)
			return false;


		return scrollIntoView.toTop(el, container, cfg);

	}



	scrollContainerTo(dir: -1 | 1)
	{

		let { scrollContainerEl } = this;

		scrollContainerEl?.scrollBy({
			top: dir * scrollContainerEl.offsetHeight / 10,
			behavior: "smooth",
		});

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


		if (this.isRoot)
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

		//return await this.focusInDirection(dir, this.nextfocusCfg());
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


				return next && await next.focus(/*this.nextfocusCfg()*/);

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

				await Task.run(() => this.navigate("left", e, isNavigable));

			}


			else if (key === Keys.ArrowRight || code === "KeyD")
			{

				e.preventDefault();

				await Task.run(() => this.navigate("right", e, isNavigable));

			}


			else if (key === Keys.ArrowUp || code === "KeyW")
			{

				e.preventDefault();

				if (!await Task.run(() => this.navigate("up", e, isNavigable)))
				{
					this.scrollContainerTo(-1);
				}

			}


			else if (key === Keys.ArrowDown || code === "KeyS")
			{

				e.preventDefault();

				if (!await Task.run(() => this.navigate("down", e, isNavigable)))
				{
					this.scrollContainerTo(1);
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




		function isNavigable(ff: Focuser)
		{
			return !ff.ignoreOnKeyboardNavigation;
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