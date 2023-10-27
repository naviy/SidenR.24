import { createContext, useContext, useState, type ReactNode } from "react";
import { $error } from "./utils";






//===






export interface GlobalState
{
	[prop: string]: GlobalState.Value | undefined
}




export function GlobalState(props: {
	state: GlobalState;
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


	if (state === undefined)
	{
		if (!name)
		{
			throw new Error(`GlobalState: properties 'state' is ${state} and 'name' is ${name}`);
		}

		state = GlobalState.use<GlobalState>(name);
	}


	return <GlobalState.Context.Provider
		value={state}
		children={props.children}
	/>;

}







export module GlobalState
{


	//---





	export type Value = string | number | Date | null;


	export interface Node
	{
		[key: string]: GlobalState | Value | undefined;
	};




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
	export function use<TState extends GlobalState = GlobalState>(name: string): TState;

	export function use<TState extends GlobalState = GlobalState>(arg0: GlobalState | string, arg1?: string): TState
	{

		let parentNode: Node | undefined;
		let name: string;


		if (typeof arg0 === "string")
		{

			parentNode = useContext(Context);
			name = arg0;

			if (!parentNode)
			{
				$error('GlobalState.use() можно использовать только внутри <GlobalState.Root ... />');
				parentNode = {};
			}

		}

		else
		{
			parentNode = arg0;
			name = arg1!;
		}



		let state = node<TState>(parentNode, name);


		return state;

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



	export function prop<
		TState extends GlobalState,// = GlobalState,
		TProp extends keyof TState,// = keyof TState,
		TValue extends TState[TProp],// = TState[TProp]
	>(
		state: TState,
		propName: TProp,
		value?: TValue,
		defaultValue?: TValue,
		emptyValue?: TValue
	): TValue | undefined
	{

		if (value !== undefined && value !== emptyValue)
		{

			if (value === defaultValue)
			{
				delete state[propName];
			}
			else
			{
				state[propName] = value;
			}


			return value;

		}


		value = state![propName] as any;


		if (value !== undefined)
			return value;


		if (defaultValue !== undefined)
			return defaultValue;


		return emptyValue;

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