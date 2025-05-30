import { type ReactNode } from 'react';
import type { RouterBehavior } from "./RouterBehavior";






//===






export interface RouteBehaviorProps
{

	key: string;
	//stateKey?: string | null;

	onActivating?: () => Promise<boolean | void | undefined> | boolean | void | undefined;
	onActivated?: () => void;
	//onDeactivate?: () => Promise<boolean>;

	icon?: React.ReactNode | ((route: RouteBehavior) => ReactNode);
	title?: ReactNode | ((route: RouteBehavior) => ReactNode);
	description?: ReactNode | ((route: RouteBehavior) => ReactNode);

	content?: ReactNode | ((route: RouteBehavior) => ReactNode);


}






export class RouteBehavior<TProps extends RouteBehaviorProps = RouteBehaviorProps>
{

	//---



	constructor(props: TProps)
	{
		this.props = props;
	}



	//---



	static instanceCount = 0;
	iid = `route#${RouteBehavior.instanceCount++}`;


	props: TProps;


	get key(): string { return this.props.key; }

	#router: RouterBehavior | null = null;

	get active(): boolean { return this.#router?.activeRoute === this; }

	index(): number | null
	{
		let i = this.#router?.routes.indexOf(this);
		return i == null || i < 0 ? null : i;
	}


	lastActivateTime?: Date;


	//globalState?: GlobalState;



	//---



	toString()
	{
		return `RouteBehavior#${this.iid}`;
	}


	registred(router: RouterBehavior)
	{
		this.#router = router;
	}

	//use(props?: { defaultActive?: boolean; })
	//{

	//	let router = this._router = Router.use();


	//	//this.globalState = GlobalState.use(this.key);


	//	let registred = this._router?.register(this);

	//	useEffect(
	//		() => () => { registred && this._router?.unregister(this); },
	//		[]
	//	);


	//	if (router && router.activeKey !== undefined)
	//	{
	//		if (this.key === router.activeKey)
	//		{
	//			router.setActiveRoute(this);
	//		}
	//	}

	//	else if (router && !router.activeRoute && (props?.defaultActive || router.defaultActiveKey !== undefined))
	//	{
	//		if (props?.defaultActive || this.key === router.defaultActiveKey)
	//		{
	//			router.setActiveRoute(this);
	//		}
	//	}


	//	return this;

	//}



	//---



	activate = async (): Promise<boolean> =>
	{

		if (this.active)
		{
			//await this.focusContent();
			return false;
		}


		let activated = await this.#router?.activate(this) || false;

		return activated;

	}



	activated()
	{

		this.lastActivateTime = new Date();

		this.props.onActivated?.();

		this.#router?.props.onActivated?.(this);

	}


	//@$log.m
	//async focusContent()
	//{
	//	this.#router?.props.focusContent?.(this);
	//}



	//---



	icon(): React.ReactNode | undefined
	{
		return (typeof this.props.icon === 'function'
			? (this.props.icon as any)?.(this) || undefined
			: this.props.icon || undefined
		);
	}


	title(): ReactNode | undefined
	{
		return (typeof this.props.title === 'function'
			? (this.props.title as any)?.(this) || undefined
			: this.props.title || undefined
		);
	}


	description(): ReactNode | undefined
	{
		return (typeof this.props.description === 'function'
			? (this.props.description as any)?.(this) || undefined
			: this.props.description || undefined
		);
	}


	content(): ReactNode | undefined
	{
		return (typeof this.props.content === 'function'
			? (this.props.content as any)?.(this) || undefined
			: this.props.content || undefined
		);
	}



	//---

}


