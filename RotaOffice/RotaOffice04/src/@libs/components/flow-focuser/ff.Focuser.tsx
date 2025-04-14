import React from "react";

import { Div, MuiColor } from "../core";

import { Values } from "../core";


import { type AnchorProps } from "./ff.Anchor";
import { Caret as Caret_ } from "./ff.Caret";
import { Events as Events_ } from "./ff.Events";
import { Task as Task_ } from "./ff.Task";
import { Core as Core_, currentFocuser } from "./ff.Core";
import { FocuserBehavior } from "./ff.FocuserBehavior";






//===






//let _re_ff_border_ = /^ff-border-/;





//===






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






export type Focuser = FocuserBehavior;



export module Focuser
{



	export var Context = React.createContext<Focuser | null>(null);


	export function useContext(): Focuser | null
	{
		return React.useContext(Context);
	}



	export var Core = Core_;


	export var current = currentFocuser;




	export type CaretProps = Caret_.Props;
	export import Caret = Caret_;



	export var Events = Events_;
	export type Listener = Events_.Listener;
	export type ff_Listener = Events_.ff_Listener;
	export var Tasks = Task_;





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






	//===






	export interface Props
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
		borderRadius?: Caret_.BorderRadius;
		borderWidth?: Caret_.BorderWidth;

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


		listener?: Events_.ff_Listener | null;

		onFocus?: Events_.Focus;
		onUnfocus?: Events_.Unfocus;
		onItemFocus?: Events_.ItemFocus;
		onItemUnfocus?: Events_.ItemUnfocus;
		onChangeItemFocus?: Events_.ChangeItemFocus;

		onClick?: Events_.Click;
		onContextMenu?: Events_.ContextMenu;
		onKeyDown?: Events_.KeyDown;

		onFocusLeft?: Events_.FocusDir;
		onFocusUp?: Events_.FocusDir;
		onFocusRight?: Events_.FocusDir;
		onFocusDown?: Events_.FocusDir;


		onEnter?: Events_.Enter/* | IMethodSemantic*/;
		onItemEnter?: Events_.ItemEnter/* | IMethodSemantic*/;
		onExit?: Events_.Exit/* | IMethodSemantic*/;

		onInsert?: Events_.Insert/* | IMethodSemantic*/;
		//onInspect?: InspectEvent/* | IMethodSemantic*/;
		onDelete?: Events_.Delete/* | IMethodSemantic*/;
		onActivate?: Events_.Activate/* | IMethodSemantic*/;
		onSelect?: Events_.Select/* | IMethodSemantic*/;

		onMount?: Events_.Mount;
		onUnmount?: Events_.Unmount;


		//div?: boolean;
		//className?: string;
		//style?: React.CSSProperties;

		defaultEntered?: boolean;

		click?: Events_.ClickBehavior | ((ff: Focuser) => Events_.ClickBehavior);
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








	export interface FocusActionProps extends Pick<Props, "domFocus">
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











	//====





	export function use(props: Props): Focuser
	{

		let parent = Focuser.useContext();


		let ffRef = React.useRef<Focuser>();


		let ff = ffRef.current ?? (ffRef.current = new FocuserBehavior(parent));

		ff.setProps(props);


		return ff;

	}


	export function useGhost(props?: Props): Focuser
	{

		return use({ ghost: true, ...props });

	}



	export function Area({ ff, children }: { ff: Focuser | null; children: React.ReactNode })
	{

		React.useLayoutEffect(() =>
		{
			ff?.willMount();
		}, []);

		React.useLayoutEffect(() =>
		{
			ff?.updateDidMount();
			return () => ff?.updateDidUnmount();
		});

		React.useLayoutEffect(() =>
		{
			ff?.didMount();
			return () => ff?.didUnmount();
		}, []);



		if (!ff)
			return null;



		ff.clearState();



		let body: React.ReactNode = <Context.Provider
			value={ff}
			children={children}
		/>;


		if (ff.props.cursor)
		{

			ff.setCursorEl ??= a => ff._cursorEl = a;


			body = <>
				{body}
				<Div ref={ff.setCursorEl} display="none" />
			</>;
		}


		return body;
		


	}



	export function Ghost({ children, ...props }: Props & { children: React.ReactNode })
	{

		let ff = use({ ghost: true, ...props });

		return <Area ff={ff} children={children} />;

	}



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
