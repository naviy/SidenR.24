import { createContext, useContext, useState, type ReactNode } from "react";
import { $error } from "./utils";






//===






export interface GlobalState
{
	[prop: string]: GlobalState.Value | undefined
}




export function GlobalState(props: {
	state: GlobalState | undefined;
	children: ReactNode;
}): JSX.Element;

export function GlobalState(props: {
	name: string;
	children: ReactNode;
}): JSX.Element;

export function GlobalState(props: {
	state?: GlobalState;
	name?: string;
	children: ReactNode;
})
{

	let { state, name } = props;


	if (state === undefined && name === undefined)
	{
		return props.children
	}


	if (state === undefined)
	{
		state = GlobalState.use<GlobalState>(name!);
	}


	return <GlobalState.Context.Provider
		value={state}
		children={props.children}
	/>;

}







export module GlobalState
{


	//---





	export type Value = string | number | Date | boolean | null;


	export interface Node
	{
		[key: string]: GlobalState | Value | undefined;
	}




	//---




	export function Root(props: {

		rootState?: GlobalState;
		compress?: boolean;

		children: ReactNode;

	})
	{

		let rootNode: Node | undefined = props.rootState;

		if (rootNode === undefined)
		{
			[rootNode] = useState<Node>(() => ({}));
		}


		props.compress && GlobalState.compress(rootNode);


		return <Context.Provider
			value={rootNode}
			children={props.children}
		/>;
	}




	//---




	export const Context = createContext<Node | undefined>(undefined);



	export function use<TState extends GlobalState = GlobalState>(parentState: GlobalState, name: string): TState;
	export function use<TState extends GlobalState = GlobalState>(nameOrState: string | TState): TState;

	export function use<TState extends GlobalState = GlobalState>(arg0: GlobalState | string | TState, arg1?: string): TState
	{

		//(name: string)
		if (typeof arg0 === "string")
		{

			let parentNode = useContext(Context);

			if (!parentNode)
			{
				$error('GlobalState.use() можно использовать только внутри <GlobalState.Root ... />');
				parentNode = {};
			}

			return node<TState>(parentNode, arg0)

		}


		// (parentState: GlobalState, name: string)
		if (typeof arg1 === "string")
		{
			return node<TState>(arg0, arg1)

		}


		// (state: GlobalState)
		return arg0 as TState;

	}




	//---




	export function node<TState extends GlobalState = GlobalState>(
		parentNode: Node,
		name: string
	): TState
	{

		let state = parentNode[name] as TState | null | undefined;

		if (!state)
		{
			parentNode[name] = state = {} as TState;
		}


		return state;
	}



	export function get<
		TState extends GlobalState,
		TProp extends keyof TState,
	>(
		state: TState | undefined,
		propName: TProp,
		defaultValue?: TState[TProp],
	): TState[TProp] | undefined
	{

		if (!state)
			return defaultValue;


		let value = state![propName] as any;


		if (value !== undefined)
			return value;


		return defaultValue;

	}



	export function set<
		TState extends GlobalState,
		TProp extends keyof TState,
	>(
		state: TState | undefined,
		propName: TProp,
		value: TState[TProp],
		defaultValue?: TState[TProp]
	): TState[TProp] | undefined
	{

		if (value === undefined)
		{
			return defaultValue;
		}


		if (state)
		{

			if (value === defaultValue)
			{
				delete state[propName];
			}
			else
			{
				state[propName] = value;
			}

		}


		return value;

	}



	export function prop<
		TState extends GlobalState,
		TProp extends keyof TState,
	>(
		state: TState,
		propName: TProp,
		value?: TState[TProp],
		defaultValue?: TState[TProp]
	): TState[TProp] | undefined
	{

		if (value !== undefined)
		{
			return set(state, propName, value, defaultValue);
		}


		return get(state, propName, defaultValue);

	}




	//---




	export function compress(node: Node | undefined)
	{

		if (node === undefined)
			return;


		//$log("compress");
		compress(node);
		//_$log("node:", _.cloneDeep(node));



		function compress(node: Node)
		{

			for (let propName in node)
			{

				if (!Object.prototype.hasOwnProperty.call(node, propName))
					continue;


				let value = node[propName];

				if (value === undefined)
				{
					delete node[propName];
				}

				else if (typeof value === 'object')
				{

					compress(value as Node);


					if (!Object.keys(value as Object).length)
					{
						delete node[propName];
					}

				}

			}

		}

	}




	//---


}