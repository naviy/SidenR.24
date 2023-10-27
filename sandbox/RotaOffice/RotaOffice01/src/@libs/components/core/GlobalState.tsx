import { createContext, useContext, useState, type ReactNode } from "react";
import { $error } from "./utils";






//===






export interface GlobalState
{
	[prop: string]: GlobalState.Value | undefined
}




export function GlobalState(props: {
	name: string;
	children: ReactNode;
})
{

	let { name } = props;


	if (!name)
	{
		throw new Error(`GlobalState: properties 'state' and 'name' is ${name}`);
	}


	let state = GlobalState.use<GlobalState>(name/*, props.init*/);


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




	//export type InitAction<TState extends GlobalState = GlobalState> = (

	//	propSetter: <TProp extends keyof TState, TValue extends TState[TProp]>(propName: TProp, value?: TValue, defaultValue?: TValue, emptyValue?: TValue) => TValue | undefined,

	//	state: TState

	//) => void;




	//---




	export function Root(props: {
		rootState?: GlobalState;
		children: ReactNode;
	})
	{

		let rootNode: Node | undefined = props.rootState;

		if (rootNode === undefined)
		{
			[rootNode] = useState<Node>(() => ({}));
		}


		return <Context.Provider
			value={rootNode}
			children={props.children}
		/>;
	}




	//---




	export const Context = createContext<Node | undefined>(undefined);




	export function use<TState extends GlobalState = GlobalState>(
		name: string,
		//init?: InitAction<TState>
	): TState
	{

		let parentNode = useContext(Context);

		if (!parentNode)
		{
			$error('GlobalState.use() можно использовать только внутри <GlobalState.Root ... />');
			parentNode = {};
		}


		let state = node<TState>(parentNode, name);


		//init && initialize(state, init);


		return state;


	}




	//---




	//export function initialize<TState extends GlobalState = GlobalState>(
	//	state: TState,
	//	init: InitAction<TState>
	//): void
	//{

	//	init(prop, state);



	//	function prop<TProp extends keyof TState, TValue extends TState[TProp]>(
	//		propName: TProp,
	//		value?: TValue,
	//		defaultValue?: TValue,
	//		emptyValue?: TValue
	//	): TValue | undefined
	//	{

	//		if (value !== undefined)
	//		{

	//			if (value === emptyValue)
	//			{
	//				delete state[propName];
	//			}
	//			else
	//			{
	//				state[propName] = value;
	//			}


	//			return value;

	//		}


	//		value = state![propName] as any;


	//		if (value === undefined)
	//		{

	//			if (defaultValue !== undefined)
	//			{
	//				state[propName] = value = defaultValue;
	//			}
	//			else
	//			{
	//				value = emptyValue;
	//			}

	//		}


	//		return value;

	//	}

	//}



	export function node<TState extends GlobalState = GlobalState>(
		parentNode: Node,
		name: string,
		//init?: InitAction<TState>
	): TState
	{

		let state = parentNode[name] as TState | null | undefined;

		if (!state)
		{
			parentNode[name] = state = {} as TState;
		}


		//init && initialize(state, init);


		return state as TState;
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

		if (value !== undefined)
		{

			if (value === emptyValue)
			{
				delete state[propName];
			}
			else
			{
				state[propName] = value;
			}


			return value!;

		}


		value = state![propName] as any;


		if (value === undefined)
		{

			if (defaultValue !== undefined)
			{
				state[propName] = value = defaultValue;
			}
			else
			{
				value = emptyValue;
			}

		}


		return value;

	}


	//export function prop<
	//	TState extends GlobalState = GlobalState,
	//	TProp extends keyof TState = keyof TState,
	//	TValue extends TState[TProp] = TState[TProp]
	//>(
	//	state: TState | null | undefined,
	//	propName: TProp,
	//	value?: TValue,
	//	defaultValue?: TValue
	//): TValue | undefined
	//{

	//	if (state == null)
	//		return undefined;


	//	if (value !== undefined)
	//	{

	//		if (value === defaultValue)
	//		{
	//			delete state[propName];
	//		}
	//		else
	//		{
	//			state[propName] = value;
	//		}


	//		return value;

	//	}


	//	value = state![propName] as TValue | undefined;


	//	if (value === undefined && defaultValue !== undefined)
	//	{
	//		value = defaultValue;
	//	}


	//	return value;

	//}




	//---




	export function compress(node: Node | undefined)
	{

		if (node === undefined)
			return;


		for (let propName in node)
		{

			if (!Object.prototype.hasOwnProperty.call(node, propName))
				continue;


			let value = node[propName];


			if (typeof value === 'object')
			{

				compress(value as Node);


				if (!Object.keys(value as Object).length)
				{
					delete node[propName];
				}

			}

		}

	}




	//---


}