import { $log, Focuser, GlobalState, Repaintable } from '@libs';
import type React from "react";
import { type ReactNode, type RefObject } from "react";
import { TentaCollector, type TentaCollectorPropsAlias, type TentaCollectorPropsAliases } from "./TentaCollector";
import type { TentaAccent } from './TentaAccent';






//===






export interface TentaGlobalState extends GlobalState
{

	expandPhase: TentaExpandPhase;
	openPhase: TentaOpenPhase;
	focused?: boolean;

}






//===






export type TentaExpandPhase = number;
export type TentaOpenPhase = number;




export interface TentaState extends TentaRestState
{

	expandPhase: TentaExpandPhase;
	openPhase: TentaOpenPhase;

	defaultMargin: number;

	isSeparated: boolean;

}



export interface TentaRestState
{

	bodyIsSeparated: boolean;
	bodyIsAccented?: boolean;

	tailIsVisible: boolean;
	tailIsSeparated: boolean;

	defaultMargin?: number;

	isSeparated?: boolean;

};






export class TentaBase<
	TRestStateEx extends {} = {},
	TTentaState extends TentaState & TRestStateEx = TentaState & TRestStateEx
> extends Repaintable()
	implements Repaintable
{

	//---


	constructor(
		//props: TentaInitProps
		public id: React.Key,
	)
	{
		super();
	}


	///** Вызывается вручную после создания и добавления коллекторов */
	//init()
	//{

	//}


	//---


	//get isTenta() { return true; }
	iid = ++TentaBase.instanceCount;


	//---



	parentCollector?: TentaCollector | null;

	get parentTenta(): TentaBase | null { return this.parentCollector?.parentTenta || null; }

	#priorSibling?: TentaBase | null;
	#nextSibling?: TentaBase | null;

	get isFirstSibling() { return !this.#priorSibling; }
	get isLastSibling() { return !this.#nextSibling; }


	collectors?: TentaCollector[];

	get hasCollectors() { return !!this.collectors?.length; }
	get collectorCount() { return this.collectors?.length || 0; }



	//---



	disabled = false;



	//---



	#state: TTentaState | null = null;
	priorState: TTentaState | null = null;


	get _state(): TTentaState | null
	{
		return this.#state;
	}

	get state(): TTentaState
	{
		return this.ensureState();
	}



	//---



	get expandPhase(): TentaExpandPhase { return this.#state?.expandPhase || 0; }
	get openPhase(): TentaOpenPhase { return this.#state?.openPhase || 0; }

	accessor maxExpandPhase: TentaOpenPhase = 2;
	accessor maxOpenPhase: TentaOpenPhase = 1;


	get defaultMargin(): number { return this.state.defaultMargin; }
	get maxMargin(): number { return 2; }


	get collapsed() { return !this.expandPhase; }
	get expanded() { return this.expandPhase === this.maxExpandPhase; }

	get closed() { return !this.openPhase; }
	get opened() { return this.openPhase === this.maxOpenPhase; }



	//---



	get isSeparated() { return this.state.isSeparated; }

	//get _bodyIsSeparated() { return this.#state?.bodyIsSeparated || false; }
	get bodyIsSeparated() { return this.state.bodyIsSeparated; }
	get bodyIsAccented() { return this.state.bodyIsAccented ?? this.#state!.bodyIsSeparated; }
	get bodyAccent(): TentaAccent { return this.bodyIsAccented ? 1 as const : 0 as const; }

	get tailIsVisible() { return this.state.tailIsVisible; }
	get tailIsSeparated() { return this.state.tailIsSeparated; }
	get tailIsVisibleAndSeparated() { return this.state.tailIsVisible && this.#state!.tailIsSeparated; }



	//---


	hideChildrenLinks = false;


	//---


	rootFfRef?: RefObject<Focuser> | null;
	get rootFf(): Focuser | null { return this.rootFfRef?.current || null; }


	//---



	override toString()
	{
		return `T##${this.iid}`;
	}



	//---



	#used = false;


	//@$log.m
	use(cfg?: TentaBase.UseConfig)
	{

		Repaintable.use(this, cfg);

		this.ensureState();

		this.#recalcCollectors();


		//if (cfg?.hideChildrenLinks != null)
		//{
		//	this.hideChildrenLinks = cfg.hideChildrenLinks;
		//}


		this.#used = true;


		return this;

	}


	//@$log.m
	useInNode(cfg?: TentaBase.UseConfig): void
	{

		if (!this.#used)
		{
			this.use(cfg);
		}


		this.#used = false;

	}



	//---


	addCollector(id: React.Key, propsAlias: TentaCollectorPropsAlias)
	{

		if (!propsAlias)
			return false;


		let props = typeof propsAlias === "function" ? { tentas: propsAlias } : propsAlias;

		if (!props)
			return false;


		let col = new TentaCollector(id, this, props);


		if (!this.collectors)
		{
			this.collectors = [col];
		}
		else
		{
			this.collectors.push(col);
		}


		return true;

	}



	addCollectors(cfg: TentaCollectorPropsAliases)
	{

		for (let id of Object.keys(cfg))
		{
			cfg[id] && this.addCollector(id, cfg[id] as TentaCollectorPropsAlias);
		}

	}



	#recalcCollectors()
	{
		//_$log(this + ".#recalcCollectors()")

		this.collectors?.forEach((col, i, all) =>
		{
			col.setSiblings(all[i - 1], all[i + 1]);
			col.ensureItems();
		});
	}



	setCollector(
		collector: TentaCollector | null,
		prior: TentaBase | null | undefined,
		next: TentaBase | null | undefined
	)
	{

		this.parentCollector = collector;

		this.#priorSibling = prior || null;
		this.#nextSibling = next || null;


		if (this.globalState === undefined)
		{
			this.globalState = GlobalState.node(collector?.globalState, this.id + "");
		}


		this.#loadFromGlobalState();

	}



	created()
	{

	}



	//---



	init(cfg?: {

		readonly maxExpandPhase?: TentaExpandPhase;
		readonly maxOpenPhase?: TentaOpenPhase;

		readonly defaultExpandPhase?: TentaExpandPhase;
		readonly defaultOpenPhase?: TentaOpenPhase;

		readonly restState?: () => Partial<TentaRestState & TRestStateEx>;

	})
	{

		if (cfg?.maxExpandPhase != null)
		{
			this.maxExpandPhase = cfg.maxExpandPhase;
		}

		if (cfg?.maxOpenPhase != null)
		{
			this.maxOpenPhase = cfg.maxOpenPhase;
		}


		if (cfg?.restState != null)
		{
			this.#restStateGetter = cfg.restState;
		}


		this.ensureState(cfg);

	}



	ensureState(cfg?: {
		readonly defaultExpandPhase?: TentaExpandPhase;
		readonly defaultOpenPhase?: TentaOpenPhase;
	}): TTentaState
	{

		if (this.#state != null)
			return this.#state;


		this.#state = this.getState(
			cfg?.defaultExpandPhase || 0,
			cfg?.defaultOpenPhase || 0
		);


		return this.#state;

	}



	refreshState()
	{
		this.setState(this.getState(
			this.#state?.expandPhase || 0,
			this.#state?.openPhase || 0
		));

		return this.#state;
	}



	getState(
		expandPhase: TentaExpandPhase,
		openPhase: TentaOpenPhase
	): TTentaState
	{

		let restState = this.getRestState(expandPhase, openPhase);

		if (this.#restStateGetter != null)
		{
			let addRestState = this.#restStateGetter();

			addRestState && Object.assign(restState, addRestState)
		}


		return {

			expandPhase,
			openPhase,

			defaultMargin: expandPhase === this.maxExpandPhase ? this.maxMargin : 1,

			...restState,

			isSeparated: restState.isSeparated !== undefined
				? restState.isSeparated
				: restState.bodyIsSeparated || restState.tailIsSeparated,

			//isSeparated: restState.bodyIsSeparated || restState.tailIsSeparated,

		} as TTentaState;

	}



	#restStateGetter?: () => Partial<TentaRestState & TRestStateEx>;


	getRestState(
		expandPhase: TentaExpandPhase,
		openPhase: TentaOpenPhase
	): TentaRestState & TRestStateEx
	{

		return {
			bodyIsSeparated: !!expandPhase,
			bodyIsAccented: !!expandPhase,
			tailIsVisible: !!openPhase,
			tailIsSeparated: expandPhase === this.maxExpandPhase,
		} as TentaRestState & TRestStateEx;

	}



	protected setState(newState: TTentaState | null | undefined)
	{

		if (!newState)
			return false;


		//_$log(this + ".setState:", newState)

		let priorState = this.state;

		this.#state = newState;

		this.#stateChanged(priorState);


		this.repaintNearests();


		return true;

	}



	#stateChanged(priorState: TTentaState)
	{

		let s0 = priorState;
		let s1 = this.state;

		this.priorState = priorState;


		try
		{

			//_$log("onPhaseChanging " + this);
			if (s0?.expandPhase !== s1.expandPhase)
			{
				this.onExpandPhaseChanged(s0.expandPhase);
			}

			if (s0?.openPhase !== s1.openPhase)
			{
				this.onOpenPhaseChanged(s0.openPhase);
			}


			this.#recalcCollectors();

			this.#saveToGlobalState();


			//this.parentCollector?.itemStateChanged();
			this.parentTenta?.recalcTentasInfo();


			if (s0?.expandPhase != null)
			{

				if (s1.expandPhase < s0.expandPhase)
				{
					this.onCollapse();
					this.parentTenta?.onItemCollapse(this);
				}
				else if (s1.expandPhase > s0.expandPhase)
				{
					this.onExpand();
					this.parentTenta?.onItemExpand(this);
				}

			}


			if (s0?.openPhase != null)
			{

				if (s1.openPhase < s0.openPhase)
				{
					this.onClose();
					this.parentTenta?.onItemClose(this);
				}
				else if (s1.openPhase > s0.openPhase)
				{
					this.onOpen();
					this.parentTenta?.onItemOpen(this);
				}

			}



			if (s0?.bodyIsSeparated != null && s0.bodyIsSeparated !== s1.bodyIsSeparated)
			{

				if (s1.bodyIsSeparated)
				{
					this.onBodySeparated();
					this.parentTenta?.onItemBodySeparated(this);
				}
				else
				{
					this.onBodyDeseparated();
					this.parentTenta?.onItemBodyDeseparated(this);
				}

			}

			if (s0?.tailIsSeparated != null && s0.tailIsSeparated !== s1.tailIsSeparated)
			{

				if (s1.tailIsSeparated)
				{
					this.onTailSeparated();
				}
				else
				{
					this.onTailDeseparated();
				}

			}


			if (s0?.isSeparated != null && s0.isSeparated !== s1.isSeparated)
			{

				if (s1.isSeparated)
				{
					this.onSeparated();
					this.parentTenta?.onItemSeparated(this);
				}
				else
				{
					this.onDeseparated();
					this.parentTenta?.onItemDeseparated(this);
				}

			}

		}
		finally
		{
			this.priorState = null;
		}

	}



	refresh()
	{
		this.refreshState();
		//this.repaint();
	}



	//---


	//maxItemStage: TentaStage | null = null;
	hasBodySeparatedItems: boolean = false;
	hasSeparatedItems: boolean = false;

	//collectorStateChanged()
	//{

	//	//$log(this + ".collectorPhaseChanged");

	//	this.recalcTentasInfo();

	//}



	//@$log.m
	recalcTentasInfo()
	{

		this.hasBodySeparatedItems = this.anyTenta(a => a.bodyIsSeparated);
		this.hasSeparatedItems = this.anyTenta(a => a.isSeparated);
		//$log("hasSeparatedItems:", this.hasSeparatedItems)
	}


	repaintNearests()
	{
		//__$log("repaintNearests " + this)


		let nearests = new Set<TentaBase | null | undefined>([
			this,
			this.#priorSibling,
			this.prior(),
			this.firstVisibleTenta(),
			this.lastVisibleTenta(),
			this.#nextSibling,
			this.next(),
		]);


		//startTransition(() =>
		//{
		nearests.forEach(a =>
		{

			if (a?.parentCollector && !a.parentCollector.isVisible())
				return;

			//___$log("repaint " + a)
			a?.repaint()
		});
		//});

	}



	//---



	//findPhaseState(
	//	startPhase: TentaPhase,
	//	dir: -1 | 1,
	//	match?: (state: TTentaState, bhv: this) => boolean
	//): TTentaState | null
	//{

	//	if (this.disabled)
	//		return null;


	//	let newPhase = TentaPhase.add(startPhase, dir, this.maxPhase);


	//	while (newPhase != null)
	//	{

	//		let newState = this.getState(newPhase);

	//		if (!match || match(newState, this))
	//		{
	//			return newState;
	//		}


	//		newPhase = TentaPhase.add(newPhase, dir, this.maxPhase);

	//	}


	//	return null;

	//}


	findExpandPhaseState(
		startExpandPhase: TentaExpandPhase,
		dir: -1 | 1,
		match?: (state: TTentaState, bhv: this) => boolean
	): TTentaState | null
	{

		if (this.disabled)
			return null;


		let newExpandPhase = startExpandPhase + dir;
		let { openPhase } = this;


		while (newExpandPhase >= 0 && newExpandPhase <= this.maxExpandPhase)
		{

			let newState = this.getState(newExpandPhase, openPhase);

			if (!match || match(newState, this))
			{
				return newState;
			}


			newExpandPhase += dir;

		}


		return null;

	}


	goToExpandPhase(dir: -1 | 1, match: (state: TTentaState, bhv: this) => boolean): boolean
	{

		let { state } = this;

		if (match(state, this))
			return false;


		let newState = this.findExpandPhaseState(state.expandPhase, dir, match);

		return this.setState(newState);


	}


	// TODO: this.update(() => this.incExpandPhase());


	setExpandPhase(value: TentaExpandPhase | null | undefined): boolean
	{

		if (value == null || value < 0 || value > this.maxExpandPhase || value === this.expandPhase)
			return false;


		let newState = this.getState(value, this.openPhase);

		return this.setState(newState);

	}


	expand(): boolean
	{
		return this.setExpandPhase(this.expandPhase + 1);
	}

	collapse(): boolean
	{
		return this.setExpandPhase(this.expandPhase - 1);
	}



	treeCollapse()
	{

		if (this.collapse())
			return true;


		if (this.hasBodySeparatedItems)
		{
			//this.forEachTenta(a => a.bodyDeseparate())
			this.forEachTenta(treeBodyDesaparate);
			return true;
		}

		//this.parentTenta?.refresh();

		return false;


		function treeBodyDesaparate(tenta: TentaBase)
		{
			tenta.forEachTenta(treeBodyDesaparate)
			tenta.bodyDeseparate();
		}

	}


	setOpenPhase(value: TentaOpenPhase | null | undefined): boolean
	{

		if (value == null || value < 0 || value > this.maxOpenPhase || value === this.openPhase)
			return false;


		let newState = this.getState(this.expandPhase, value);

		return this.setState(newState);

	}

	open(): boolean
	{
		return this.setOpenPhase(this.openPhase + 1);
	}


	close(): boolean
	{
		return this.setOpenPhase(this.openPhase - 1);
	}



	//---



	onExpandPhaseChanged(priorExpandPhase: number) { }
	onOpenPhaseChanged(priorOpenPhase: number) { }

	onCollapse() { }
	onExpand() { }
	onItemCollapse(item: TentaBase) { }
	onItemExpand(item: TentaBase) { }

	onClose() { }
	onOpen() { }
	onItemClose(item: TentaBase) { }
	onItemOpen(item: TentaBase) { }



	//---



	//setStage(newStage: TentaStage)
	//{
	//	return this.setPhase(this.phaseByStage(newStage));
	//}


	//collapse()
	//{
	//	return this.setStage("collapsed");
	//}

	//expand()
	//{
	//	return this.setStage("expanded");
	//}

	//open()
	//{
	//	return this.setStage("opened");
	//}



	//---



	onBodySeparated() { }
	onBodyDeseparated() { }
	onTailSeparated() { }
	onTailDeseparated() { }
	onSeparated() { }
	onDeseparated() { }

	onItemBodySeparated(item: TentaBase) { }
	onItemBodyDeseparated(item: TentaBase) { }
	onItemSeparated(item: TentaBase) { }
	onItemDeseparated(item: TentaBase) { }


	bodySeparate()
	{
		return this.bodyIsSeparated || this.goToExpandPhase(+1, a => a.bodyIsSeparated);
	}

	tailSeparate()
	{
		return this.tailIsSeparated || this.goToExpandPhase(+1, a => a.tailIsSeparated);
	}

	bodyDeseparate()
	{
		return !this.bodyIsSeparated || this.goToExpandPhase(-1, a => !a.bodyIsSeparated);
	}

	tailDeseparate()
	{
		return !this.tailIsSeparated || this.goToExpandPhase(-1, a => !a.tailIsSeparated);
	}



	//---



	collectorById(id: React.Key)
	{
		return this.collectors?.find(a => a.id === id) || null;
	}



	forEachTenta(action: (tenta: TentaBase) => void)
	{
		return !!this.collectors?.forEach(col => col.items?.forEach(action));
	}


	anyTenta(match: (tenta: TentaBase) => boolean)
	{
		return !!this.collectors?.find(col => col.items?.find(match));
	}


	allTentas(match: (tenta: TentaBase) => boolean)
	{
		return !this.anyTenta(a => !match(a));
	}


	hasVisibleTentas(): boolean
	{
		return !!this.collectors?.find(a => a.isVisible() && a.itemCount);
	}



	//---



	topIsSeparated()
	{
		return (
			this.bodyIsSeparated ||
			!!this.priorSibling()?.bodyIsSeparated ||
			!!this.priorSibling()?.tailIsSeparated ||
			!!this.prior()?.tailIsSeparated
		);
	}



	btmIsSeparated()
	{
		return this.bodyIsSeparated || !!this.next()?.bodyIsSeparated || this.isLastSibling && !!this.parentTenta?.tailIsSeparated;
	}



	topMargin(): number
	{

		let margin = this.bodyTopMargin();
		let { maxMargin } = this;


		if (margin < maxMargin)
		{
			let prior = this.prior();
			margin = !prior ? maxMargin : Math.max(margin, prior.btmMargin() || 0);
			//margin = Math.max(margin, prior?.btmMargin() || 0);
		}


		return margin;

	}



	btmMargin(): number
	{

		let margin = this.bodyBtmMargin();
		let { maxMargin } = this;


		if (margin < maxMargin)
		{
			let next = this.next();
			margin = !next ? 0 : Math.max(margin, next.bodyTopMargin() || 0);
		}


		if (margin < maxMargin)
		{
			margin = Math.max(margin, this.parentTailBtmMargin());
		}


		return margin;

	}



	bodyTopMargin(): number
	{
		return this.bodyIsSeparated ? this.defaultMargin : 0;
	}


	bodyBtmMargin(): number
	{
		return this.bodyIsSeparated && !this.tailIsVisible ? this.defaultMargin : this.tailIsSeparated ? 2 : 0;
	}


	tailBtmMargin(): number
	{
		return this.bodyIsSeparated ? this.defaultMargin : this.tailIsSeparated ? 2 : 0;
	}


	parentTailBtmMargin(): number
	{

		let parent = this.parentTenta;

		if (!parent)
			return 0;


		if (!this.isLastSibling || this.tailIsVisible && !this.tailIsSeparated && this.hasVisibleTentas())
		{
			return 0;
		}


		var { maxMargin } = this;


		return getParentTailBtmMargin(parent);


		function getParentTailBtmMargin(parent: TentaBase | null): number
		{

			if (!parent)
				return 0;


			let margin = Math.max(parent.tailBtmMargin(), parent.bodyBtmMargin());


			if (margin < maxMargin && parent.isLastSibling)
			{
				let parentMargin = getParentTailBtmMargin(parent.parentTenta);
				margin = Math.max(margin, parentMargin);
			}


			return margin;

		}

	}



	collectorIsVisible(collector: TentaCollector)
	{
		return this.state.tailIsVisible;
	}


	collectorIsSeparated(collector: TentaCollector)
	{
		return this.state.tailIsSeparated;
	}



	//---



	firstVisibleCollector(): TentaCollector | null
	{
		return this.tailIsVisible ? this.collectors?.find(a => a.isVisible()) || null : null;
	}

	lastVisibleCollector(): TentaCollector | null
	{
		return this.tailIsVisible ? this.collectors?.findLast(a => a.isVisible()) || null : null;
	}


	priorVisibleCollector(): TentaCollector | null
	{
		return this.parentCollector?.priorVisibleSibling() || null;
	}

	nextVisibleCollector(): TentaCollector | null
	{
		return this.parentCollector?.nextVisibleSibling() || null;
	}


	priorSibling(): TentaBase | null
	{
		return this.#priorSibling || null;
	}

	nextSibling(): TentaBase | null
	{
		return this.#nextSibling || null;
	}


	all(): TentaBase[] | null
	{
		return this.collectors?.flatMap(c => c.items) as TentaBase[] || null;
	}


	firstVisibleTenta(): TentaBase | null
	{
		return this.firstVisibleCollector()?.first() || null;
	}

	firstVisibleTentaOrMe(): TentaBase
	{
		return this.firstVisibleTenta() || this;
	}

	lastVisibleTenta(): TentaBase | null
	{
		return this.lastVisibleCollector()?.last()?.lastVisibleTentaOrMe() || null;
	}

	lastVisibleTentaOrMe(): TentaBase
	{
		return this.lastVisibleTenta() || this;
	}


	prior(): TentaBase | null
	{
		return (
			this.priorSibling()?.lastVisibleTentaOrMe() ||
			this.priorVisibleCollector()?.last() ||
			this.parentTenta ||
			null
		);
	}


	next(): TentaBase | null
	{

		let next = (
			this.firstVisibleTenta() ||
			this.nextSibling() ||
			this.nextVisibleCollector()?.first() ||
			this.parentTenta?.nextSibling() ||
			null
		);

		if (next)
			return next;


		let parent = this.parentTenta;

		while (parent)
		{

			next = parent.nextSibling();

			if (next)
				return next;

			parent = parent.parentTenta;

		}


		return null;

	}



	//---



	async focusBody(): Promise<Focuser | null>
	{
		return null;
	}



	async focusParentBody(): Promise<Focuser | null>
	{
		//	let { ff } = this;
		//	$log("ff", ff);
		//	$log("ff.parent", ff?.parentBy(a => a.enabled));
		//	$log("ff.parent.first", ff?.parentBy(a => a.enabled)?.first());
		//	return ff && await ff.focusParentFirstIfCan();

		let parent = this.parentTenta;

		while (parent)
		{
			let ff = await parent.focusBody();
			if (ff)
				return ff;

			parent = parent.parentTenta;
		}


		return null;

	}



	//---



	globalState?: TentaGlobalState;



	useGlobalState(nameOrState?: string | TentaGlobalState)
	{

		let globalState = GlobalState.use(nameOrState ?? (this.id + ""));

		this.setGlobalState(globalState);


		return this;

	}


	setGlobalState(value: TentaGlobalState)
	{
		this.globalState = value;

		this.#loadFromGlobalState();
	}



	#loadFromGlobalState()
	{

		if (!this.globalState)
			return;


		let expandPhase = GlobalState.get(this.globalState, 'expandPhase', this.expandPhase)!;
		let openPhase = GlobalState.get(this.globalState, 'openPhase', this.openPhase)!;

		if (expandPhase !== undefined || openPhase !== undefined)
			this.#state = this.getState(expandPhase, openPhase);

	}


	#saveToGlobalState()
	{

		if (!this.globalState)
			return;

		GlobalState.set(this.globalState, 'expandPhase', this.expandPhase, 0)!;
		GlobalState.set(this.globalState, 'openPhase', this.openPhase, 0)!;

	}



	getGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined
	{
		return GlobalState.get(this.globalState, propName, defaultValue);
	}


	setGlobalProp<TProp extends keyof TentaGlobalState>(
		propName: TProp,
		value: TentaGlobalState[TProp],
		defaultValue?: TentaGlobalState[TProp]
	): TentaGlobalState[TProp] | undefined
	{
		return GlobalState.set(this.globalState, propName, value, defaultValue);
	}



	//---



	render(): ReactNode
	{
		return null;
	}



	//---

}






export module TentaBase
{


	//---



	export var instanceCount = 0;



	//---



	export interface UseConfig extends Repaintable.UseConfig
	{

		//readonly hideChildrenLinks?: boolean;

	}



	//---


}






//===






export function isTenta(obj: any): obj is TentaBase
{
	return obj instanceof TentaBase;
}




